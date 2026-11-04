import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

import { describeProbe, type ProbeResult, type Protocol } from './probe-status';

export type Target = {
  id: string;
  host: string;
  protocol: Protocol;
  port: number | null;
  interval: number;
  status: 'pending' | 'checking' | 'healthy' | 'down' | 'error' | 'unknown';
  rtt: number | null;
  jitter: number | null;
  loss: number | null;
  message: string;
  checkedAt: string | null;
};

let database: DatabaseSync | undefined;
export function db() {
  if (database) return database;
  const path = process.env.PROBE_DB_PATH ?? '/tmp/netviz-monitor.sqlite';
  mkdirSync(dirname(path), { recursive: true });
  database = new DatabaseSync(path);
  database.exec(`PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS targets (
      id TEXT PRIMARY KEY, host TEXT NOT NULL, protocol TEXT NOT NULL, port INTEGER,
      interval INTEGER NOT NULL DEFAULT 30, status TEXT NOT NULL DEFAULT 'pending',
      rtt REAL, jitter REAL, loss REAL, message TEXT NOT NULL DEFAULT 'Waiting for the first check.',
      checked_at TEXT, next_at INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS samples (
      id INTEGER PRIMARY KEY AUTOINCREMENT, target_id TEXT NOT NULL,
      status TEXT NOT NULL, rtt REAL, checked_at TEXT NOT NULL
    );`);
  return database;
}

export function targets(): Target[] {
  return db()
    .prepare(
      'SELECT id,host,protocol,port,interval,status,rtt,jitter,loss,message,checked_at AS checkedAt FROM targets ORDER BY rowid',
    )
    .all() as Target[];
}

export function addTarget(
  host: string,
  protocol: Protocol,
  port: number | null,
  interval: number,
) {
  const store = db();
  if (
    (
      store.prepare('SELECT count(*) AS total FROM targets').get() as {
        total: number;
      }
    ).total >= 20
  )
    return { error: 'Maximum of 20 targets.' };
  if (
    store
      .prepare(
        'SELECT id FROM targets WHERE host = ? COLLATE NOCASE AND protocol = ? AND port IS ?',
      )
      .get(host, protocol, port)
  )
    return { error: 'Target already exists.' };
  const id = crypto.randomUUID();
  store
    .prepare(
      'INSERT INTO targets (id,host,protocol,port,interval) VALUES (?,?,?,?,?)',
    )
    .run(id, host, protocol, port, interval);
  return { id };
}

export function removeTarget(id: string) {
  const store = db();
  store.prepare('DELETE FROM samples WHERE target_id=?').run(id);
  return store.prepare('DELETE FROM targets WHERE id=?').run(id).changes > 0;
}

const running = new Set<string>();
let schedulerStarted = false;

export async function checkTarget(id: string) {
  if (running.has(id)) return;
  const store = db();
  const target = store
    .prepare('SELECT id,host,protocol,port,interval FROM targets WHERE id=?')
    .get(id) as
    Pick<Target, 'id' | 'host' | 'protocol' | 'port' | 'interval'> | undefined;
  if (!target) return;
  running.add(id);
  store
    .prepare('UPDATE targets SET status=?,message=? WHERE id=?')
    .run('checking', 'Checking this target…', id);
  try {
    // Call the existing validated multi-protocol route locally. Every run still
    // resolves DNS, checks CIDRs and uses the isolated ICMP/UDP worker.
    const { POST } = await import('@/app/api/probe/route');
    const response = await POST(
      new Request('http://localhost/api/probe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          host: target.host,
          protocol: target.protocol,
          port: target.port,
        }),
      }),
    );
    const result = (await response.json()) as ProbeResult;
    const outcome = describeProbe(target.protocol, result);
    const checkedAt = new Date().toISOString();
    // A target may have been removed while its probe was running.
    if (!store.prepare('SELECT id FROM targets WHERE id=?').get(id)) return;
    store
      .prepare(
        'INSERT INTO samples (target_id,status,rtt,checked_at) VALUES (?,?,?,?)',
      )
      .run(id, outcome.status, result.rtt, checkedAt);
    store
      .prepare(
        'DELETE FROM samples WHERE target_id=? AND id NOT IN (SELECT id FROM samples WHERE target_id=? ORDER BY id DESC LIMIT 20)',
      )
      .run(id, id);
    const samples = store
      .prepare(
        'SELECT status,rtt FROM samples WHERE target_id=? ORDER BY id DESC LIMIT 20',
      )
      .all(id) as { status: string; rtt: number | null }[];
    const measured = samples.filter(
      (s) => s.status === 'healthy' || s.status === 'down',
    );
    const loss = measured.length
      ? Math.round(
          (100 * measured.filter((s) => s.status === 'down').length) /
            measured.length,
        )
      : null;
    const successes = measured.filter(
      (s) => s.status === 'healthy' && s.rtt !== null,
    );
    const jitter =
      successes.length > 1
        ? Math.round(Math.abs(successes[0].rtt! - successes[1].rtt!) * 10) / 10
        : null;
    store
      .prepare(
        'UPDATE targets SET status=?,message=?,rtt=?,checked_at=?,loss=?,jitter=?,next_at=? WHERE id=?',
      )
      .run(
        outcome.status,
        outcome.message,
        outcome.status === 'healthy' ? result.rtt : null,
        checkedAt,
        loss,
        jitter,
        Date.now() + target.interval * 1000,
        id,
      );
  } catch {
    store
      .prepare('UPDATE targets SET status=?,message=?,next_at=? WHERE id=?')
      .run(
        'error',
        'Probe service failed.',
        Date.now() + target.interval * 1000,
        id,
      );
  } finally {
    running.delete(id);
  }
}

export function startScheduler() {
  if (schedulerStarted) return;
  schedulerStarted = true;
  db()
    .prepare(
      "UPDATE targets SET status='pending',message='Waiting for the next check.',next_at=0 WHERE status='checking'",
    )
    .run();
  const timer = setInterval(() => {
    try {
      const due = db()
        .prepare('SELECT id FROM targets WHERE next_at <= ? LIMIT 20')
        .all(Date.now()) as { id: string }[];
      for (const { id } of due) void checkTarget(id);
    } catch (error) {
      console.error('Monitoring scheduler:', error);
    }
  }, 1000);
  timer.unref();
}
