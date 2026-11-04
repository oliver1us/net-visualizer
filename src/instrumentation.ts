export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.PROBE_PASSWORD &&
    process.env.PROBE_PASSWORD.length >= 16
  ) {
    const { startScheduler } = await import('@/lib/monitor-store');
    startScheduler();
  }
}
