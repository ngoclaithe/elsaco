/**
 * Scrape products + collections from auto-colt-pistol.com (Shopify JSON API)
 * Usage: node scripts/scrape-acp.js
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://auto-colt-pistol.com';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.json();
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function firstLine(html) {
  const text = stripHtml(html);
  const line = text.split('\n').find((l) => l.trim()) || '';
  return line.replace(/^BOXY FIT|^BAGGY FIT|^Material:/i, (m) => m).trim();
}

function categorize(title) {
  const t = title.toUpperCase();
  if (
    t.includes('T-SHIRT') ||
    t.includes('TEE') ||
    t.includes('TOP') ||
    t.includes('SHIRT')
  )
    return 'tops';
  if (
    t.includes('JEANS') ||
    t.includes('CAPRI') ||
    t.includes('PANTS') ||
    t.includes('BOTTOM')
  )
    return 'bottoms';
  return 'accessories';
}

function toElSacoName(title) {
  return title
    .replace(/\bACP\b/g, 'elSaco')
    .replace(/\bPISTOL\b/g, 'elSaco')
    .replace(/\bAUTO-COLT-PISTOL\b/g, 'elSaco');
}

function toElSacoSlug(handle) {
  return handle.replace(/^acp-/, 'elsaco-').replace(/^pistol-/, 'elsaco-');
}

async function main() {
  console.log('Fetching collections...');
  const { collections } = await fetchJson(`${BASE}/collections.json?limit=50`);

  console.log('Fetching all products...');
  const { products } = await fetchJson(`${BASE}/collections/all/products.json?limit=250`);

  const collectionMap = collections.map((c) => ({
    name: c.title,
    slug: c.handle,
    image: c.image?.src || null,
  }));

  // Ensure standard collections exist
  const categorySlugs = ['tops', 'bottoms', 'accessories'];
  for (const slug of categorySlugs) {
    if (!collectionMap.find((c) => c.slug === slug)) {
      collectionMap.push({
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug,
        image: null,
      });
    }
  }

  const mappedProducts = products.map((p) => {
    const variant = p.variants[0];
    const price = parseInt(variant.price, 10);
    const comparePrice = variant.compare_at_price
      ? parseInt(variant.compare_at_price, 10)
      : null;
    const sizes = [
      ...new Set(
        p.options
          .find((o) => o.name === 'Size')
          ?.values.filter((v) => v !== 'Default Title') || [],
      ),
    ];
    const finalSizes =
      sizes.length > 0
        ? sizes
        : p.options[0]?.values[0] === 'Default Title'
          ? ['ONE SIZE']
          : p.options[0]?.values || ['ONE SIZE'];

    const stock = p.variants.reduce(
      (sum, v) => sum + (v.available ? 5 : 0),
      0,
    );

    const images = p.images.map((img) => {
      // Use width=800 for reasonable size
      const url = img.src.split('?')[0];
      return `${url}?width=800`;
    });

    const categorySlug = categorize(p.title);

    return {
      name: toElSacoName(p.title),
      slug: toElSacoSlug(p.handle),
      originalHandle: p.handle,
      description: firstLine(p.body_html) || 'elSaco',
      details: stripHtml(p.body_html),
      price,
      comparePrice: comparePrice && comparePrice > price ? comparePrice : null,
      images,
      sizes: finalSizes,
      stock: stock || 10,
      featured: [
        'acp-a-chaotic-presence-white-boxy-t-shirt',
        'acp-chatgpt-black-washed-boxy-t-shirt-copy',
        'acp-basic-logo-black-boxy-t-shirt-copy',
        'acp-cyclone-white-boxy-t-shirt-copy',
      ].includes(p.handle),
      categorySlug,
    };
  });

  const outDir = path.join(__dirname, '..', 'backend', 'prisma');
  const data = { collections: collectionMap, products: mappedProducts };

  fs.writeFileSync(
    path.join(outDir, 'acp-data.json'),
    JSON.stringify(data, null, 2),
  );

  console.log(`Saved ${mappedProducts.length} products, ${collectionMap.length} collections`);
  console.log('Collections:', collectionMap.map((c) => c.slug).join(', '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
