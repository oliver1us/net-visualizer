import {
  ArrowRight,
  Check,
  Gauge,
  Layers,
  ListPlus,
  MousePointerClick,
  Network,
  RefreshCw,
  Terminal,
  Waypoints,
} from 'lucide-react';

import { NetworkDashboard } from '@/components/network-dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const navItems = [
  { label: 'Visualizer', href: '#dashboard' },
  { label: 'Features', href: '#features' },
  { label: 'Protocols', href: '#protocols' },
];

const features = [
  {
    icon: MousePointerClick,
    title: 'An interactive topology',
    description:
      'Click any node to inspect round-trip time, jitter and loss. Filter by protocol and the map updates instantly.',
  },
  {
    icon: ListPlus,
    title: 'Add hosts in one tab',
    description:
      'The Hosts tab is your control panel. Enter a hostname or IP, choose a protocol, port and interval, then add it to the map.',
  },
  {
    icon: Layers,
    title: 'A protocol per target',
    description:
      'Mix TCP, ICMP and UDP on the same map. Every target keeps its own probe settings instead of sharing one global check.',
  },
  {
    icon: RefreshCw,
    title: 'Run probes on demand',
    description:
      'Refresh every target with a single click and watch latency, loss and status update across the topology.',
  },
  {
    icon: Gauge,
    title: 'Status you can scan',
    description:
      'Healthy, degraded and unreachable paths are colour-coded, with live latency and session statistics right beside the map.',
  },
  {
    icon: Terminal,
    title: 'Familiar probe semantics',
    description:
      'Built around the same reachability questions as blackbox-export, reimagined as a dashboard you will want to keep open.',
  },
];

const protocols = [
  {
    name: 'TCP',
    tagline: 'Connection-aware',
    description:
      'Verify that a service port answers and measure the handshake from your origin.',
    points: [
      'Host and port targeting',
      'Connect latency',
      'Per-target interval',
    ],
  },
  {
    name: 'ICMP',
    tagline: 'Reachability',
    description:
      'Echo a host at the network layer and see the round trip, or the exact moment it stops answering.',
    points: [
      'Echo request and reply',
      'Round-trip timing',
      'Packet loss tracking',
    ],
  },
  {
    name: 'UDP',
    tagline: 'Lightweight checks',
    description:
      'Probe connectionless services without a handshake and spot loss as conditions change.',
    points: ['Datagram probes', 'Loss detection', 'Low-overhead polling'],
  },
];

function Brand() {
  return (
    <a href="#top" className="group flex items-center gap-2.5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25 transition-colors group-hover:bg-primary/15">
        <Network className="size-4" />
      </span>
      <span className="text-sm font-semibold tracking-tight text-foreground">
        netviz
      </span>
      <Badge
        variant="outline"
        className="h-4 px-1.5 font-mono text-[9px] tracking-wider uppercase"
      >
        beta
      </Badge>
    </a>
  );
}

export default function Home() {
  return (
    <div
      id="top"
      className="relative flex min-h-screen flex-col overflow-x-clip"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        >
          <Brand />

          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>

          <Button
            size="sm"
            render={<a href="#dashboard" />}
            nativeButton={false}
          >
            Open dashboard
            <ArrowRight data-icon="inline-end" />
          </Button>
        </nav>
      </header>

      <main id="main" className="relative">
        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)',
                backgroundSize: '52px 52px',
                maskImage:
                  'radial-gradient(ellipse 75% 60% at 50% 0%, #000 10%, transparent 75%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 75% 60% at 50% 0%, #000 10%, transparent 75%)',
              }}
            />
            <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
            <div className="absolute top-20 right-0 size-[340px] rounded-full bg-info/5 blur-[110px]" />
          </div>

          <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
            <Badge
              variant="outline"
              className="h-6 gap-2 border-primary/25 bg-primary/5 px-3 text-xs text-primary"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              Interactive network visualizer
            </Badge>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
              Watch your network{' '}
              <span className="bg-linear-to-r from-primary via-primary to-info bg-clip-text text-transparent">
                come alive.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
              Pin an origin, add target hosts, and see every TCP, ICMP and UDP
              path on one interactive map. No dashboard assembly, no config
              round-trips — just connectivity, live.
            </p>

            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<a href="#dashboard" />}
                nativeButton={false}
              >
                Explore the live map
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                render={<a href="#features" />}
                nativeButton={false}
              >
                See what&apos;s inside
              </Button>
            </div>

            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {[
                'Interactive topology',
                'Add hosts in a tab',
                'TCP · ICMP · UDP',
                'No agents required',
              ].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Dashboard */}
        <section
          id="dashboard"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24"
        >
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                The dashboard
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
                A live map you can actually touch.
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                Use the Visualizer tab to explore the topology, then switch to
                Hosts to add or remove targets. Everything in this demo is
                interactive — click a node, filter protocols, or run a probe
                round.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="font-mono text-[10px]">
                01 Visualizer
              </Badge>
              <Badge variant="secondary" className="font-mono text-[10px]">
                02 Hosts
              </Badge>
            </div>
          </div>

          <NetworkDashboard />
        </section>

        {/* Features */}
        <section id="features" className="border-y bg-muted/20 scroll-mt-20">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
                Features
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
                Everything you need to see what is happening.
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                A focused set of tools for answering one question: can this
                origin reach that target, right now, over this protocol?
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <Card
                  key={title}
                  className="transition-colors hover:ring-primary/25"
                >
                  <CardHeader>
                    <span className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon className="size-4" />
                    </span>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="leading-6">
                      {description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Protocols */}
        <section
          id="protocols"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24"
        >
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
              One map, three protocols
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
              Probe the way the service expects.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
              A web endpoint, a bare-metal host and a UDP service should not be
              checked the same way. Give every target the probe it deserves.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {protocols.map((protocol) => (
              <Card key={protocol.name}>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {protocol.name}
                    </Badge>
                    <span className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                      {protocol.tagline}
                    </span>
                  </div>
                  <CardTitle>{protocol.name} probes</CardTitle>
                  <CardDescription className="leading-6">
                    {protocol.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-2 border-t pt-4">
                    {protocol.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <Check className="size-3.5 shrink-0 text-primary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:pb-24">
          <Card className="relative overflow-hidden bg-linear-to-br from-primary/15 via-card to-info/10 px-6 py-12 text-center ring-primary/20 sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)',
                backgroundSize: '42px 42px',
                maskImage:
                  'radial-gradient(ellipse 60% 60% at 50% 50%, #000, transparent 75%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 60% 60% at 50% 50%, #000, transparent 75%)',
              }}
            />
            <div className="relative flex flex-col items-center">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25">
                <Waypoints className="size-5" />
              </span>
              <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">
                Stop reconstructing outages from logs.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Add a host, pick a protocol, and see the link for what it is:
                live, link by link.
              </p>
              <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  render={<a href="#dashboard" />}
                  nativeButton={false}
                >
                  Open the live map
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  render={<a href="#protocols" />}
                  nativeButton={false}
                >
                  Compare protocols
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-col gap-2">
            <Brand />
            <p className="text-xs text-muted-foreground">
              Real-time connectivity, visualised.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <span className="font-mono text-[10px] text-muted-foreground">
              © 2026 netviz
            </span>
          </nav>
        </div>
      </footer>
    </div>
  );
}
