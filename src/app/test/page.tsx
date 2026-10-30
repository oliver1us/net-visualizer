import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Example card — Net Visualizer",
  description: "A preview page for the Net Visualizer card component.",
};

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M20 12H4M10 18l-6-6 6-6" />
    </svg>
  );
}

export default function TestPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-clip bg-[#05080c] font-sans text-slate-100 selection:bg-emerald-400/30 selection:text-emerald-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/[0.09] blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-[13px] font-medium text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to overview
        </Link>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400">
          Test page
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white text-balance sm:text-4xl">
          Example card.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-400">
          A sample card using the same borders, tones and typography as the rest
          of the Net Visualizer UI.
        </p>

        <article className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors hover:border-white/15 hover:bg-white/[0.04]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect x="2.5" y="3.5" width="19" height="7" rx="2" />
                  <rect x="2.5" y="13.5" width="19" height="7" rx="2" />
                  <path d="M6.5 7h.01M6.5 17h.01M11 7h5M11 17h5" />
                </svg>
              </span>
              <div>
                <h2 className="text-[15px] font-semibold text-white">
                  db-primary.internal
                </h2>
                <p className="font-mono text-[11px] text-slate-500">
                  TCP :5432
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 font-mono text-[10px] tracking-wide text-emerald-300">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              healthy
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-3 divide-x divide-white/5 border-t border-white/5 pt-5">
            {[
              { label: "RTT", value: "8 ms" },
              { label: "Jitter", value: "1.2 ms" },
              { label: "Loss", value: "0.0%" },
            ].map((stat) => (
              <div key={stat.label} className="px-2 text-center first:pl-0 last:pr-0">
                <dt className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-mono text-sm text-slate-200">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex items-center gap-2 rounded-lg border border-white/5 bg-black/30 px-3 py-2 font-mono text-[10px] text-slate-500">
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            probe:tcp_connect · 1s interval
          </div>
        </article>
      </div>
    </main>
  );
}
