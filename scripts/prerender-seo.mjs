import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteUrl = 'https://www.ergashev.life';
const outputDir = new URL('../dist/', import.meta.url);
const outputPath = fileURLToPath(outputDir);
const template = await readFile(new URL('index.html', outputDir), 'utf8');

const pages = [
  {
    path: '/projects',
    file: 'projects.html',
    title: 'Chatly Project — Abdurashid Ergashev',
    description: 'Explore Chatly, a SaaS automation product built by Abdurashid Ergashev with React, Node.js, MongoDB and Instagram integrations.',
  },
  {
    path: '/about',
    file: 'about.html',
    title: 'About Abdurashid Ergashev — Fullstack TypeScript Developer',
    description: 'Meet Abdurashid Ergashev, a fullstack TypeScript developer from Uzbekistan working with React, Next.js, NestJS, Node.js, PostgreSQL and MongoDB.',
  },
  {
    path: '/blog',
    file: 'blog.html',
    title: 'Engineering Journal — Abdurashid Ergashev',
    description: 'Engineering notes by Abdurashid Ergashev about TypeScript, fullstack development, product decisions, automation and lessons from building Chatly.',
  },
];

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

for (const page of pages) {
  const canonical = `${siteUrl}${page.path}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: page.title,
    description: page.description,
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#person` },
    inLanguage: 'en',
  };

  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(page.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`);

  await writeFile(new URL(page.file, outputDir), html);
  const nestedPath = join(outputPath, page.path.slice(1), 'index.html');
  await mkdir(dirname(nestedPath), { recursive: true });
  await writeFile(nestedPath, html);
}

console.log(`Generated ${pages.length} search-ready route documents.`);
