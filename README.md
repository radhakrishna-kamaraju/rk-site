# radhakrishnakamaraju.com

Personal site for Radhakrishna Kamaraju (RK). One static page, served by Caddy in a Docker container.

## Layout

- `site/index.html`: the whole page, styles included.
- `site/fonts/`: self-hosted Space Grotesk and IBM Plex Mono (no third-party font requests).
- `Dockerfile`, `Caddyfile`, `docker-compose.yml`: the container. It publishes no ports; the Traefik proxy already on the VPS routes the domain to it and issues the HTTPS certificate.
- `.github/workflows/deploy.yml`: on every push to `main`, the VPS pulls and rebuilds.

## Links still to fill in

Search `site/index.html` for `LINK_` and replace each with the real address:

| Placeholder | What it should point to |
|---|---|
| `LINK_CLAWDIA_SERIES` | The ten-day Clawdia series (first post or a collection page) |
| `LINK_INDUSTRIAL_AI_INDEX` | The assessment app once it is live on its subdomain |
| `LINK_NEWSLETTER` | The buildwithRKAI newsletter page |
| `LINK_PHYSICAL_AI_LOG` | The Physical AI learning log post |
| `LINK_LINKEDIN` | LinkedIn profile |
| `LINK_GITHUB` | GitHub profile |

## Run locally

```
docker compose up --build
```

On the VPS, Traefik serves it at https://radhakrishnakamaraju.com. To preview on a laptop, add `ports: ["8081:80"]` to the service and open http://localhost:8081.

## First-time setup on the VPS

1. Clone this repository to `~/rk-site`.
2. Run `docker compose up -d --build`.
3. In the GitHub repository settings, add the secrets `VPS_HOST`, `VPS_USER` and `VPS_SSH_KEY` (a deploy key that can log in to the VPS).

## Not in this version

- The "ask the site" assistant (needs a small backend; planned next).
- Photo in the photography section.
