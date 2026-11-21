// Search and AI discovery, generated on every deploy so nothing drifts:
//   - sitemap.xml   every page on the site, with a last-changed date where the Shipped log knows one
//   - llms.txt      a short Markdown guide to the site for AI assistants (llmstxt.org)
//   - <head> tags   canonical URL and Open Graph tags on every page; Person and WebSite
//                   structured data (JSON-LD) on the homepage
//
// Runs in the Docker build after build-pages.js, on the same copy of site/.
// Usage: node scripts/build-seo.js [siteDir]
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SITE = path.resolve(process.argv[2] || path.join(__dirname, '..', 'site'));
const BASE = 'https://radhakrishnakamaraju.com';

// ---- who RK is: the single definition used by the structured data and llms.txt ----
const PERSON = {
  name: 'Radhakrishna Kamaraju',
  alternateName: ['RK', 'Radha Krishna Kamaraju'],
  jobTitle: 'Digital transformation and AI delivery leader',
  description: 'Digital transformation and AI delivery leader with about twenty years in automotive IT. Builds AI agents himself and shares what he learns.',
  email: 'hello@radhakrishnakamaraju.com',
  sameAs: [
    'https://www.linkedin.com/in/radhakrishna-kamaraju/',
    'https://github.com/radhakrishna-kamaraju',
    'https://x.com/buildwithrkai',
  ],
  knowsAbout: ['AI agents', 'Agentic AI', 'Multi-agent systems', 'Industrial AI', 'AI in manufacturing',
    'Digital transformation', 'Programme delivery', 'Automotive IT', 'AI upskilling'],
};
const NEWSLETTER = 'https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7528134916136607746';

function load(file, name) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(SITE, file), 'utf8'), sandbox);
  return sandbox.window[name];
}
const PROJECTS = load('projects/data.js', 'PROJECTS');
const SHIPPED = load('shipped/data.js', 'SHIPPED');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unesc = (s) => String(s).replace(/&middot;/g, '·').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const abs = (href) => (/^https?:/.test(href) ? href : BASE + href);

// ---- every page: one index.html per folder ----
function pages(dir = SITE, rel = '/') {
  const out = [];
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    if (d.isDirectory() && d.name !== 'fonts') out.push(...pages(path.join(dir, d.name), `${rel}${d.name}/`));
    else if (d.name === 'index.html') out.push({ url: rel, file: path.join(dir, d.name) });
  }
  return out.sort((a, b) => (a.url === '/' ? -1 : b.url === '/' ? 1 : a.url.localeCompare(b.url)));
}

// ---- last-changed dates from the Shipped log ----
const latest = (entries) => entries.map((e) => e.date).sort().pop();
function lastmod(url) {
  if (url === '/' || url === '/shipped/' || url === '/projects/') return latest(SHIPPED);
  const p = PROJECTS.find((x) => url === `/projects/${x.slug}/` || url === x.cta.href || url.startsWith(`/projects/${x.slug}/`));
  return p ? latest(SHIPPED.filter((e) => e.project === p.slug)) : undefined;
}

// ---- <head> tags ----
const has = (html, re) => re.test(html);
function headTags(html, url) {
  const title = unesc((html.match(/<title>([^<]*)<\/title>/) || [])[1] || PERSON.name);
  const desc = unesc((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  const tags = [];
  if (!has(html, /rel="canonical"/)) tags.push(`<link rel="canonical" href="${BASE}${url}">`);
  if (!has(html, /property="og:url"/)) tags.push(`<meta property="og:url" content="${BASE}${url}">`);
  if (!has(html, /property="og:site_name"/)) tags.push(`<meta property="og:site_name" content="${PERSON.name}">`);
  if (!has(html, /property="og:title"/)) tags.push(`<meta property="og:title" content="${esc(title.replace(/ [·|] Radhakrishna Kamaraju$/, ''))}">`);
  if (desc && !has(html, /property="og:description"/)) tags.push(`<meta property="og:description" content="${esc(desc)}">`);
  if (!has(html, /property="og:type"/)) tags.push('<meta property="og:type" content="website">');
  if (!has(html, /name="twitter:card"/)) tags.push('<meta name="twitter:card" content="summary">', '<meta name="twitter:site" content="@buildwithrkai">');
  if (url === '/' && !has(html, /application\/ld\+json/)) tags.push(jsonLd());
  return tags;
}

function jsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${BASE}/#person`,
        name: PERSON.name,
        alternateName: PERSON.alternateName,
        url: `${BASE}/`,
        email: `mailto:${PERSON.email}`,
        jobTitle: PERSON.jobTitle,
        description: PERSON.description,
        knowsAbout: PERSON.knowsAbout,
        sameAs: PERSON.sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        url: `${BASE}/`,
        name: PERSON.name,
        description: PERSON.description,
        inLanguage: 'en',
        author: { '@id': `${BASE}/#person` },
        publisher: { '@id': `${BASE}/#person` },
      },
    ],
  };
  // "<" is escaped so the JSON can never close the script tag early.
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2).replace(/</g, '\\u003c')}\n</script>`;
}

// ---- sitemap.xml ----
function sitemap(list) {
  const urls = list.map(({ url }) => {
    const m = lastmod(url);
    return `  <url>\n    <loc>${BASE}${url}</loc>${m ? `\n    <lastmod>${m}</lastmod>` : ''}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

// ---- llms.txt ----
function llms() {
  const live = PROJECTS.filter((p) => p.status === 'live');
  const building = PROJECTS.filter((p) => p.status !== 'live');
  const projectLine = (p) => {
    const page = p.page ? `${BASE}/projects/${p.slug}/` : abs(p.cta.href);
    const tryIt = p.page && p.cta.href !== `/projects/${p.slug}/` ? ` Try it: ${abs(p.cta.href)}` : '';
    return `- [${p.title}](${page}): ${p.oneLiner}${tryIt}`;
  };
  const wrote = SHIPPED.filter((e) => e.tag === 'Wrote' && e.link).sort((a, b) => (a.date < b.date ? 1 : -1));
  return [
    `# ${PERSON.name}`,
    '',
    `> ${PERSON.description} Most projects on this site are live and free to try.`,
    '',
    `RK (${PERSON.name}) spent two decades in automotive IT, most recently leading delivery and digital transformation programmes, and moved into AI for manufacturing in 2025. He now builds AI agents himself, in the open, and writes about what works and what breaks. Focus areas: ${PERSON.knowsAbout.join(', ')}.`,
    '',
    '## Projects',
    '',
    ...live.map(projectLine),
    '',
    '## Newsletter',
    '',
    `- [buildwithRKAI newsletter](${NEWSLETTER}): every two weeks, what RK built, what broke and what he learned (on LinkedIn).`,
    '',
    '## Writing',
    '',
    ...wrote.map((e) => `- [${e.title}](${e.link}): ${e.text}`),
    '',
    '## About',
    '',
    `- [About](${BASE}/about/): RK's path from automotive IT delivery to building AI agents.`,
    `- [Shipped log](${BASE}/shipped/): a dated log of everything shipped, improved, fixed and written, newest first.`,
    `- [All projects](${BASE}/projects/): every project, with how it was built.`,
    `- [Résumé (PDF)](${BASE}/Radhakrishna-Kamaraju-Resume.pdf)`,
    '',
    '## Elsewhere',
    '',
    `- [LinkedIn](${PERSON.sameAs[0]})`,
    `- [GitHub](${PERSON.sameAs[1]}): source code for this site and its projects.`,
    `- [X](${PERSON.sameAs[2]}): @buildwithrkai`,
    `- Email: ${PERSON.email}`,
    '',
    '## Optional',
    '',
    `- [Full site notes](${BASE}/knowledge-site.md): every page and tool in more detail, the same notes the site's own "Ask this site" assistant reads.`,
    ...(building.length ? building.map((p) => `- ${p.title} (in progress): ${p.oneLiner}`) : []),
    '',
  ].join('\n');
}

// ---- apply ----
const list = pages();
for (const { url, file } of list) {
  const html = fs.readFileSync(file, 'utf8');
  const tags = headTags(html, url);
  if (!tags.length) continue;
  if (!html.includes('</head>')) throw new Error(`${file}: no </head>`);
  fs.writeFileSync(file, html.replace('</head>', `${tags.join('\n')}\n</head>`));
}
fs.writeFileSync(path.join(SITE, 'sitemap.xml'), sitemap(list));
fs.writeFileSync(path.join(SITE, 'llms.txt'), llms());
console.log(`seo: head tags on ${list.length} pages, sitemap.xml (${list.length} URLs), llms.txt`);
