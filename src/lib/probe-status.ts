export type Protocol = 'TCP' | 'ICMP' | 'UDP';
export type ProbeStatus =
  'pending' | 'checking' | 'healthy' | 'down' | 'error' | 'unknown';

export type ProbeResult = {
  reachable: boolean;
  rtt: number | null;
  error?: string;
  code?: string;
};

export function describeProbe(
  protocol: Protocol,
  result: ProbeResult,
): { status: ProbeStatus; message: string } {
  if (result.reachable && result.rtt !== null && Number.isFinite(result.rtt)) {
    return {
      status: 'healthy',
      message:
        protocol === 'TCP'
          ? 'TCP connection established.'
          : protocol === 'ICMP'
            ? 'ICMP echo reply received.'
            : 'Valid DNS response received over UDP.',
    };
  }
  switch (result.code) {
    case 'dns_not_found':
      return {
        status: 'error',
        message:
          'Hostname not found in DNS. Check the name and the server DNS configuration.',
      };
    case 'dns_error':
      return {
        status: 'error',
        message:
          'DNS lookup failed or timed out; the host could not be checked.',
      };
    case 'policy':
      return {
        status: 'error',
        message:
          'Blocked by web container network policy. Check PROBE_ALLOWED_CIDRS in net-visualizer.',
      };
    case 'worker_policy':
      return {
        status: 'error',
        message:
          'Blocked by worker network policy. Check PROBE_ALLOWED_CIDRS in probe-worker.',
      };
    case 'refused':
      return {
        status: 'down',
        message:
          'TCP connection refused. The host may be reachable but the port is closed.',
      };
    case 'timeout':
      return {
        status: 'down',
        message:
          protocol === 'ICMP'
            ? 'No ICMP echo reply; the host may be down or filtering ICMP.'
            : 'TCP connection timed out; the host may be down or filtered.',
      };
    case 'connection_error':
      return {
        status: 'down',
        message: 'TCP connection failed. Check routing and the target port.',
      };
    case 'dns_timeout':
    case 'dns_transport':
      return {
        status: 'unknown',
        message:
          'No valid DNS response over UDP. This does not prove that the host is down.',
      };
    case 'worker_unavailable':
    case 'worker_error':
    case 'icmp_unavailable':
      return {
        status: 'error',
        message: 'Probe worker unavailable or unable to run this check.',
      };
    default:
      return {
        status: 'error',
        message: result.error || 'Probe could not be completed.',
      };
  }
}
