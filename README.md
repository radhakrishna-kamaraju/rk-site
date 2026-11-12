# radhakrishnakamaraju.com

Personal site for Radhakrishna Kamaraju (RK). One static page, served by Caddy in a Docker container.

## Layout

- `site/index.html`: the whole page, styles included.
- `site/fonts/`: self-hosted Space Grotesk and IBM Plex Mono (no third-party font requests).
- `Dockerfile`, `Caddyfile`, `docker-compose.yml`: the container. It publishes no ports; the Traefik proxy already on the VPS routes the domain to it and issues the HTTPS certificate.
- Deploys are manual for now: on the VPS, `cd ~/rk-site && git pull && docker compose up -d --build`.

## Links still to fill in

Search `site/index.html` for `LINK_` and replace each with the real address:

| Placeholder | What it should point to |
|---|---|

## Run locally

```
docker compose up --build
```

On the VPS, Traefik serves it at https://radhakrishnakamaraju.com. To preview on a laptop, add `ports: ["8081:80"]` to the service and open http://localhost:8081.

## First-time setup on the VPS

1. Clone this repository to `~/rk-site`.
2. Run `docker compose up -d --build`.

## Not in this version

- Newsletter links: the notes row says "coming soon" and the footer link is removed until buildwithRKAI is published.
- The "ask the site" assistant (needs a small backend; planned next).
- Photo in the photography section.

## Résumé PDF

The public résumé is `site/Radhakrishna-Kamaraju-Resume.pdf`, generated from `resume/resume.html`.
To update it: edit `resume/resume.html`, then run `python3 resume/build.py` (needs `pip install playwright` and `playwright install chromium`), and commit both files.
