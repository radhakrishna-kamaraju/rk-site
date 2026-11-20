# Stage 1: build step on a copy of the site.
#  - build-pages.js fills the data-driven parts of the pages (project cards, the
#    shipped strip) with real HTML from projects/data.js and shipped/data.js.
#  - build-knowledge.js generates knowledge-site.md, read by the rk-assistant
#    "Ask this site" agent, from the real page content.
# Every deploy refreshes both, so nothing can drift.
FROM node:22-alpine AS build
WORKDIR /build
COPY scripts scripts
COPY site site
RUN node scripts/build-pages.js site \
 && node scripts/build-knowledge.js site /out/knowledge-site.md

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /build/site /srv
COPY --from=build /out/knowledge-site.md /srv/knowledge-site.md
