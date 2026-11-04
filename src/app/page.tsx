import {
  ArrowRight,
  Check,
  Network,
  RadioTower,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const highlights = [
  {
    icon: Network,
    title: 'See the topology',
    description: 'Follow your origin and every destination in one clear graph.',
  },
  {
    icon: RadioTower,
    title: 'Probe on demand',
    description: 'Run a network check and inspect its duration and status.',
  },
  {
    icon: ShieldCheck,
    title: 'Use the right protocol',
    description: 'Check TCP connections, ICMP echo, and DNS over UDP.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="border-b">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/25">
              <Network />
            </span>
            <span className="text-sm font-semibold tracking-tight">netviz</span>
            <Badge
              variant="outline"
              className="h-4 px-1.5 font-mono text-[9px] uppercase"
            >
              beta
            </Badge>
          </Link>

          <Button
            render={<Link href="/visualizer" />}
            nativeButton={false}
            size="sm"
          >
            Open visualizer
            <ArrowRight data-icon="inline-end" />
          </Button>
        </nav>
      </header>

      <section className="border-b">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
          <Badge variant="outline" className="gap-2 text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            Interactive network visualizer
          </Badge>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
            Understand your network at a glance.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Add destinations, run probes, and explore the connection between
            your origin and every host in a simple interactive graph.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              render={<Link href="/visualizer" />}
              nativeButton={false}
            >
              Go to visualizer
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<a href="#how-it-works" />}
              nativeButton={false}
            >
              How it works
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {[
              'Interactive graph',
              'TCP · ICMP · UDP DNS',
              'Add hosts in seconds',
            ].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20"
      >
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.2em] text-primary uppercase">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
            A small tool for clear answers.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Open the visualizer, add the hosts you care about, and inspect their
            latest probe state.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <span className="mb-2 flex size-9 items-center justify-center rounded-lg bg-muted text-primary">
                  <Icon />
                </span>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground sm:px-6">
          <span>netviz · Connectivity, visualised.</span>
          <Link
            href="/visualizer"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Open app
          </Link>
        </div>
      </footer>
    </main>
  );
}
