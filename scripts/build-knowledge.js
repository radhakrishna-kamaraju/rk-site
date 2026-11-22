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

// ---- Projects: built from projects/data.js ----
function projects() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(SITE, 'projects', 'data.js'), 'utf8'), sandbox);
  const AUD = { mfg: 'AI in Manufacturing', build: 'Build with AI', learn: 'Learn about AI' };
  const KIND = { tool: 'a tool to try', demo: 'an interactive demo', story: 'a build story' };
  const out = [];
  out.push('### Projects (all of RK\'s projects, as listed on the homepage)');
  for (const p of sandbox.window.PROJECTS) {
    const link = /^https?:/.test(p.cta.href) ? p.cta.href : BASE + p.cta.href;
    out.push(`- ${p.title} (${p.status === 'live' ? 'live' : 'in progress'}, ${KIND[p.kind]}, for "${AUD[p.audience]}"): ${p.oneLiner} Link: ${link}`);
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

// ---- Smart Factory Line: built from factory/index.html ----
function factory() {
  const html = fs.readFileSync(path.join(SITE, 'factory', 'index.html'), 'utf8');
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const stations = [...html.matchAll(/ly:[\d.]+,name:'([^']+)'/g)].map((m) => m[1]);
  const levels = [...html.matchAll(/\{n:'([^']+)',d:'([^']+)'\}/g)].map((m, i) => `Level ${i + 1} ${m[1]}: ${m[2]}`);
  const out = [];
  out.push('### Smart Factory Line');
  out.push(`${desc} It runs in the browser, needs no sign-up and stores nothing. Page: ${BASE}/factory/`);
  if (stations.length) out.push(`Stations: ${stations.join(', ')}.`);
  if (levels.length) out.push(`The five levels use the same scale as the Industrial AI Index. ${levels.join(' ')}`);
  out.push('The counters on the page come from a simplified simulation and are not a forecast for a real plant.');
  return out.join('\n');
}

// ---- Agent Caseback: built from agents/index.html ----
function agents() {
  const html = fs.readFileSync(path.join(SITE, 'agents', 'index.html'), 'utf8');
  const desc = meta(html, /<meta name="description" content="([^"]*)"/);
  const terms = [...html.matchAll(/^ \["[a-z]+","([^"]+)","([^"]+)"\]/gm)].map((m) => `${m[1]}: ${m[2]}`);
  const out = [];
  out.push('### Agent Caseback');
  out.push(`${desc} Page: ${BASE}/agents/`);
  out.push('The project and its four weekly reports are invented. The agent outputs are real and were recorded on 16 Nov 2026; no model runs when a visitor presses Play.');
  out.push('Result of the recorded run: the project reported GREEN for four weeks, the first agent alone said AMBER, and after three rounds with the review agent the signed-off status was RED. The run took six model calls and 88 seconds of model time.');
  out.push('The same review step landed differently on one earlier pass, so a person should still approve the result.');
  if (terms.length) out.push(`Architecture terms explained on the page: ${terms.join(' ')}`);
  return out.join('\n');
}


// ---- Evals: built from evals/data.js ----
function evals() {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(SITE, 'evals', 'data.js'), 'utf8'), sandbox);
  const E = sandbox.window.EVALS;
  const out = [];
  out.push('### Evals (how RK tests this assistant)');
  out.push(`${E.total} checks run ${E.repeat} times each (${E.attempts} graded answers; ${E.total - E.passed} failed on ${E.date}). Answers by ${E.model}, graded by ${E.judge}. Page: ${BASE}/evals/`);
  out.push('Groups: ' + E.groups.map((g) => `${g.name} ${g.passed}/${g.total}`).join(', ') + '.');
  out.push('Found by the tests: about one answer in ten was empty because the model used its token budget thinking (fixed by raising the limit); two facts in RK\'s notes were wrong (newsletter status, 12 vs 32 questions); some of RK\'s own first checks were too strict.');
  out.push('Limits: RK wrote both assistant and tests, 43 checks is a small sample, a second model grades open-ended answers. Code: https://github.com/radhakrishna-kamaraju/rk-assistant');
  return out.join('\n');
}

const md = [
  '## Site tools and pages (generated from the live site at build time)',
  '',
  projects(),
  '',
  planner(),
  '',
  factory(),
  '',
  agents(),
  '',
  evals(),
  '',
  shipped(),
  '',
].join('\n');

// The output folder may not exist yet (in the Docker build it is /out), so create it.
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md);
console.log(`wrote ${OUT} (${md.length} bytes)`);
