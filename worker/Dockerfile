ARG NODE_IMAGE=node:24.22.2-bookworm-slim@sha256:c86ecead9e55a5210ac1727de38a4ca840bf03dcaf34dc9749addbf383b1920c
FROM ${NODE_IMAGE} AS ping
RUN apt-get update && apt-get install -y --no-install-recommends iputils-ping && rm -rf /var/lib/apt/lists/* \
    && setcap -r /usr/bin/ping

FROM ${NODE_IMAGE} AS runtime
RUN mkdir -p /run/probe && chown node:node /run/probe
COPY --from=ping /usr/bin/ping /usr/bin/ping
WORKDIR /app
COPY --chown=node:node worker/*.mjs ./
USER node
CMD ["node", "server.mjs"]
