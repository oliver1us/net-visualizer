'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Activity,
  MousePointerClick,
  Plus,
  RefreshCw,
  Server,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import {
  describeProbe,
  type ProbeResult,
  type ProbeStatus,
  type Protocol,
} from '@/lib/probe-status';

type Status = ProbeStatus;
type Filter = 'all' | Protocol;

type Host = {
  id: string;
  host: string;
  protocol: Protocol;
  port: number | null;
  interval: number;
  status: Status;
  rtt: number | null;
  jitter: number;
  loss: number;
  message: string;
  checkedAt: string | null;
};

const protocols: Protocol[] = ['TCP', 'ICMP', 'UDP'];

const statusMeta = {
  healthy: {
    label: 'Responding',
    badge: 'border-success/25 bg-success/10 text-success',
    dot: 'bg-success',
    text: 'text-success',
    stroke: 'stroke-success/45',
    glow: 'stroke-success/10',
    fill: 'fill-success',
    node: 'stroke-success/35',
  },
  checking: {
    label: 'Checking',
    badge: 'border-warning/25 bg-warning/10 text-warning',
    dot: 'bg-warning',
    text: 'text-warning',
    stroke: 'stroke-warning/45',
    glow: 'stroke-warning/10',
    fill: 'fill-warning',
    node: 'stroke-warning/35',
  },
  down: {
    label: 'Not connected',
    badge: 'border-destructive/30 bg-destructive/10 text-destructive',
    dot: 'bg-destructive',
    text: 'text-destructive',
    stroke: 'stroke-destructive/50',
    glow: 'stroke-destructive/10',
    fill: 'fill-destructive',
    node: 'stroke-destructive/40',
  },
  unknown: {
    label: 'Inconclusive',
    badge: 'border-muted-foreground/30 text-muted-foreground',
    dot: 'bg-muted-foreground',
    text: 'text-muted-foreground',
    stroke: 'stroke-muted-foreground/45',
    glow: 'stroke-muted-foreground/10',
    fill: 'fill-muted-foreground',
    node: 'stroke-muted-foreground/40',
  },
  pending: {
    label: 'Pending',
    badge: 'border-muted-foreground/30 text-muted-foreground',
    dot: 'bg-muted-foreground',
    text: 'text-muted-foreground',
    stroke: 'stroke-muted-foreground/45',
    glow: 'stroke-muted-foreground/10',
    fill: 'fill-muted-foreground',
    node: 'stroke-muted-foreground/40',
  },
  error: {
    label: 'Cannot check',
    badge: 'border-warning/25 bg-warning/10 text-warning',
    dot: 'bg-warning',
    text: 'text-warning',
    stroke: 'stroke-warning/45',
    glow: 'stroke-warning/10',
    fill: 'fill-warning',
    node: 'stroke-warning/35',
  },
} as const;

const initialHosts: Host[] = [];

const GRAPH_WIDTH = 800;
const GRAPH_HEIGHT = 480;
const CENTER_X = GRAPH_WIDTH / 2;
const CENTER_Y = GRAPH_HEIGHT / 2;

function nodePosition(index: number, total: number) {
  const angle = (Math.PI * 2 * index) / Math.max(total, 1) - Math.PI / 2;
  return {
    x: CENTER_X + Math.cos(angle) * 300,
    y: CENTER_Y + Math.sin(angle) * 176,
  };
}

function linkPath(x: number, y: number) {
  const dx = x - CENTER_X;
  const dy = y - CENTER_Y;
  const length = Math.hypot(dx, dy) || 1;
  const bend = 26;
  const controlX = CENTER_X + dx / 2 - (dy / length) * bend;
  const controlY = CENTER_Y + dy / 2 + (dx / length) * bend;
  return `M ${CENTER_X} ${CENTER_Y} Q ${controlX} ${controlY} ${x} ${y}`;
}

function shortHost(host: string) {
  return host.length > 19 ? `${host.slice(0, 18)}…` : host;
}

function targetLabel(host: Host) {
  return host.protocol === 'ICMP'
    ? 'ICMP echo'
    : host.protocol === 'UDP'
      ? `UDP DNS :${host.port}`
      : `TCP :${host.port}`;
}

function formatRtt(rtt: number | null) {
  return rtt === null ? '—' : `${Math.round(rtt)} ms`;
}

export function NetworkDashboard() {
  const [hosts, setHosts] = useState<Host[]>(initialHosts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [tab, setTab] = useState('topology');
  const [lastProbeAt, setLastProbeAt] = useState<string | null>(null);

  const [hostInput, setHostInput] = useState('');
  const [protocol, setProtocol] = useState<Protocol>('TCP');
  const [port, setPort] = useState('443');
  const [hostError, setHostError] = useState<string | null>(null);
  const [portError, setPortError] = useState<string | null>(null);
  const [addedName, setAddedName] = useState<string | null>(null);
  const [isProbing, setIsProbing] = useState(false);
  const hostInputRef = useRef<HTMLInputElement>(null);
  const hostsRef = useRef(hosts);
  const activeTargets = useRef(new Set<string>());
  const removedTargets = useRef(new Set<string>());
  const activeCount = useRef(0);
  const waiting = useRef<(() => void)[]>([]);
  const roundActive = useRef(false);

  useEffect(() => {
    hostsRef.current = hosts;
  }, [hosts]);

  const visibleHosts =
    filter === 'all' ? hosts : hosts.filter((h) => h.protocol === filter);

  const selected = hosts.find((h) => h.id === selectedId) ?? null;
  const reachable = hosts.filter((h) => h.status === 'healthy');
  const rtts = reachable
    .map((h) => h.rtt)
    .filter((value): value is number => value !== null);
  const medianRtt =
    rtts.length > 0
      ? [...rtts].sort((a, b) => a - b)[Math.floor(rtts.length / 2)]
      : null;

  const runProbe = useCallback(async (target: Host) => {
    if (
      activeTargets.current.has(target.id) ||
      removedTargets.current.has(target.id)
    )
      return;
    activeTargets.current.add(target.id);
    setHosts((current) =>
      current.map((host) =>
        host.id === target.id
          ? {
              ...host,
              status: 'checking',
              message: 'Checking this target…',
              rtt: null,
            }
          : host,
      ),
    );

    // The API and worker have their own limits. Bound browser requests too.
    if (activeCount.current >= 5) {
      await new Promise<void>((resolve) => waiting.current.push(resolve));
    } else {
      activeCount.current++;
    }
    try {
      if (removedTargets.current.has(target.id)) return;
      let result: ProbeResult;
      try {
        const response = await fetch('/api/probe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            host: target.host,
            protocol: target.protocol,
            port: target.port,
          }),
          signal: AbortSignal.timeout(10000),
        });
        const data: unknown = await response.json();
        if (
          !data ||
          typeof data !== 'object' ||
          typeof (data as ProbeResult).reachable !== 'boolean'
        )
          throw new Error('Invalid response');
        result = data as ProbeResult;
      } catch {
        result = {
          reachable: false,
          rtt: null,
          error: 'Could not contact the probe API or the request timed out.',
        };
      }
      const outcome = describeProbe(target.protocol, result);
      const now = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setHosts((current) =>
        current.map((host) =>
          host.id === target.id
            ? {
                ...host,
                status: outcome.status,
                message: outcome.message,
                rtt: outcome.status === 'healthy' ? result.rtt : null,
                checkedAt: now,
              }
            : host,
        ),
      );
      setLastProbeAt(now);
    } finally {
      activeTargets.current.delete(target.id);
      const next = waiting.current.shift();
      if (next) next();
      else activeCount.current--;
    }
  }, []);

  const runProbes = useCallback(async () => {
    if (roundActive.current || hostsRef.current.length === 0) return;
    roundActive.current = true;
    setIsProbing(true);
    try {
      await Promise.all(hostsRef.current.map(runProbe));
    } finally {
      roundActive.current = false;
      setIsProbing(false);
    }
  }, [runProbe]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void runProbes();
    }, 30000);
    return () => window.clearInterval(timer);
  }, [runProbes]);

  const removeHost = (id: string) => {
    removedTargets.current.add(id);
    const next = hosts.filter((host) => host.id !== id);
    setHosts(next);
    setAddedName(null);
    if (selectedId === id) {
      setSelectedId(next[0]?.id ?? null);
    }
  };

  const addHost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddedName(null);

    const hostname = hostInput.trim();
    let invalid = false;

    if (!hostname) {
      setHostError('Enter a hostname or IP address.');
      invalid = true;
    } else if (!/^[a-zA-Z0-9.:-]+$/.test(hostname)) {
      setHostError('Use a hostname or IP address without spaces or slashes.');
      invalid = true;
    } else if (
      hosts.some(
        (host) =>
          host.host.toLowerCase() === hostname.toLowerCase() &&
          host.protocol === protocol &&
          host.port === (protocol === 'ICMP' ? null : Number(port)),
      )
    ) {
      setHostError('That host and port are already on the map.');
      invalid = true;
    } else {
      setHostError(null);
    }

    if (protocol !== 'ICMP') {
      const portNumber = Number(port);
      if (
        !port ||
        !Number.isInteger(portNumber) ||
        portNumber < 1 ||
        portNumber > 65535
      ) {
        setPortError('Enter a port between 1 and 65535.');
        invalid = true;
      } else {
        setPortError(null);
      }
    } else {
      setPortError(null);
    }

    if (invalid) {
      return;
    }

    const newHost: Host = {
      id: `${hostname.toLowerCase()}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
      host: hostname,
      protocol,
      port: protocol === 'ICMP' ? null : Number(port),
      interval: 0,
      status: 'pending',
      rtt: null,
      jitter: 0,
      loss: 100,
      message: 'Waiting for the first check.',
      checkedAt: null,
    };

    setHosts((current) => [...current, newHost]);
    setSelectedId(newHost.id);
    setHostInput('');
    setAddedName(hostname);
    void runProbe(newHost);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="size-4 text-primary" />
          Network topology
          <Badge variant="outline">Every 30s while open</Badge>
        </CardTitle>
        <CardDescription>
          Targets are checked when added and every 30 seconds while this page is
          open. Click a node for its latest result.
        </CardDescription>
        <CardAction>
          <Button
            size="sm"
            variant="outline"
            onClick={runProbes}
            disabled={hosts.length === 0 || isProbing}
          >
            <RefreshCw data-icon="inline-start" />
            {isProbing ? 'Checking connections…' : 'Run probes'}
          </Button>
        </CardAction>
      </CardHeader>

      <p className="sr-only" aria-live="polite">
        {lastProbeAt ? `Probe round completed at ${lastProbeAt}.` : ''}
      </p>

      <Tabs value={tab} onValueChange={setTab} className="gap-0">
        <div className="border-b px-4 py-3 sm:px-6">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="topology" className="gap-1.5 px-3">
              <Activity />
              Visualizer
            </TabsTrigger>
            <TabsTrigger value="hosts" className="gap-1.5 px-3">
              <Server />
              Hosts
              <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                {hosts.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="topology" className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ToggleGroup
              variant="outline"
              size="sm"
              value={[filter]}
              onValueChange={(value) => {
                const next = value[0];
                if (next) {
                  setFilter(next as Filter);
                }
              }}
            >
              <ToggleGroupItem value="all" className="px-3 text-xs">
                All
              </ToggleGroupItem>
              {protocols.map((item) => (
                <ToggleGroupItem
                  key={item}
                  value={item}
                  className="px-3 font-mono text-xs"
                >
                  {item}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MousePointerClick className="size-3.5" />
              {visibleHosts.length} shown · click a node
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <div className="relative mt-3 overflow-hidden rounded-xl border bg-background/50">
                {/* Desktop topology map */}
                <svg
                  viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
                  role="group"
                  aria-label="Network topology map with the origin in the center and target hosts around it"
                  className="hidden w-full sm:block"
                >
                  <defs>
                    <pattern
                      id="topology-grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 H 0 V 40"
                        fill="none"
                        stroke="var(--color-border)"
                        strokeWidth="0.6"
                      />
                    </pattern>
                    <radialGradient id="origin-glow">
                      <stop
                        offset="0%"
                        stopColor="var(--color-primary)"
                        stopOpacity="0.16"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-primary)"
                        stopOpacity="0"
                      />
                    </radialGradient>
                  </defs>

                  <rect
                    width={GRAPH_WIDTH}
                    height={GRAPH_HEIGHT}
                    fill="url(#topology-grid)"
                  />
                  <circle
                    cx={CENTER_X}
                    cy={CENTER_Y}
                    r={150}
                    fill="url(#origin-glow)"
                  />

                  {visibleHosts.map((host, index) => {
                    const { x, y } = nodePosition(index, visibleHosts.length);
                    const meta = statusMeta[host.status];

                    return (
                      <g key={host.id}>
                        <path
                          d={linkPath(x, y)}
                          fill="none"
                          strokeWidth={5}
                          className={meta.glow}
                        />
                        <path
                          d={linkPath(x, y)}
                          fill="none"
                          strokeWidth={1.4}
                          strokeDasharray={
                            host.status === 'down' ? '2 6' : '5 7'
                          }
                          className={cn(
                            meta.stroke,
                            host.status === 'healthy' &&
                              'animate-[flow-dash_2.6s_linear_infinite]',
                          )}
                        />
                      </g>
                    );
                  })}

                  {/* Origin */}
                  <g>
                    <circle
                      cx={CENTER_X}
                      cy={CENTER_Y}
                      r={44}
                      className="fill-primary/10"
                    />
                    <circle
                      cx={CENTER_X}
                      cy={CENTER_Y}
                      r={27}
                      className="fill-card stroke-primary/50"
                      strokeWidth={1.5}
                    />
                    <circle
                      cx={CENTER_X}
                      cy={CENTER_Y}
                      r={7}
                      className="fill-primary"
                    />
                    <path
                      d={`M ${CENTER_X - 20} ${CENTER_Y} H ${CENTER_X - 11} M ${CENTER_X + 11} ${CENTER_Y} H ${CENTER_X + 20} M ${CENTER_X} ${CENTER_Y - 20} V ${CENTER_Y - 11} M ${CENTER_X} ${CENTER_Y + 11} V ${CENTER_Y + 20}`}
                      className="stroke-primary/70"
                      strokeWidth={1.4}
                      strokeLinecap="round"
                    />
                    <text
                      x={CENTER_X}
                      y={CENTER_Y + 46}
                      textAnchor="middle"
                      className="fill-muted-foreground font-mono text-[10px] tracking-[0.14em] uppercase"
                    >
                      origin
                    </text>
                  </g>

                  {/* Host nodes */}
                  {visibleHosts.map((host, index) => {
                    const { x, y } = nodePosition(index, visibleHosts.length);
                    const meta = statusMeta[host.status];
                    const isSelected = host.id === selectedId;

                    return (
                      <g
                        key={host.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`${host.host}, ${meta.label}, ${formatRtt(host.rtt)}`}
                        aria-pressed={isSelected}
                        onClick={() => setSelectedId(host.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setSelectedId(host.id);
                          }
                        }}
                        className="cursor-pointer outline-none"
                      >
                        {isSelected && (
                          <circle
                            cx={x}
                            cy={y}
                            r={48}
                            className="fill-none stroke-primary/30"
                            strokeWidth={1.5}
                          />
                        )}
                        <circle
                          cx={x}
                          cy={y}
                          r={38}
                          strokeWidth={isSelected ? 1.8 : 1}
                          className={cn(
                            'fill-card',
                            isSelected ? 'stroke-primary' : meta.node,
                          )}
                        />
                        <circle
                          cx={x}
                          cy={y - 13}
                          r={6}
                          className={meta.fill}
                        />
                        <text
                          x={x}
                          y={y + 3}
                          textAnchor="middle"
                          className="fill-foreground font-mono text-[12px]"
                        >
                          {shortHost(host.host)}
                        </text>
                        <text
                          x={x}
                          y={y + 26}
                          textAnchor="middle"
                          className="fill-muted-foreground font-mono text-[10px]"
                        >
                          {host.protocol} · {formatRtt(host.rtt)}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Mobile list version of the map */}
                <div className="sm:hidden">
                  <div className="flex items-center gap-3 border-b p-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25">
                      <Activity className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Origin</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        Probe containers · {hosts.length} targets
                      </p>
                    </div>
                  </div>
                  <ItemGroup className="gap-2 p-3">
                    {visibleHosts.map((host) => {
                      const meta = statusMeta[host.status];
                      return (
                        <Item
                          key={host.id}
                          variant="outline"
                          size="sm"
                          render={
                            <button
                              type="button"
                              onClick={() => setSelectedId(host.id)}
                            />
                          }
                          className={cn(
                            'text-left',
                            host.id === selectedId &&
                              'border-primary/50 bg-primary/5',
                          )}
                        >
                          <ItemMedia variant="icon">
                            <Server />
                          </ItemMedia>
                          <ItemContent>
                            <ItemTitle>{host.host}</ItemTitle>
                            <ItemDescription className="font-mono text-xs">
                              {targetLabel(host)} · {meta.label}
                            </ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            <span
                              className={cn('font-mono text-xs', meta.text)}
                            >
                              {formatRtt(host.rtt)}
                            </span>
                          </ItemActions>
                        </Item>
                      );
                    })}
                  </ItemGroup>
                </div>

                {visibleHosts.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
                    <Empty className="border-0">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Server />
                        </EmptyMedia>
                        <EmptyTitle>
                          {hosts.length === 0
                            ? 'No targets on the map'
                            : 'No targets use this protocol'}
                        </EmptyTitle>
                        <EmptyDescription>
                          {hosts.length === 0
                            ? 'Add a host and it will appear here immediately.'
                            : 'Choose another filter or add a new host.'}
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button size="sm" onClick={() => setTab('hosts')}>
                          <Plus data-icon="inline-start" />
                          Add a target
                        </Button>
                      </EmptyContent>
                    </Empty>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                {(Object.keys(statusMeta) as Status[]).map((status) => (
                  <span
                    key={status}
                    className="inline-flex items-center gap-1.5"
                  >
                    <span
                      className={cn(
                        'size-1.5 rounded-full',
                        statusMeta[status].dot,
                      )}
                    />
                    {statusMeta[status].label}
                  </span>
                ))}
                <span className="ml-auto font-mono">
                  origin · probe containers
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {selected ? (
                <Card size="sm">
                  <CardHeader>
                    <CardTitle className="truncate font-mono text-sm">
                      {selected.host}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {targetLabel(selected)} · every 30s while open
                    </CardDescription>
                    <CardAction>
                      <Badge
                        variant="outline"
                        className={cn(
                          'gap-1.5',
                          statusMeta[selected.status].badge,
                        )}
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            statusMeta[selected.status].dot,
                          )}
                        />
                        {statusMeta[selected.status].label}
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <dl className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'RTT', value: formatRtt(selected.rtt) },
                        {
                          label: 'Jitter',
                          value: '—',
                        },
                        {
                          label: 'Loss',
                          value: '—',
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-md border bg-background/50 px-2 py-1.5"
                        >
                          <dt className="text-[10px] tracking-wide text-muted-foreground uppercase">
                            {stat.label}
                          </dt>
                          <dd className="mt-0.5 font-mono text-xs">
                            {stat.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <Separator />

                    <p role="status" className="text-xs text-muted-foreground">
                      {selected.message}
                      {selected.checkedAt
                        ? ` Last checked at ${selected.checkedAt}.`
                        : ''}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void runProbe(selected)}
                        disabled={selected.status === 'checking'}
                        className="flex-1"
                      >
                        <RefreshCw data-icon="inline-start" />
                        {selected.status === 'checking'
                          ? 'Checking…'
                          : 'Probe now'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeHost(selected.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 data-icon="inline-start" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card size="sm">
                  <CardContent className="py-4 text-center text-sm text-muted-foreground">
                    Select a node on the map to inspect it.
                  </CardContent>
                </Card>
              )}

              <Card size="sm">
                <CardHeader>
                  <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="font-mono text-sm">
                      {reachable.length}/{hosts.length}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      reachable
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-sm">
                      {medianRtt === null ? '—' : `${Math.round(medianRtt)} ms`}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      median RTT
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-sm">—</p>
                    <p className="text-[10px] text-muted-foreground">
                      avg loss
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hosts" className="p-4 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            <div className="h-fit rounded-xl border bg-muted/20 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium">Add a target</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  New hosts are checked immediately.
                </p>
              </div>

              <form onSubmit={addHost} className="flex flex-col gap-4">
                <FieldGroup>
                  <Field data-invalid={Boolean(hostError)}>
                    <FieldLabel htmlFor="target-host">
                      Hostname or IP
                    </FieldLabel>
                    <Input
                      id="target-host"
                      ref={hostInputRef}
                      value={hostInput}
                      onChange={(event) => {
                        setHostInput(event.target.value);
                        setHostError(null);
                        setAddedName(null);
                      }}
                      placeholder="db-primary.internal"
                      autoComplete="off"
                      spellCheck={false}
                      aria-invalid={Boolean(hostError)}
                    />
                    {hostError ? (
                      <FieldError>{hostError}</FieldError>
                    ) : (
                      <FieldDescription>
                        A hostname, IPv4 or IPv6 address.
                      </FieldDescription>
                    )}
                  </Field>

                  <Field>
                    <FieldTitle>Protocol</FieldTitle>
                    <ToggleGroup
                      variant="outline"
                      size="sm"
                      className="w-full"
                      value={[protocol]}
                      onValueChange={(value) => {
                        const next = value[0];
                        if (next) {
                          setProtocol(next as Protocol);
                          if (next === 'UDP') setPort('53');
                          if (next === 'TCP') setPort('443');
                          setPortError(null);
                        }
                      }}
                    >
                      {protocols.map((item) => (
                        <ToggleGroupItem
                          key={item}
                          value={item}
                          className="flex-1 font-mono text-xs"
                        >
                          {item}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                    <FieldDescription>
                      {protocol === 'UDP'
                        ? 'Checks DNS over UDP with an example.com A query; not a generic UDP port test.'
                        : protocol === 'ICMP'
                          ? 'Checks for an ICMP echo reply from the probe worker.'
                          : 'Checks whether a TCP connection can be established.'}
                    </FieldDescription>
                  </Field>

                  {protocol !== 'ICMP' && (
                    <Field data-invalid={Boolean(portError)}>
                      <FieldLabel htmlFor="target-port">Port</FieldLabel>
                      <Input
                        id="target-port"
                        inputMode="numeric"
                        value={port}
                        onChange={(event) => {
                          setPort(event.target.value);
                          setPortError(null);
                        }}
                        placeholder="443"
                        aria-invalid={Boolean(portError)}
                      />
                      {portError ? (
                        <FieldError>{portError}</FieldError>
                      ) : (
                        <FieldDescription>
                          The service port to probe.
                        </FieldDescription>
                      )}
                    </Field>
                  )}

                  <FieldDescription>
                    Checks repeat every 30 seconds while this page remains open.
                    Background server monitoring is not implemented yet.
                  </FieldDescription>
                </FieldGroup>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={hosts.length >= 20}
                >
                  <Plus data-icon="inline-start" />
                  Add target
                </Button>

                {addedName ? (
                  <p role="status" className="text-xs text-success">
                    Added {addedName}; see its current status below.
                  </p>
                ) : null}

                {hosts.length >= 20 ? (
                  <p className="text-xs text-muted-foreground">
                    This interactive demo holds up to 20 targets. Remove one to
                    add another.
                  </p>
                ) : null}
              </form>
            </div>

            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-medium">Watching</h3>
                  <p className="text-xs text-muted-foreground">
                    {hosts.length === 0
                      ? 'No targets yet.'
                      : `${hosts.length} target${hosts.length === 1 ? '' : 's'} on the map.`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTab('topology')}
                  disabled={hosts.length === 0}
                >
                  View on map
                </Button>
              </div>

              {hosts.length === 0 ? (
                <Empty className="border">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Server />
                    </EmptyMedia>
                    <EmptyTitle>No hosts saved</EmptyTitle>
                    <EmptyDescription>
                      Add a hostname or IP on the left and it will appear on the
                      topology right away.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      size="sm"
                      onClick={() => hostInputRef.current?.focus()}
                    >
                      Add your first target
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <ItemGroup className="gap-2">
                  {hosts.map((host) => {
                    const meta = statusMeta[host.status];
                    return (
                      <Item
                        key={host.id}
                        variant="outline"
                        className={cn(
                          'text-left',
                          host.id === selectedId &&
                            'border-primary/40 bg-primary/5',
                        )}
                      >
                        <ItemMedia variant="icon">
                          <Server />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedId(host.id);
                                setTab('topology');
                              }}
                              className="truncate font-mono underline-offset-4 hover:underline"
                            >
                              {host.host}
                            </button>
                            <Badge
                              variant="outline"
                              className={cn('gap-1', meta.badge)}
                            >
                              <span
                                className={cn(
                                  'size-1.5 rounded-full',
                                  meta.dot,
                                )}
                              />
                              {meta.label}
                            </Badge>
                          </ItemTitle>
                          <ItemDescription className="font-mono text-xs">
                            {targetLabel(host)} ·{' '}
                            {host.checkedAt
                              ? `checked ${host.checkedAt}`
                              : 'not yet checked'}
                          </ItemDescription>
                          <ItemDescription role="status" className="text-xs">
                            {host.message}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <span className={cn('font-mono text-xs', meta.text)}>
                            {formatRtt(host.rtt)}
                          </span>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`Remove ${host.host}`}
                            onClick={() => removeHost(host.id)}
                            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 />
                          </Button>
                        </ItemActions>
                      </Item>
                    );
                  })}
                </ItemGroup>
              )}

              <p className="mt-4 text-xs text-muted-foreground">
                Tip: click a hostname to inspect that target on the visualizer.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
