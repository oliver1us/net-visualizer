import {
  Activity,
  Gauge,
  Globe2,
  Network,
  RadioTower,
  Server,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from 'lucide-react';
import Link from 'next/link';

import { NetworkDashboard } from '@/components/network-dashboard';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const signalCards = [
  {
    icon: RadioTower,
    label: 'Signal pulse',
    value: 'Continuous',
    detail: 'Server-side monitoring',
    tone: 'text-primary bg-primary/10 ring-primary/20',
  },
  {
    icon: Waypoints,
    label: 'Topology mode',
    value: 'Orbit',
    detail: 'Origin-to-target paths',
    tone: 'text-info bg-info/10 ring-info/20',
  },
  {
    icon: ShieldCheck,
    label: 'Probe stack',
    value: '3 probes',
    detail: 'TCP · ICMP · UDP DNS',
    tone: 'text-success bg-success/10 ring-success/20',
  },
  {
    icon: Gauge,
    label: 'Readout',
    value: 'At a glance',
    detail: 'Per-probe duration',
    tone: 'text-warning bg-warning/10 ring-warning/20',
  },
];

export const metadata = {
  title: 'Visualizer — Netviz',
  description: 'Interactive network topology and probe dashboard.',
};

export default function VisualizerPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <nav className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Network data-icon="inline-start" />
            netviz
          </Link>
          <Badge variant="outline" className="font-mono text-[10px]">
            /visualizer
          </Badge>
        </nav>
        <header className="flex flex-col gap-6 border-b pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/25">
              <Sparkles />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1.5 text-primary">
                  <Activity data-icon="inline-start" />
                  Probe workspace
                </Badge>
                <span className="font-mono text-xs text-muted-foreground">
                  /visualizer
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Your network, as a living graph.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Explore connections like ideas in Obsidian: origin at the
                center, destinations around it, and every bubble carrying its
                own signal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            TCP probes originate from the web container; ICMP and UDP from the
            worker
          </div>
        </header>

        <section aria-label="Network visualizer">
          <NetworkDashboard />
        </section>

        <section
          aria-label="Visualizer highlights"
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          {signalCards.map(({ icon: Icon, label, value, detail, tone }) => (
            <Card
              key={label}
              size="sm"
              className="group transition-colors hover:ring-primary/25"
            >
              <CardHeader className="flex-row items-start justify-between gap-3">
                <div>
                  <CardDescription>{label}</CardDescription>
                  <CardTitle className="mt-1 text-lg">{value}</CardTitle>
                </div>
                <span
                  className={`flex size-9 items-center justify-center rounded-xl ring-1 transition-transform group-hover:scale-105 ${tone}`}
                >
                  <Icon />
                </span>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-muted-foreground">
                {detail}
              </CardContent>
            </Card>
          ))}
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <Globe2 />
            One origin. Every route. Clear answers.
          </span>
          <span className="flex items-center gap-2 font-mono">
            <Server />
            netviz / signal desk
          </span>
        </footer>
      </div>
    </main>
  );
}
