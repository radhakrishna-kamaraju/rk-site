// Generates knowledge-site.md: plain-text facts about the site's pages, read by
// the "Ask this site" assistant (rk-assistant). Runs in the Docker build, so every
// deploy regenerates it from the real page content and nothing can drift.
// Usage: node scripts/build-knowledge.js [siteDir] [outFile]
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SITE = path.resolve(process.argv[2] || path.join(__dirname, '..', 'site'));
const OUT = path.resolve(process.argv[3] || path.join(SITE, 'knowledge-site.md'));
const BASE = 'https://radhakrishnakamaraju.com';

const meta = (html, re) => ((html.match(re) || [])[1] || '').replace(/\s+/g, ' ').trim();

// ---- AI Upskilling Planner: built from upskill/index.html + upskill/data.js ----
function planner() {
  const html = fs.readFileSync(path.join(SITE, 'upskill', 'index.html'), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(SITE, 'upskill', 'data.js'), 'utf8'), sandbox);
  const U = sandbox.window.UPSKILL;
  const desc = meta(html, /<meta name="description" content="([^"]*)"/);
  const out = [];
  out.push('### AI Upskilling Planner');
  out.push(`${desc} It runs in the browser, needs no sign-up and stores nothing. Page: ${BASE}/upskill/`);
  out.push('- The visitor answers six short questions (about 90 seconds) and gets a personal 8-week plan of 2 to 3 hours a week.');
  out.push('- Each week has one short concept, one task done on real work, and one thing to keep. Each week is tagged Perishable (tied to today\'s tools), Durable (a method that outlasts tools) or Enduring (judgment and leadership). There are beginner swaps and advanced stretches for each task.');
  out.push('- Weeks 1 and 2 are common to everyone: ' + U.core.map((w) => `week ${w[0]} "${w[1]}"`).join('; ') + '.');
  out.push('- Weeks 3 to 8 depend on the role track:');
  for (const t of Object.values(U.tracks)) {
    out.push(`  - ${t.name}: ${t.focus} Weeks: ` + t.weeks.map((w) => `${w[0]} ${w[1]}`).join('; ') + '.');
  }
  return out.join('\n');
}

// ---- Shipped log: built from shipped/data.js ----
function shipped() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(SITE, 'shipped', 'data.js'), 'utf8'), sandbox);
  // Newest first; entries on the same day keep file order, latest last in the file shown first.
  const L = sandbox.window.SHIPPED.map((e, i) => ({ ...e, i })).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.i - a.i));
  const out = [];
  out.push('### Shipped log (what RK has shipped, improved, fixed and written, newest first)');
  out.push(`A dated log of RK's personal projects. Full page: ${BASE}/shipped/`);
  for (const e of L) {
    out.push(`- ${e.date} [${e.tag}] ${e.title}: ${e.text}${e.link ? ' Link: ' + e.link : ''}`);
  }
  return out.join('\n');
}

const md = [
  '## Site tools and pages (generated from the live site at build time)',
  '',
  planner(),
  '',
  shipped(),
  '',
].join('\n');

// The output folder may not exist yet (in the Docker build it is /out), so create it.
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md);
console.log(`wrote ${OUT} (${md.length} bytes)`);
