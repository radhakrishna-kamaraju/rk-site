# Stage 1: generate knowledge-site.md (read by the rk-assistant "Ask this site"
# agent) from the real page content, so every deploy refreshes what it knows.
FROM node:22-alpine AS knowledge
WORKDIR /build
COPY scripts scripts
COPY site site
RUN node scripts/build-knowledge.js site /out/knowledge-site.md

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY site /srv
COPY --from=knowledge /out/knowledge-site.md /srv/knowledge-site.md
