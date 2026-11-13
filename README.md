# radhakrishnakamaraju.com

Personal site of Radhakrishna Kamaraju (RK): one static page, a one-page résumé PDF, and an "Ask this site" assistant. Part of a small set of AI projects I build and run myself.

## The pieces

| Repo | What it is | Live |
|---|---|---|
| **rk-site** (this repo) | Static site served by Caddy | [radhakrishnakamaraju.com](https://radhakrishnakamaraju.com) |
| [industrial-ai-index](https://github.com/radhakrishna-kamaraju/industrial-ai-index) | AI-readiness assessment for manufacturers, with a report written by Claude | [industrial-ai.radhakrishnakamaraju.com](https://industrial-ai.radhakrishnakamaraju.com) |
| [rk-assistant](https://github.com/radhakrishna-kamaraju/rk-assistant) | The "Ask this site" assistant, answering only from public site content | `POST /api/ask` on the main domain |

Each runs as its own Docker container on one Linux VPS behind a shared Traefik proxy, which routes by hostname and path and issues the HTTPS certificates. No container publishes a port.

## This repo

- `site/index.html`: the whole page, styles and the assistant widget included.
- `site/upskill/`: the AI Upskilling Planner. `index.html` is the page and `data.js` holds the 8-week content for the six role tracks. It runs entirely in the browser.
- `site/fonts/`: self-hosted Space Grotesk and IBM Plex Mono (no third-party font requests).
- `site/Radhakrishna-Kamaraju-Resume.pdf`: the public résumé, generated from `resume/resume.html`.
- `Dockerfile`, `Caddyfile`, `docker-compose.yml`: the container and its Traefik labels.

## Deploy

Push to `main`. A cron job on the VPS pulls every 5 minutes and rebuilds the container only when something changed.

## Run locally

```
docker compose up --build
```

On the VPS, Traefik serves it. To preview on a laptop, add `ports: ["8081:80"]` to the service and open http://localhost:8081.

## Update the résumé

Edit `resume/resume.html`, run `python3 resume/build.py` (needs `pip install playwright` and `playwright install chromium`), and commit both the HTML and the PDF.

## Not yet

- Newsletter link, once buildwithRKAI is published.
- A photo in the photography section.
