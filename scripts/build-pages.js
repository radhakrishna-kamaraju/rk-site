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
  // The weekly notes card appears once the notes exist; until then, the newsletter.
  const notesCard = fs.existsSync(path.join(SITE, 'upskill', 'week-1', 'index.html'))
    ? { title: 'A Note for Every Week', kind: 'notes', badge: 'NOTES',
      oneLiner: 'One short page per week of the plan, with what it looks like on your track. Start whenever you like.',
      cta: { text: 'Browse Notes', href: '/upskill/#weeks' } }
    : { title: 'buildwithRKAI Newsletter', kind: 'notes', badge: 'NEWSLETTER',
      oneLiner: 'Every two weeks: one week of the plan explained for all six tracks, plus what I built and learned.',
      cta: { text: 'Subscribe Newsletter', href: NEWSLETTER } };
  const order = ['mfg', 'learn', 'build'];
  const tablist = order.map((id, n) =>
    `<button type="button" role="tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${id === 'learn'}"${id === 'learn' ? '' : ' tabindex="-1"'}>${AUDIENCE[id]}</button>`).join('\n');
  const panels = tabs.map((t) => {
    let items = PROJECTS.filter((p) => p.start && p.audience === t.id).slice(0, 2);
    if (t.id === 'learn') items = items.concat(notesCard).slice(0, 2);
    const cards = items.map((p) => `<article class="mini">
<div class="chips">${p.kind === 'notes' ? '<span class="chip"><span class="dot live" aria-hidden="true"></span>FREE</span><span class="chip quiet">' + p.badge + '</span>' : statusChip(p) + kindChip(p)}</div>
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


// ---- shared header and footer: one definition, injected into every page ----

const NEWSLETTER = 'https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7528134916136607746';

function chromeCss() {
  return `<style>
.sh-head,.sh-foot{display:block;margin:0;padding:0;font-size:16px;line-height:1.2;color:#C9D2DE;background:#0F1B2D;font-family:"Space Grotesk",system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.sh-head{border-bottom:1px solid #2A3C57}
.sh-foot{border-top:1px solid #2A3C57;margin-top:48px;width:100%}
.sh-in{max-width:1120px;margin:0 auto;padding:14px 24px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;box-sizing:border-box}
.sh-mark{font-family:"IBM Plex Mono",ui-monospace,monospace;font-weight:500;font-size:18px;letter-spacing:2px;color:#F2A33A!important;padding:12px 0;text-decoration:none}
.sh-nav{display:flex;flex-wrap:wrap;align-items:center;gap:4px 28px;font-size:16px;line-height:1.2}
.sh-nav a{color:#C9D2DE;padding:12px 0;text-decoration:none}
.sh-nav a:hover{color:#F2A33A}
.sh-nav a[aria-current="page"]{color:#F4F1EA;font-weight:600}
.sh-nav a.sh-pill{color:#F4F1EA;border:1px solid #2F4769;border-radius:999px;padding:9px 16px;font-weight:500}
.sh-nav a.sh-pill:hover{border-color:#F2A33A;color:#F2A33A}
.sh-head a:focus-visible,.sh-foot a:focus-visible{outline:3px solid #F2A33A;outline-offset:4px;border-radius:6px}
.sh-foot .sh-in{padding:28px 24px 40px;font-size:14px;color:#A9B4C4}
.sh-foot .sh-links{display:flex;flex-wrap:wrap;gap:20px}
.sh-foot .sh-links a{color:#F2A33A;text-decoration:none}
.sh-foot .sh-links a:hover{text-decoration:underline}
.sh-mono{font-family:"IBM Plex Mono",ui-monospace,monospace}
@media print{.sh-head,.sh-foot{display:none!important}}
</style>`;
}

function header(page) {
  const items = [
    ['projects', 'Projects', fs.existsSync(path.join(SITE, 'projects', 'index.html')) ? '/projects/' : '/#work'],
    ['learn', 'Learn about AI', '/upskill/'],
    ['notes', 'Notes', '/#notes'],
    ['about', 'About', '/about/'],
  ];
  const links = items.map(([id, text, href]) =>
    `<a href="${href}"${id === page ? ' aria-current="page"' : ''}>${text}</a>`).join('\n');
  return `<div class="sh-head" role="banner">
<div class="sh-in">
<a class="sh-mark" href="/" aria-label="RK, home">RK</a>
<div class="sh-nav" role="navigation" aria-label="Main">
${links}
<a class="sh-pill" href="/#ask">Ask this site</a>
</div>
</div>
</div>`;
}

function footer() {
  return `<div class="sh-foot" role="contentinfo">
<div class="sh-in">
<span>Radhakrishna Kamaraju &middot; <span class="sh-mono">buildwithRKAI</span></span>
<div class="sh-links" role="navigation" aria-label="Elsewhere">
<a href="https://www.linkedin.com/in/radhakrishna-kamaraju/" rel="noopener">LinkedIn</a>
<a href="https://github.com/radhakrishna-kamaraju" rel="noopener">GitHub</a>
<a href="${NEWSLETTER}" rel="noopener">Newsletter</a>
<a href="mailto:hello@radhakrishnakamaraju.com">Email</a>
</div>
</div>
</div>`;
}

const chrome = (page) => ({ chromecss: chromeCss, header: () => header(page), footer });

// ---- project pages: /projects/<slug>/ for every project with page: true ----

const PAGE_CSS = `<style>
@font-face{font-family:"Space Grotesk";font-weight:400;font-display:swap;src:url("/fonts/space-grotesk-latin-400-normal.woff2") format("woff2")}
@font-face{font-family:"Space Grotesk";font-weight:500;font-display:swap;src:url("/fonts/space-grotesk-latin-500-normal.woff2") format("woff2")}
@font-face{font-family:"Space Grotesk";font-weight:700;font-display:swap;src:url("/fonts/space-grotesk-latin-700-normal.woff2") format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-weight:400;font-display:swap;src:url("/fonts/ibm-plex-mono-latin-400-normal.woff2") format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-weight:500;font-display:swap;src:url("/fonts/ibm-plex-mono-latin-500-normal.woff2") format("woff2")}
:root{--bg:#0F1B2D;--text:#F4F1EA;--muted:#A9B4C4;--body:#C9D2DE;--card:#17283F;--line:#2A3C57;--accent:#F2A33A;--live:#4ADE80;--quiet:#1F3350;--quiet-line:#2F4769;
--sans:"Space Grotesk",system-ui,-apple-system,"Segoe UI",sans-serif;--mono:"IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--sans);-webkit-font-smoothing:antialiased}
a{color:var(--text);text-decoration:none}a:hover{color:var(--accent)}
a:focus-visible,button:focus-visible{outline:3px solid var(--accent);outline-offset:4px;border-radius:6px}
h1,h2,h3,p{margin:0}
.wrap{max-width:1120px;margin:0 auto;padding:0 24px}
.label{font-family:var(--mono);font-size:13px;letter-spacing:.12em;color:var(--muted);margin-bottom:10px}
.crumb{font-family:var(--mono);font-size:13px;color:var(--muted);margin-bottom:24px}
.crumb a{color:var(--muted)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px}
.chip{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:12px;letter-spacing:.08em;color:var(--text);border:1px solid var(--quiet-line);padding:3px 8px;border-radius:6px}
.chip.quiet{color:var(--body);border-color:var(--line)}
.dot{width:7px;height:7px;border-radius:50%;background:var(--muted);display:inline-block}.dot.live{background:var(--live)}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:12px 20px;border-radius:12px;font-weight:600;font-size:15px;background:var(--accent);color:var(--bg)}
.btn:hover{color:var(--bg);filter:brightness(1.08)}
.btn.quiet{background:var(--quiet);color:var(--text);border:1px solid var(--quiet-line)}
.btn.quiet:hover{border-color:var(--accent);color:var(--text);filter:none}
.btn.big{font-size:16px;padding:14px 24px}
.top{padding:56px 0 40px}
.top h1{font-size:clamp(36px,5vw,56px);line-height:1.08;font-weight:700;letter-spacing:-0.02em}
.top .lead{margin-top:18px;max-width:680px;font-size:19px;line-height:1.6;color:var(--body)}
.top .actions{margin-top:28px;display:flex;flex-wrap:wrap;gap:12px}
.body{display:flex;flex-wrap:wrap;gap:48px;align-items:flex-start;padding:24px 0 56px}
.story{flex:999 1 560px;min-width:0}
.story .p{font-size:18px;line-height:1.7;color:var(--body);margin-bottom:40px}
.story ul{margin:0;padding:0 0 0 20px;font-size:18px;line-height:1.7;color:var(--body)}
.story ul li{margin-bottom:8px}
.areas{display:flex;flex-wrap:wrap;gap:10px;margin:-24px 0 40px}
.areas span{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 14px;font-size:15px}
.steps{list-style:none;margin:0 0 16px;padding:0}
.steps li{display:flex;gap:16px;padding:14px 0;border-top:1px solid var(--line);font-size:17px;line-height:1.55;color:var(--body)}
.steps li:last-child{border-bottom:1px solid var(--line)}
.steps b{font-family:var(--mono);font-size:13px;font-weight:400;color:var(--accent);width:24px;flex:none;padding-top:3px}
.note{font-size:14px;line-height:1.6;color:var(--muted);margin-bottom:40px}
.glance{flex:1 1 280px;min-width:0;background:var(--card);border:1px solid var(--line);border-radius:24px;padding:28px}
.glance dl{margin:0;display:grid;gap:14px}
.glance dt{font-family:var(--mono);font-size:12px;color:var(--muted);text-transform:uppercase}
.glance dd{margin:2px 0 0;font-size:16px}
.glance .btn{width:100%;margin-top:24px}
section.band{padding:56px 0;border-top:1px solid var(--line)}
section.band h2{font-size:28px;font-weight:600;margin-bottom:8px}
section.band .intro{max-width:680px;font-size:17px;line-height:1.6;color:var(--body);margin-bottom:20px}
.list{list-style:none;margin:0;padding:0;border-bottom:1px solid var(--line)}
.list li{padding:16px 0;border-top:1px solid var(--line)}
.list .when{font-family:var(--mono);font-size:12px;color:var(--muted);margin-bottom:6px}
.list .what{font-size:17px}
.days li{display:flex;flex-wrap:wrap;align-items:center;gap:8px 20px}
.days .d{font-family:var(--mono);font-size:13px;color:var(--accent);width:64px}
.days .dt{font-family:var(--mono);font-size:12px;color:var(--muted);width:72px}
.days .t{flex:1 1 360px;min-width:0}
.days .t span{display:block;font-size:17px;line-height:1.4}
.days .t small{display:block;font-family:var(--mono);font-size:12px;color:var(--muted);margin-top:4px;text-transform:uppercase}
.days .btn{width:96px;font-size:14px;padding:10px 16px}
.split{display:flex;flex-wrap:wrap;align-items:center;gap:40px}
.split .text{flex:1 1 520px;min-width:0}
.split .text p:not(.label){font-size:17px;line-height:1.6;color:var(--body)}
.split .side{flex:1 1 260px;min-width:0;display:flex;justify-content:center}
.split .side .btn{width:280px;max-width:100%}
.related{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;background:var(--card);border:1px solid var(--line);border-radius:24px;padding:28px;margin:24px 0 72px}
.related .k{display:block;font-family:var(--mono);font-size:12px;letter-spacing:.1em;color:var(--muted);margin-bottom:6px}
.related b{display:block;font-size:24px;font-weight:600}
.related .s{display:block;font-size:16px;color:var(--body);margin-top:4px}
.related:hover b{color:var(--accent)}
</style>`;

const dayLong = (d) => { const p = d.split('-'); const MO = ['January','February','March','April','May','June','July','August','September','October','November','December']; return `${+p[2]} ${MO[+p[1] - 1]} ${p[0]}`; };
const shortDay = (d) => { const p = d.split('-'); return `${+p[2]} ${M[+p[1] - 1]}`; };

function projectPage(p) {
  const sec = [];
  let n = 0;
  const num = () => String(++n).padStart(2, '0');
  if (p.problem) sec.push(`<p class="label">${num()} / THE PROBLEM</p>\n<p class="p">${esc(p.problem)}</p>`);
  if (p.built) {
    sec.push(`<p class="label">${num()} / WHAT I BUILT</p>\n<p class="p">${esc(p.built)}</p>`);
    if (p.areas) sec.push(`<div class="areas">${p.areas.map((a) => `<span>${esc(a)}</span>`).join('')}</div>`);
  }
  if (p.how || p.howText) {
    let h = `<p class="label">${num()} / HOW IT WORKS</p>\n`;
    if (p.howText) h += `<p class="p">${esc(p.howText)}</p>`;
    if (p.how) h += `<ol class="steps">${p.how.map((s, i) => `<li><b>${i + 1}</b><span>${esc(s)}</span></li>`).join('')}</ol>`;
    if (p.note) h += `<p class="note">${esc(p.note)}</p>`; else if (p.how) h += '<div style="height:24px"></div>';
    sec.push(h);
  }
  if (p.learned) sec.push(`<p class="label">${num()} / WHAT I LEARNED</p>\n<ul>${p.learned.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`);

  const glance = p.glance ? `<aside class="glance" aria-label="At a glance">
<p class="label">AT A GLANCE</p>
<dl>${p.glance.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
</aside>` : '';

  const actions = (p.actions || [{ text: p.cta.text, href: p.cta.href }, { text: 'All Projects', href: fs.existsSync(path.join(SITE, 'projects', 'index.html')) ? '/projects/' : '/#work', quiet: true }])
    .map((a, i) => `<a class="btn big${i ? ' quiet' : ''}" href="${esc(a.href)}"${ext(a.href)}>${esc(a.text)}</a>`).join('\n');

  const series = p.series ? `<section class="band" id="build" aria-labelledby="build-h">
<p class="label">THE 10-DAY BUILD</p>
<h2 id="build-h">One post a day, ${dayLong(p.series[0].date).replace(/ \d{4}$/, '')} to ${dayLong(p.series[p.series.length - 1].date).replace(/ \d{4}$/, '')}.</h2>
<p class="intro">Each day added one capability, tested it, and wrote down what broke.</p>
<ol class="list days">
${p.series.map((d) => `<li><span class="d">DAY ${d.day}</span><span class="dt">${shortDay(d.date)}</span><span class="t"><span>${esc(d.title)}</span><small>${esc(d.topic)}</small></span><a class="btn quiet" href="https://www.linkedin.com/feed/update/urn:li:activity:${d.id}/" rel="noopener" aria-label="Read day ${d.day} on LinkedIn">Read</a></li>`).join('\n')}
</ol>
</section>` : '';

  const hist = LOG.filter((e) => e.project === p.slug);
  const history = hist.length ? `<section class="band" aria-labelledby="hist-h">
<p class="label">HISTORY &middot; FROM THE SHIPPED LOG</p>
<h2 id="hist-h">How it has changed.</h2>
<ul class="list" style="margin-top:20px">
${hist.map((e) => `<li><p class="when">${day(e.date)} &middot; ${esc(e.tag.toUpperCase())}</p><p class="what">${esc(e.title)}</p></li>`).join('\n')}
</ul>
</section>` : '';

  let rel = '';
  if (p.next) rel = { k: p.next.label, t: p.next.title, s: p.next.text, href: p.next.href };
  else if (p.related) { const r = PROJECTS.find((x) => x.slug === p.related); if (r) rel = { k: 'Related project', t: r.title, s: r.oneLiner, href: r.page ? `/projects/${r.slug}/` : r.cta.href }; }
  const related = rel ? `<a class="related" href="${esc(rel.href)}"${ext(rel.href)}><span><span class="k">${esc(rel.k.toUpperCase())}</span><b>${esc(rel.t)}</b><span class="s">${esc(rel.s)}</span></span><span class="btn quiet">${p.next ? esc(p.next.cta) : 'Open'}</span></a>` : '';

  const desc = p.lead || p.oneLiner;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)} &middot; Radhakrishna Kamaraju</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="article">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230F1B2D'/%3E%3Ctext x='32' y='42' font-family='monospace' font-size='26' font-weight='700' text-anchor='middle' fill='%23F2A33A'%3ERK%3C/text%3E%3C/svg%3E">
${PAGE_CSS}
${chromeCss()}
</head>
<body>
${header('projects')}
<main class="wrap">
<div class="top">
<p class="crumb"><a href="${fs.existsSync(path.join(SITE, 'projects', 'index.html')) ? '/projects/' : '/#work'}">PROJECTS</a> / ${esc(p.title.toUpperCase())}</p>
<div class="chips">${statusChip(p)}${kindChip(p)}<span class="chip quiet">${esc(AUDIENCE[p.audience].toUpperCase())}</span></div>
<h1>${esc(p.title)}</h1>
<p class="lead">${esc(desc)}</p>
<div class="actions">
${actions}
</div>
</div>
<div class="body">
<article class="story">
${sec.join('\n')}
</article>
${glance}
</div>
${series}
${history}
<section class="band" aria-label="Newsletter">
<div class="split">
<div class="text"><p class="label">BUILDWITHRKAI &middot; EVERY TWO WEEKS</p><h2>Liked this? Get the next one.</h2><p>Every two weeks I write about what I built, what broke and what I learned. Free, on LinkedIn.</p></div>
<div class="side"><a class="btn" href="${NEWSLETTER}" rel="noopener">Subscribe Newsletter</a></div>
</div>
</section>
${related}
</main>
${footer()}
</body>
</html>
`;
}

function buildProjectPages() {
  for (const p of PROJECTS.filter((x) => x.page)) {
    const dir = path.join(SITE, 'projects', p.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), projectPage(p));
    console.log(`built projects/${p.slug}/index.html`);
  }
}

// ---- projects index: /projects/ — every project, filterable, newest first ----

function projectsIndex() {
  const latest = (p) => { const e = LOG.find((x) => x.project === p.slug); return e ? e.date : (p.firstLive || ''); };
  const list = PROJECTS.slice().sort((a, b) => (latest(a) < latest(b) ? 1 : latest(a) > latest(b) ? -1 : 0));
  const cards = list.map((p) => {
    const when = p.status === 'building' ? 'IN PROGRESS' : (latest(p) ? day(latest(p)) : '');
    const story = p.story && p.story !== p.cta.href ? `<a class="btn quiet" href="${esc(p.story)}"${ext(p.story)}>How I Built It</a>` : '';
    return `<article class="card" data-aud="${p.audience}" data-kind="${p.kind}" data-status="${p.status}">
<div class="chips">${statusChip(p)}${kindChip(p)}</div>
<h2>${esc(p.title)}</h2>
<p class="txt">${esc(p.oneLiner)}</p>
<p class="meta">${esc(AUDIENCE[p.audience].toUpperCase())} &middot; ${when}</p>
<div class="btns"><a class="btn" href="${esc(p.cta.href)}"${ext(p.cta.href)}>${esc(p.cta.text)}</a>${story}</div>
</article>`;
  }).join('\n');
  const group = (key, label, opts) => `<div class="frow" role="group" aria-label="Filter by ${label.toLowerCase()}">
<span class="flabel">${label.toUpperCase()}</span>
${opts.map(([v, t], i) => `<button type="button" data-key="${key}" data-val="${v}" aria-pressed="${i === 0}">${t}</button>`).join('\n')}
</div>`;
  const live = PROJECTS.filter((p) => p.status === 'live').length;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Projects &middot; Radhakrishna Kamaraju</title>
<meta name="description" content="Everything RK has built with AI: ${PROJECTS.length} projects, ${live} live to try, each with how it was built and what was learned.">
<meta property="og:title" content="Projects by Radhakrishna Kamaraju">
<meta property="og:description" content="Everything I've built with AI, newest first.">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230F1B2D'/%3E%3Ctext x='32' y='42' font-family='monospace' font-size='26' font-weight='700' text-anchor='middle' fill='%23F2A33A'%3ERK%3C/text%3E%3C/svg%3E">
${PAGE_CSS}
<style>
.filters{display:flex;flex-direction:column;gap:14px;padding:8px 0 8px}
.frow{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.flabel{font-family:var(--mono);font-size:12px;letter-spacing:.1em;color:var(--muted);width:96px}
.frow button{font:inherit;font-size:15px;cursor:pointer;min-height:44px;padding:9px 16px;border-radius:999px;background:none;color:var(--text);border:1px solid var(--line)}
.frow button:hover{border-color:var(--muted)}
.frow button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--bg);font-weight:600}
.count{font-family:var(--mono);font-size:13px;color:var(--muted);margin-top:6px}
html:not(.js) .filters{display:none}
.grid{display:flex;flex-wrap:wrap;gap:20px;padding:16px 0 56px}
.card{flex:1 1 320px;min-width:0;background:var(--card);border:1px solid var(--line);border-radius:24px;padding:28px 24px;display:flex;flex-direction:column;gap:12px}
.card[hidden]{display:none}
.card .chips{margin:0}
.card h2{font-size:26px;font-weight:600;margin-top:4px}
.card .txt{font-size:16px;line-height:1.55;color:var(--body);flex-grow:1}
.card .meta{font-family:var(--mono);font-size:12px;color:var(--muted)}
.card .btns{display:flex;flex-wrap:wrap;gap:10px}
.card .btn{padding:12px 14px;font-size:14px}
.empty{background:var(--card);border:1px solid var(--line);border-radius:24px;padding:40px 28px;text-align:center;margin-bottom:56px}
.empty p{font-size:18px;color:var(--body);margin-bottom:16px}
.empty button{font:inherit;cursor:pointer}
</style>
<script>document.documentElement.className="js"</script>
${chromeCss()}
</head>
<body>
${header('projects')}
<main class="wrap">
<div class="top">
<p class="label" style="color:var(--accent)">PROJECTS</p>
<h1>Everything I've built.</h1>
<p class="lead">Most of these are live, so you can try them. Each one has a page on how I built it and what I learned. Newest first.</p>
</div>
<div class="filters" aria-label="Filters">
${group('aud', 'For', [['all', 'All'], ['mfg', 'AI in Manufacturing'], ['build', 'Build with AI'], ['learn', 'Learn about AI']])}
${group('kind', 'Kind', [['all', 'All'], ['tool', 'Tools'], ['demo', 'Demos'], ['story', 'Build Stories']])}
${group('status', 'Status', [['all', 'All'], ['live', 'Live'], ['building', 'Building']])}
<p class="count" aria-live="polite" id="count">SHOWING ${PROJECTS.length} OF ${PROJECTS.length}</p>
</div>
<div class="grid" id="grid">
${cards}
</div>
<div class="empty" id="empty" hidden>
<p>No projects match these filters yet.</p>
<button type="button" class="btn quiet" id="clear">Clear Filters</button>
</div>
<section class="band" aria-label="Newsletter">
<div class="split">
<div class="text"><p class="label">BUILDWITHRKAI &middot; EVERY TWO WEEKS</p><h2>Follow what I build next.</h2><p>Every two weeks I write about what I built, what broke and what I learned. Free, on LinkedIn.</p></div>
<div class="side"><a class="btn" href="${NEWSLETTER}" rel="noopener">Subscribe Newsletter</a></div>
</div>
</section>
</main>
${footer()}
<script>
// Filters. Without JavaScript the filters are hidden and every project shows.
(function(){
  var f={aud:"all",kind:"all",status:"all"};
  var cards=[].slice.call(document.querySelectorAll("#grid .card")),btns=[].slice.call(document.querySelectorAll(".frow button"));
  function apply(){
    var n=0;
    cards.forEach(function(c){
      var ok=(f.aud==="all"||c.dataset.aud===f.aud)&&(f.kind==="all"||c.dataset.kind===f.kind)&&(f.status==="all"||c.dataset.status===f.status);
      c.hidden=!ok;if(ok)n++;
    });
    btns.forEach(function(b){b.setAttribute("aria-pressed",String(f[b.dataset.key]===b.dataset.val))});
    document.getElementById("count").textContent="SHOWING "+n+" OF "+cards.length;
    document.getElementById("empty").hidden=n>0;
  }
  btns.forEach(function(b){b.addEventListener("click",function(){f[b.dataset.key]=b.dataset.val;apply()})});
  document.getElementById("clear").addEventListener("click",function(){f={aud:"all",kind:"all",status:"all"};apply()});
})();
</script>
</body>
</html>
`;
}

function buildProjectsIndex() {
  fs.mkdirSync(path.join(SITE, 'projects'), { recursive: true });
  fs.writeFileSync(path.join(SITE, 'projects', 'index.html'), projectsIndex());
  console.log('built projects/index.html');
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

// The index first: other pages link to /projects/ only once it exists.
buildProjectsIndex();
buildProjectPages();
fill('index.html', {
  ...chrome('home'), stats, start: startHere, featured, more: moreProjects, allprojects: allProjectsButton, shipped: recentlyShipped,
});
fill('about/index.html', chrome('about'));
fill('shipped/index.html', chrome('shipped'));
fill('upskill/index.html', chrome('learn'));
fill('factory/index.html', chrome('projects'));
fill('agents/index.html', chrome('projects'));
fill('projects/clawdia/architecture/index.html', chrome('projects'));
