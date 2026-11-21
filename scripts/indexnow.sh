#!/bin/sh
# Tells Bing (and the other IndexNow engines: Yandex, Seznam, Naver) that the site changed,
# so new pages are crawled within minutes instead of waiting to be discovered.
# Run on the VPS right after a deploy rebuilds the container (the cron job only rebuilds
# when something changed, so this only runs then). Sends every URL in the live sitemap;
# for a site this size that is well within IndexNow's limits.
#
# The key below is public by design: it is served at /<key>.txt to prove the site is ours.
#
# Usage: sh scripts/indexnow.sh
set -eu

HOST="radhakrishnakamaraju.com"
KEY="d07e343a61d3fff62a24d11279dd9f8e"

# Give the new container a moment to start serving.
sleep 10

URLS=$(curl -fsS "https://$HOST/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed -e 's#<loc>##' -e 's#</loc>##' | sed 's/.*/"&"/' | paste -sd, -)
if [ -z "$URLS" ]; then
  echo "indexnow: no URLs found in the sitemap, nothing sent" >&2
  exit 1
fi

CODE=$(curl -sS -o /dev/null -w '%{http_code}' -X POST "https://api.indexnow.org/indexnow" \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d "{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"https://$HOST/$KEY.txt\",\"urlList\":[$URLS]}")

# 200 = accepted, 202 = accepted and the key is still being checked. Anything else is a problem.
case "$CODE" in
  200|202) echo "indexnow: submitted ($CODE)" ;;
  *) echo "indexnow: failed with HTTP $CODE" >&2; exit 1 ;;
esac
