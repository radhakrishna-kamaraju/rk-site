// Fills the data-driven parts of the site's pages with real HTML at build time,
// from projects/data.js and shipped/data.js, so the content is readable without
// JavaScript (search engines, link previews) and nothing has to be edited by hand.
//
// A page marks each generated block like this; everything between the markers is replaced:
//   <!-- build:featured --> ...fallback... <!-- /build:featured -->
//
// Runs in the Docker build on a copy of site/, before build-knowledge.js.
// Usage: node scripts/build-pages.js [siteDir]
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SITE = path.resolve(process.argv[2] || path.join(__dirname, '..', 'site'));

function load(file, name) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(SITE, file), 'utf8'), sandbox);
  return sandbox.window[name];
}
const PROJECTS = load('projects/data.js', 'PROJECTS');
const SHIPPED = load('shipped/data.js', 'SHIPPED');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ext = (href) => /^https?:/.test(href) ? ' rel="noopener"' : '';
const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const day = (d) => { const p = d.split('-'); return `${+p[2]} ${M[+p[1] - 1]} ${p[0]}`; };
const dayText = (d) => { const p = d.split('-'); return `${+p[2]} ${M[+p[1] - 1][0]}${M[+p[1] - 1].slice(1).toLowerCase()} ${p[0]}`; };

const AUDIENCE = { mfg: 'AI in Manufacturing', build: 'Build with AI', learn: 'Learn about AI' };
const KIND = { tool: 'TOOL', demo: 'DEMO', story: 'BUILD STORY' };

// Newest first; entries on the same day show the one lower in the file first.
const LOG = SHIPPED.map((e, i) => ({ ...e, i }))
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.i - a.i));

const lastLog = (p) => LOG.find((e) => e.project === p.slug);
const statusChip = (p) => p.status === 'live'
  ? '<span class="chip"><span class="dot live" aria-hidden="true"></span>LIVE</span>'
  : '<span class="chip"><span class="dot" aria-hidden="true"></span>BUILDING</span>';
const kindChip = (p) => `<span class="chip quiet">${KIND[p.kind]}</span>`;

// ---- blocks ----

function stats() {
  const live = PROJECTS.filter((p) => p.status === 'live').length;
  const building = PROJECTS.length - live;
  const last = LOG.find((e) => e.tag === 'Shipped');
  return [
    `<span><b>${PROJECTS.length}</b> projects</span>`,
    `<span><b>${live}</b> live</span>`,
    building ? `<span><b>${building}</b> in progress</span>` : '',
    last ? `<span>last shipped <b>${dayText(last.date)}</b></span>` : '',
  ].filter(Boolean).join('\n');
}

function startHere() {
  const tabs = [
    { id: 'mfg', intro: 'See where your organisation stands on AI, then watch what changes on a production line as AI maturity rises.' },
    { id: 'learn', intro: 'An 8-week plan that fits inside your job, a short note for every week, and one practical idea every two weeks.' },
    { id: 'build', intro: 'How I built a personal assistant on my own server, and two agents that check each other’s work.' },
  ];
  const notesCard = { title: 'A Note for Every Week', status: 'free', kind: 'notes',
    oneLiner: 'One short page per week of the plan, with what it looks like on your track. Start whenever you like.',
    cta: { text: 'Browse Notes', href: '/upskill/' } };
  const order = ['mfg', 'learn', 'build'];
  const tablist = order.map((id, n) =>
    `<button type="button" role="tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${id === 'learn'}"${id === 'learn' ? '' : ' tabindex="-1"'}>${AUDIENCE[id]}</button>`).join('\n');
  const panels = tabs.map((t) => {
    let items = PROJECTS.filter((p) => p.start && p.audience === t.id).slice(0, 2);
    if (t.id === 'learn') items = items.concat(notesCard).slice(0, 2);
    const cards = items.map((p) => `<article class="mini">
<div class="chips">${p.kind === 'notes' ? '<span class="chip"><span class="dot live" aria-hidden="true"></span>FREE</span><span class="chip quiet">NOTES</span>' : statusChip(p) + kindChip(p)}</div>
<h3>${esc(p.title)}</h3>
<p>${esc(p.oneLiner)}</p>
<a class="btn" href="${esc(p.cta.href)}"${ext(p.cta.href)}>${esc(p.cta.text)}</a>
</article>`).join('\n');
    return `<div class="panel${t.id === 'learn' ? ' on' : ''}" role="tabpanel" id="panel-${t.id}" aria-labelledby="tab-${t.id}">
<h3 class="nojs-title">${AUDIENCE[t.id]}</h3>
<p class="intro">${esc(t.intro)}</p>
<div class="minis">
${cards}
</div>
</div>`;
  }).join('\n');
  return `<div class="tabs" role="tablist" aria-label="Choose your path">
${tablist}
</div>
${panels}`;
}

function featured() {
  return PROJECTS.filter((p) => p.featured).slice(0, 3).map((p) => `<article class="card">
<div class="chips">${statusChip(p)}${kindChip(p)}</div>
<h3>${esc(p.title)}</h3>
<p>${esc(p.oneLiner)}</p>
<p class="for">${esc(AUDIENCE[p.audience]).toUpperCase()}</p>
<div class="btns"><a class="btn" href="${esc(p.cta.href)}"${ext(p.cta.href)}>${esc(p.cta.text)}</a>${p.story ? `<a class="btn quiet" href="${esc(p.story)}"${ext(p.story)}>How I Built It</a>` : ''}</div>
</article>`).join('\n');
}

function moreProjects() {
  const rows = PROJECTS.filter((p) => !p.featured).map((p) => `<a class="row" href="${esc(p.cta.href)}"${ext(p.cta.href)}>
<span class="name"><b>${esc(p.title)}</b> <span>— ${esc(p.short)}</span></span>
<span class="kind">${KIND[p.kind]}</span>
<span class="state">${p.status === 'live' ? '<span class="dot live" aria-hidden="true"></span>LIVE' : '<span class="dot" aria-hidden="true"></span>BUILDING'}</span>
<span class="arrow" aria-hidden="true">→</span>
</a>`).join('\n');
  return `<p class="more-h">MORE PROJECTS</p>\n${rows}`;
}

function allProjectsButton() {
  // Only link to /projects/ once that page exists, so no deploy has a dead link.
  return fs.existsSync(path.join(SITE, 'projects', 'index.html'))
    ? '<a class="btn quiet" href="/projects/">All Projects</a>'
    : '';
}

function recentlyShipped() {
  return '<ul class="list">\n' + LOG.slice(0, 3).map((e) =>
    `<li><p class="when">${day(e.date)} · ${esc(e.tag.toUpperCase())}</p><a href="/shipped/">${esc(e.title)}</a></li>`).join('\n') + '\n</ul>';
}

// ---- apply ----

function fill(file, blocks) {
  const f = path.join(SITE, file);
  let html = fs.readFileSync(f, 'utf8');
  for (const [name, render] of Object.entries(blocks)) {
    const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`);
    if (!re.test(html)) throw new Error(`${file}: marker build:${name} not found`);
    html = html.replace(re, (_, a, b) => `${a}\n${render()}\n${b}`);
  }
  fs.writeFileSync(f, html);
  console.log(`built ${file} (${Object.keys(blocks).join(', ')})`);
}

fill('index.html', {
  stats, start: startHere, featured, more: moreProjects, allprojects: allProjectsButton, shipped: recentlyShipped,
});
