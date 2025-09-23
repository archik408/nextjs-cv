#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('node:fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('node:path');

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function run() {
  const rawTitle = process.argv.slice(2).join(' ').trim();
  if (!rawTitle) {
    console.error('Usage: npm run garden:new "Заголовок заметки"');
    process.exit(1);
  }
  const slug = slugify(rawTitle);
  const gardenDir = path.join(process.cwd(), 'content', 'garden');
  if (!fs.existsSync(gardenDir)) fs.mkdirSync(gardenDir, { recursive: true });
  const filePath = path.join(gardenDir, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  }
  const today = new Date().toISOString().slice(0, 10);
  const tpl =
    `---\n` +
    `title: ${rawTitle}\n` +
    `description: \n` +
    `date: ${today}\n` +
    `tags: []\n` +
    `---\n\n` +
    `Напишите заметку здесь...\n`;
  fs.writeFileSync(filePath, tpl, 'utf8');
  console.log(`Created: ${filePath}`);
}

run();
