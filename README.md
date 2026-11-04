# Net Visualizer

Net Visualizer checks TCP, ICMP echo and DNS over UDP targets when added and
every 30 seconds while the dashboard page remains open. Browsers may delay
checks in background tabs. This is not yet server-side continuous monitoring:
targets disappear on reload, and persistent history and Prometheus integration
are not implemented.

## Docker Compose

Docker Engine and Docker Compose are required. Only configure networks you own
or are authorized to monitor. The current Compose file defaults both services
to `0.0.0.0/0` (all IPv4) for temporary testing. Set `PROBE_ALLOWED_CIDRS`
explicitly to the same narrow policy for both services before broader use.
Exposing probes to untrusted users is unsafe.

```sh
PROBE_ALLOWED_CIDRS=192.168.1.0/24 docker compose up -d --build
```

Open <http://127.0.0.1:3000/visualizer>. The current `compose.yml` publishes
port 3000 on **all host interfaces**. It has no authentication; change the port
mapping to `127.0.0.1:3000:3000` for local-only access, or restrict access
externally before starting it. Separate multiple IPv4 or IPv6
addresses/CIDRs with commas, e.g. `192.168.1.0/24,2001:db8:1::/64`.
An address without a prefix means one address. Set the variable each time you
run `docker compose up`, or put it in a local `.env` file. Changing the value
requires recreating the container with `docker compose up -d`.

TCP runs in the web container; ICMP and DNS/UDP run in a separate worker.
Therefore `127.0.0.1` means the respective container, not the Docker host or
the other container. Docker networking and IPv6 configuration can affect which
destinations are reachable. DNS names are resolved by the web server; at least
one returned address must be allowed. The probe connects directly to the first
permitted IP, without resolving the name a second time. This is not a
multi-address failover test.

```sh
docker compose ps
docker compose logs --tail=50 net-visualizer
docker compose logs --tail=50 probe-worker
curl -fsS http://127.0.0.1:3000/api/health
docker compose down
```

The healthcheck checks only that the application responds, not whether monitored
targets are healthy. The image uses three stages, a digest-pinned Node 24 base,
and Next.js standalone output. The container uses an unprivileged user, a
read-only root filesystem, limited writable tmpfs mounts, dropped capabilities,
`no-new-privileges`, resource limits and bounded logs. Update the pinned base
digest and rebuild regularly to receive security fixes.

The worker has no published TCP port. The web app connects to its Unix socket
through a dedicated volume mounted read-only by the web container; both services
independently validate allowed networks. The worker drops all capabilities and
uses Linux unprivileged ping sockets with `net.ipv4.ping_group_range` limited to
its group. Its image removes the file capability from `ping`. The Docker daemon
and kernel must permit this namespaced sysctl and unprivileged ping sockets;
ICMP may fail on other environments. Docker users able to mount the socket
volume can directly request allowed probes, so protect Docker access. DNS over
UDP sends an `example.com IN A` query to the configured IP and port; success
requires a matching, well-formed, non-truncated NOERROR response. Other UDP
services are not supported. A DNS timeout or malformed response is shown as
unknown, not as proof that a host or arbitrary UDP port is down.

### Security limits

The UI is intended only for a trusted local user. The current port mapping
exposes it on all interfaces; restrict it before use.
**There is no authentication, authorization, port allowlist, per-client rate
limit, or audit log.** Any local user able to access it can probe any port in
the allowed networks, including sensitive addresses if explicitly allowed.
Do not expose it to untrusted users or to the internet. Remote or multiuser use
requires authentication, TLS, network egress controls, request/body timeouts,
rate limits, and authorization before deployment. The concurrency limit of 10
is per application process, not a distributed rate limit. Keep CIDRs as narrow
as possible; a container alone is not an egress firewall.

## Verification

Build and run the container as above, then with Node 24 on the host run:

```sh
nvm use
npm run lint
npm test
npm run test:integration
```

The integration tests expect a policy that denies loopback and the metadata
address, so they are not compatible with the temporary all-IPv4 default. To test a
successful and a refused TCP connection, temporarily start a **test instance**
with `PROBE_ALLOWED_CIDRS=127.0.0.1/32` and run
`TEST_ALLOW_LOOPBACK=1 npm run test:integration`. The test connects to the
application's own port inside the web container and checks ICMP echo inside the
worker container. Do not add loopback to a
production allowlist just to run this test. `TEST_BASE_URL` can change the
host-side URL; the application must still listen on port 3000 inside its
container for the loopback success test.

## Implementation stages

1. **Partially complete:** hardened multi-stage image, Compose deployment,
   independent healthcheck, CIDR validation, bounded TCP probes and integration
   tests. Both Compose services default to all IPv4; configure an explicit
   narrow CIDR before broader use.
2. **Partially complete:** isolated probe worker, ICMP echo and validated
   UDP/DNS probes. Authentication and authorization, port and rate policies
   remain pending.
3. **Partially complete:** immediate, per-target status and periodic checks while
   the browser page is open. Server-side scheduling, persistent targets and
   sample history, rolling loss/latency metrics, and live updates remain pending.
4. **Pending:** full protocol/security end-to-end tests, monitoring and optional
   Prometheus integration.

A generic UDP send does not prove reachability. Unlike ICMP and TCP, Blackbox
Exporter does not offer a generic arbitrary UDP prober either.

## Local development

## Requirements

Node.js 24 LTS (pinned in `.nvmrc`). Run `nvm use` before working on the project.

> Node 27 alpha is not supported: its `req.headers` has a null prototype, which makes the
> Next.js dev server crash with `rawHeaders.hasOwnProperty is not a function`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
