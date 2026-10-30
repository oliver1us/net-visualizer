import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function LogoMark(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="4.5" cy="5" r="1.9" />
      <circle cx="19.5" cy="5" r="1.9" />
      <circle cx="4.5" cy="19" r="1.9" />
      <circle cx="19.5" cy="19" r="1.9" />
      <path d="M6.1 6.3 10 10.1M17.9 6.3 14 10.1M6.1 17.7 10 13.9M17.9 17.7 14 13.9" />
    </svg>
  );
}

function ArrowRightIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

function PlusIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CheckIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

function CrosshairIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ServerIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2.5" y="3.5" width="19" height="7" rx="2" />
      <rect x="2.5" y="13.5" width="19" height="7" rx="2" />
      <path d="M6.5 7h.01M6.5 17h.01M11 7h5M11 17h5" />
    </svg>
  );
}

function LayersIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 2.5 9 4.7-9 4.7-9-4.7 9-4.7Z" />
      <path d="m3 12.2 9 4.7 9-4.7M3 16.9l9 4.7 9-4.7" />
    </svg>
  );
}

function ActivityIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function GaugeIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.5 18a8.5 8.5 0 1 1 15 0" />
      <path d="m12 14 3.5-4M12 18h.01" />
    </svg>
  );
}

function TerminalIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <path d="m7 9 3 3-3 3M13 15h4" />
    </svg>
  );
}

const statusStyles = {
  ok: {
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]",
    card: "border-emerald-400/20",
    accent: "text-emerald-300",
    line: "rgba(52,211,153,0.45)",
    lineGlow: "rgba(52,211,153,0.14)",
  },
  degraded: {
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]",
    card: "border-amber-400/20",
    accent: "text-amber-300",
    line: "rgba(251,191,36,0.4)",
    lineGlow: "rgba(251,191,36,0.12)",
  },
  down: {
    dot: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.9)]",
    card: "border-rose-400/20",
    accent: "text-rose-300",
    line: "rgba(251,113,133,0.4)",
    lineGlow: "rgba(251,113,133,0.12)",
  },
} as const;

type TargetStatus = keyof typeof statusStyles;

const heroTargets: {
  host: string;
  protocol: string;
  latency: string;
  status: TargetStatus;
  left: string;
  top: string;
  path: string;
}[] = [
  {
    host: "edge-01",
    protocol: "TCP",
    latency: "12 ms",
    status: "ok",
    left: "17%",
    top: "19%",
    path: "M400 180 C335 158 238 118 136 68",
  },
  {
    host: "db-primary",
    protocol: "TCP",
    latency: "8 ms",
    status: "ok",
    left: "83%",
    top: "21%",
    path: "M400 180 C470 158 570 120 664 76",
  },
  {
    host: "api-eu",
    protocol: "ICMP",
    latency: "timeout",
    status: "down",
    left: "16.5%",
    top: "80%",
    path: "M400 180 C340 205 230 250 132 288",
  },
  {
    host: "cache-02",
    protocol: "UDP",
    latency: "24 ms",
    status: "degraded",
    left: "83.5%",
    top: "78%",
    path: "M400 180 C470 205 575 245 668 281",
  },
];

const features = [
  {
    Icon: CrosshairIcon,
    title: "Your origin, pinned.",
    description:
      "Your source host is a dedicated node at the center of the map, so every probe has an obvious starting point.",
    iconClass: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
  {
    Icon: ServerIcon,
    title: "Targets in one tab.",
    description:
      "Add hosts by name or IP, choose the protocol for each one, and watch them join the topology immediately.",
    iconClass: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  },
  {
    Icon: LayersIcon,
    title: "TCP, ICMP and UDP.",
    description:
      "Three protocols, treated as first-class probes. Each target keeps its own settings, intervals and expectations.",
    iconClass: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  },
  {
    Icon: ActivityIcon,
    title: "Links you can watch.",
    description:
      "Connections animate while probes flow. Healthy, degraded and unreachable paths are color-coded at a glance.",
    iconClass: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  },
  {
    Icon: GaugeIcon,
    title: "Latency, in context.",
    description:
      "Round-trip time, jitter and packet loss update next to the graph — no second dashboard required.",
    iconClass: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  },
  {
    Icon: TerminalIcon,
    title: "blackbox-export DNA.",
    description:
      "Familiar probe semantics and metrics, reimagined as a UI you will actually want to keep open all day.",
    iconClass: "border-rose-400/20 bg-rose-400/10 text-rose-300",
  },
];

const protocols = [
  {
    name: "TCP",
    tagline: "Connection-aware",
    description:
      "Verify that a specific port answers and measure the handshake from your origin.",
    points: ["Host + port targeting", "Connect latency", "Per-target intervals"],
    command: "tcp_connect",
    badge: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    dot: "bg-emerald-400",
  },
  {
    name: "ICMP",
    tagline: "Reachability",
    description:
      "Echo a host at the network layer and see the round trip — or the exact moment it stops answering.",
    points: ["Echo request / reply", "Round-trip timing", "Packet loss tracking"],
    command: "icmp_echo",
    badge: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
    dot: "bg-cyan-400",
  },
  {
    name: "UDP",
    tagline: "Lightweight checks",
    description:
      "Probe connectionless services without a handshake, and spot loss as conditions change.",
    points: ["Datagram probes", "Loss detection", "Low-overhead polling"],
    command: "udp_probe",
    badge: "border-violet-400/25 bg-violet-400/10 text-violet-300",
    dot: "bg-violet-400",
  },
];

const steps = [
  {
    number: "01",
    title: "Pin your origin",
    description:
      "Set the source node once. The map keeps it front and center for every connection you watch.",
  },
  {
    number: "02",
    title: "Add your targets",
    description:
      "Drop hostnames or IPs into the targets tab and pick TCP, ICMP or UDP for each destination.",
  },
  {
    number: "03",
    title: "Watch it live",
    description:
      "Links light up as probes succeed, while latency and loss update in real time beside the map.",
  },
];

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Protocols", href: "#protocols" },
  { label: "Targets", href: "#targets" },
  { label: "How it works", href: "#how-it-works" },
];

export default function Home() {
  return (
    <div
      id="top"
      className="relative flex min-h-screen flex-col overflow-x-clip bg-[#05080c] font-sans text-slate-100 selection:bg-emerald-400/30 selection:text-emerald-50"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-emerald-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#03110c]"
      >
        Skip to content
      </a>

      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.055) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 80% 55% at 50% 0%, #000 15%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 55% at 50% 0%, #000 15%, transparent 78%)",
          }}
        />
        <div className="absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/[0.09] blur-[130px]" />
        <div className="absolute right-[-12%] top-24 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.06] blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#05080c]/80 backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
        >
          <a href="#top" className="group flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/10 text-emerald-300 transition-colors group-hover:bg-emerald-400/15">
              <LogoMark className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              netviz
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400">
              beta
            </span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium text-slate-400 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="#preview"
            className="group inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-2 text-[13px] font-semibold text-emerald-200 transition-colors hover:border-emerald-400/40 hover:bg-emerald-400/15"
          >
            Open dashboard
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </nav>
      </header>

      <main id="main" className="relative">
        {/* Hero */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-16 pt-14 sm:px-8 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1 text-[11px] font-medium text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Real-time network observability
              </span>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white text-balance sm:text-5xl lg:text-[3.65rem]">
                See every link,{" "}
                <span className="bg-linear-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  as it happens.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-7 text-slate-400 sm:text-base">
                Net Visualizer turns network probes into a live, interactive
                map. Pin your origin, add target hosts, choose TCP, ICMP or UDP
                — and watch connectivity play out in real time instead of
                reconstructing it from logs.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {protocols.map((protocol) => (
                  <span
                    key={protocol.name}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-wide ${protocol.badge}`}
                  >
                    <span className={`h-1 w-1 rounded-full ${protocol.dot}`} />
                    {protocol.name}
                  </span>
                ))}
                <span className="text-[11px] text-slate-500">
                  protocol chosen per target
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#preview"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-[#03110c] shadow-[0_12px_36px_-12px_rgba(52,211,153,0.65)] transition-colors hover:bg-emerald-300"
                >
                  Explore the live map
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                >
                  See what&apos;s inside
                </a>
              </div>

              <p className="mt-5 flex items-center gap-2 text-[11px] text-slate-500">
                <TerminalIcon className="h-3.5 w-3.5 text-slate-600" />
                Built on blackbox-export probe semantics, reimagined as a UI.
              </p>
            </div>

            {/* Dashboard preview */}
            <div className="relative min-w-0">
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] bg-emerald-500/[0.06] blur-2xl"
              />
              <div
                id="preview"
                role="img"
                aria-label="Preview of the Net Visualizer dashboard: a central origin node connected to four target hosts, with live protocol filters, latency and packet loss stats, and a target list."
                className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-white/10 bg-[#070c12]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.03]"
              >
                <div className="flex h-10 items-center justify-between border-b border-white/5 bg-white/[0.02] px-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-rose-400/50" />
                      <span className="h-2 w-2 rounded-full bg-amber-400/50" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400/50" />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">
                      netviz / topology
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden font-mono text-[9px] text-slate-600 sm:inline">
                      1s refresh
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-emerald-300">
                      <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
                      LIVE
                    </span>
                  </div>
                </div>

                <div className="flex">
                  <aside className="hidden w-[152px] shrink-0 flex-col border-r border-white/5 bg-black/20 p-3 sm:flex">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Targets
                      </span>
                      <span className="font-mono text-[9px] text-slate-600">
                        04
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-4 gap-0.5 rounded-md bg-black/30 p-0.5">
                      <span className="rounded bg-emerald-400/10 py-1 text-center text-[8px] font-medium text-emerald-300 ring-1 ring-emerald-400/20">
                        All
                      </span>
                      <span className="rounded py-1 text-center text-[8px] text-slate-500">
                        TCP
                      </span>
                      <span className="rounded py-1 text-center text-[8px] text-slate-500">
                        ICMP
                      </span>
                      <span className="rounded py-1 text-center text-[8px] text-slate-500">
                        UDP
                      </span>
                    </div>

                    <ul className="mt-3 space-y-1">
                      {heroTargets.map((target) => {
                        const tone = statusStyles[target.status];
                        return (
                          <li
                            key={target.host}
                            className="flex items-center justify-between gap-1.5 rounded-md px-1.5 py-1.5"
                          >
                            <div className="flex min-w-0 items-center gap-1.5">
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`}
                              />
                              <div className="min-w-0">
                                <p className="truncate font-mono text-[9px] leading-tight text-slate-300">
                                  {target.host}
                                </p>
                                <p className="font-mono text-[8px] leading-tight text-slate-600">
                                  {target.protocol}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`shrink-0 font-mono text-[8px] ${tone.accent}`}
                            >
                              {target.latency}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-2 flex items-center justify-center gap-1 rounded-md border border-dashed border-white/10 py-1.5 text-[9px] text-slate-500">
                      <PlusIcon className="h-2.5 w-2.5" />
                      Add target
                    </div>

                    <div className="mt-auto border-t border-white/5 pt-3">
                      <p className="text-[8px] uppercase tracking-[0.16em] text-slate-600">
                        Origin
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                        <span className="font-mono text-[9px] text-slate-400">
                          192.168.1.10
                        </span>
                      </div>
                    </div>
                  </aside>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 border-b border-white/5 px-3 py-2">
                      <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        Live topology
                      </span>
                      <div className="flex items-center gap-1">
                        {protocols.map((protocol) => (
                          <span
                            key={protocol.name}
                            className="inline-flex items-center gap-1 rounded border border-white/5 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[8px] text-slate-400"
                          >
                            <span
                              className={`h-1 w-1 rounded-full ${protocol.dot}`}
                            />
                            {protocol.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="relative h-[276px] overflow-hidden sm:h-[304px]">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 50% 50%, rgba(52,211,153,0.06), transparent 60%)",
                        }}
                      />
                      <svg
                        viewBox="0 0 800 360"
                        preserveAspectRatio="none"
                        className="absolute inset-0 h-full w-full"
                        aria-hidden="true"
                      >
                        {heroTargets.map((target) => {
                          const tone = statusStyles[target.status];
                          return (
                            <g key={target.host}>
                              <path
                                d={target.path}
                                fill="none"
                                stroke={tone.lineGlow}
                                strokeWidth={4}
                              />
                              <path
                                d={target.path}
                                fill="none"
                                stroke={tone.line}
                                strokeWidth={1.3}
                                strokeDasharray="5 8"
                                className="animate-[flow-dash_2.8s_linear_infinite]"
                              />
                            </g>
                          );
                        })}
                      </svg>

                      {heroTargets.map((target) => {
                        const tone = statusStyles[target.status];
                        return (
                          <div
                            key={target.host}
                            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                            style={{ left: target.left, top: target.top }}
                          >
                            <div
                              className={`flex items-center gap-1.5 rounded-lg border bg-[#0a1119]/95 px-2 py-1.5 shadow-lg shadow-black/40 ${tone.card}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`}
                              />
                              <div>
                                <p className="whitespace-nowrap font-mono text-[9px] leading-tight text-slate-200">
                                  {target.host}
                                </p>
                                <p className="whitespace-nowrap font-mono text-[8px] leading-tight text-slate-500">
                                  {target.protocol} · {target.latency}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative flex flex-col items-center">
                          <span className="absolute top-0 h-16 w-16 animate-ping rounded-full border border-emerald-400/20 [animation-duration:3.5s]" />
                          <span className="absolute top-1 h-10 w-10 rounded-full bg-emerald-400/10 blur-md" />
                          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/40 bg-linear-to-br from-emerald-400/25 to-emerald-500/5 shadow-[0_0_32px_rgba(52,211,153,0.28)]">
                            <LogoMark className="h-5 w-5 text-emerald-300" />
                          </div>
                          <span className="mt-1.5 rounded-full border border-emerald-400/25 bg-[#08110d] px-2 py-0.5 font-mono text-[8px] tracking-wide text-emerald-300">
                            origin
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5 bg-black/20">
                      {[
                        { label: "Median RTT", value: "14 ms" },
                        { label: "Packet loss", value: "0.2%" },
                        { label: "Reachable", value: "3 / 4" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="px-2 py-2.5 text-center"
                        >
                          <p className="text-[8px] uppercase tracking-[0.12em] text-slate-600">
                            {stat.label}
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] text-slate-300">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 hidden items-center gap-2.5 rounded-xl border border-white/10 bg-[#0a1219]/95 px-3 py-2.5 shadow-xl shadow-black/50 backdrop-blur sm:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                  <ActivityIcon className="h-3 w-3" />
                </span>
                <div>
                  <p className="font-mono text-[9px] text-slate-300">
                    probe stream active
                  </p>
                  <p className="text-[9px] text-slate-500">
                    4 targets · 1s interval
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick stats */}
        <section
          aria-label="At a glance"
          className="relative border-y border-white/5 bg-white/[0.015]"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/5 sm:grid-cols-4">
            {[
              { value: "3", label: "protocols", sub: "TCP · ICMP · UDP" },
              { value: "1", label: "origin node", sub: "always in view" },
              { value: "Live", label: "updates", sub: "second by second" },
              {
                value: "∞",
                label: "target hosts",
                sub: "add as you grow",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#05080c] px-5 py-6 sm:px-8"
              >
                <p className="font-mono text-2xl font-medium tracking-tight text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-[11px] text-slate-600">{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400">
              Inside the visualizer
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white text-balance sm:text-4xl">
              A network map that tells you what is actually happening.
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-400">
              Every element of the dashboard exists to answer one question:
              can this origin reach that target, right now, over this protocol?
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ Icon, title, description, iconClass }) => (
              <article
                key={title}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[15px] font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-[13px] leading-6 text-slate-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Protocols */}
        <section
          id="protocols"
          className="relative scroll-mt-20 border-y border-white/5 bg-white/[0.015]"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400">
                  One map, three protocols
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white text-balance sm:text-4xl">
                  Probe the way the service expects.
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-slate-400">
                  A web endpoint, a bare-metal host and a UDP service should not
                  be checked the same way. Give every target the probe it
                  deserves.
                </p>
              </div>
              <p className="font-mono text-[11px] text-slate-600">
                tcp · icmp · udp
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {protocols.map((protocol) => (
                <article
                  key={protocol.name}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#070c12] p-6"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-wide ${protocol.badge}`}
                    >
                      <span
                        className={`h-1 w-1 rounded-full ${protocol.dot}`}
                      />
                      {protocol.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-slate-600">
                      {protocol.tagline}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-white">
                    {protocol.name} probes
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-slate-400">
                    {protocol.description}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-white/5 pt-5">
                    {protocol.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-2 text-[12px] text-slate-400"
                      >
                        <CheckIcon className="h-3.5 w-3.5 shrink-0 text-emerald-400/70" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center gap-2 rounded-lg border border-white/5 bg-black/30 px-3 py-2 font-mono text-[10px] text-slate-500">
                    <span className={`h-1 w-1 rounded-full ${protocol.dot}`} />
                    probe:{protocol.command}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Add targets */}
        <section
          id="targets"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 sm:px-8 lg:py-28"
        >
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-violet-400">
                Targets, not config files
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white text-balance sm:text-4xl">
                Add a host. Pick a protocol. Watch it light up.
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-slate-400">
                The targets tab is where the map grows. Enter a hostname or IP,
                set the port and interval where it matters, and choose the
                protocol you want that connection watched over.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  {
                    title: "One tab for every target",
                    body: "No YAML round-trip and no restart. Add, edit or remove hosts from the same place.",
                  },
                  {
                    title: "Protocol per target",
                    body: "Mix TCP, ICMP and UDP on the same map. Each probe keeps its own parameters.",
                  },
                  {
                    title: "Live from the first packet",
                    body: "A target appears on the graph as soon as it is added, then updates as probes land.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <div>
                      <p className="text-[14px] font-medium text-slate-200">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[13px] leading-6 text-slate-500">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <a
                href="#preview"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
              >
                See it on the map
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="relative pb-4 sm:pb-6">
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[2rem] bg-violet-500/[0.05] blur-2xl"
              />

              <div
                role="img"
                aria-label="Mock target form showing TCP selected, a host field filled with db-primary.internal, port 5432, a one second interval, and a list of watched targets."
                className="relative rounded-2xl border border-white/10 bg-[#070c12]/95 p-5 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.9)] sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
                      New target
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-100">
                      Add a host to watch
                    </p>
                  </div>
                  <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-2 py-0.5 font-mono text-[9px] text-violet-300">
                    probe
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-1 rounded-lg border border-white/5 bg-black/30 p-1">
                  {protocols.map((protocol, index) => (
                    <span
                      key={protocol.name}
                      className={
                        index === 0
                          ? "rounded-md border border-emerald-400/20 bg-emerald-400/10 py-1.5 text-center font-mono text-[10px] text-emerald-300"
                          : "rounded-md py-1.5 text-center font-mono text-[10px] text-slate-500"
                      }
                    >
                      {protocol.name}
                    </span>
                  ))}
                </div>

                <div className="mt-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                    Host
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5">
                    <ServerIcon className="h-3.5 w-3.5 text-slate-500" />
                    <span className="font-mono text-[12px] text-slate-200">
                      db-primary.internal
                    </span>
                    <span className="ml-auto h-3.5 w-px animate-pulse bg-emerald-400" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                      Port
                    </p>
                    <div className="mt-1.5 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-[12px] text-slate-300">
                      5432
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                      Interval
                    </p>
                    <div className="mt-1.5 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-[12px] text-slate-300">
                      1s
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex h-10 items-center justify-center gap-1.5 rounded-lg bg-emerald-400 text-[12px] font-semibold text-[#03110c]">
                  <PlusIcon className="h-3.5 w-3.5" />
                  Add target
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <p className="text-[11px] font-medium text-slate-400">
                    Now watching
                  </p>
                  <span className="font-mono text-[9px] text-slate-600">
                    3 probes
                  </span>
                </div>

                <ul className="mt-3 space-y-2">
                  {[
                    {
                      host: "db-primary.internal",
                      protocol: "TCP :5432",
                      latency: "8 ms",
                      status: "ok" as TargetStatus,
                    },
                    {
                      host: "edge-01",
                      protocol: "TCP :443",
                      latency: "12 ms",
                      status: "ok" as TargetStatus,
                    },
                    {
                      host: "cache-02",
                      protocol: "UDP :11211",
                      latency: "24 ms",
                      status: "degraded" as TargetStatus,
                    },
                  ].map((target) => {
                    const tone = statusStyles[target.status];
                    return (
                      <li
                        key={target.host}
                        className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`}
                          />
                          <span className="truncate font-mono text-[10px] text-slate-300">
                            {target.host}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="font-mono text-[9px] text-slate-600">
                            {target.protocol}
                          </span>
                          <span
                            className={`font-mono text-[9px] ${tone.accent}`}
                          >
                            {target.latency}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="absolute -bottom-2 -right-2 hidden items-center gap-2 rounded-xl border border-emerald-400/20 bg-[#0a1410] px-3 py-2 shadow-xl shadow-black/50 sm:flex">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <p className="text-[10px] text-slate-300">
                  Added to the live map
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-20 sm:px-8 lg:pb-28"
        >
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] px-6 py-12 sm:px-10 lg:px-12">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white text-balance sm:text-4xl">
                From a hostname to a live link in three steps.
              </h2>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {index < steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute left-11 right-0 top-5 hidden h-px bg-linear-to-r from-white/15 to-transparent md:block"
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] font-mono text-[11px] text-emerald-300">
                      {step.number}
                    </span>
                    <span className="h-px flex-1 bg-white/5 md:hidden" />
                  </div>
                  <h3 className="mt-5 text-[15px] font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-[13px] leading-6 text-slate-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-linear-to-br from-emerald-400/[0.13] via-[#07110d] to-cyan-400/[0.06] px-6 py-14 text-center sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
                maskImage:
                  "radial-gradient(ellipse 60% 60% at 50% 50%, #000, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 60% 60% at 50% 50%, #000, transparent 75%)",
              }}
            />
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300">
                Ready when you are
              </p>
              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-white text-balance sm:text-4xl">
                Stop reconstructing outages from logs.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-slate-400">
                Pin your origin, add your targets, and see connectivity for
                what it is: live, protocol by protocol, link by link.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#preview"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-[#03110c] shadow-[0_12px_36px_-12px_rgba(52,211,153,0.65)] transition-colors hover:bg-emerald-300 sm:w-auto"
                >
                  Open the live map
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#features"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.06] sm:w-auto"
                >
                  Explore features
                </a>
              </div>
              <p className="mt-6 font-mono text-[10px] tracking-wide text-slate-500">
                TCP · ICMP · UDP — no agent sprawl, no dashboard assembly
                required.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                <LogoMark className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold text-white">netviz</span>
            </a>
            <p className="mt-3 max-w-xs text-[12px] leading-5 text-slate-500">
              A real-time connectivity visualizer for the people who keep
              networks running.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[12px] text-slate-500 transition-colors hover:text-slate-200"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#preview"
              className="text-[12px] text-slate-500 transition-colors hover:text-slate-200"
            >
              Dashboard
            </a>
          </div>

          <p className="font-mono text-[10px] text-slate-600">
            © 2026 netviz
          </p>
        </div>
      </footer>
    </div>
  );
}
