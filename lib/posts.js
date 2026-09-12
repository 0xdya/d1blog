import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function getHeadingText(node) {
  if (!node) return '';
  if (node.type === 'text' || node.type === 'inlineCode') return node.value || '';
  return (node.children || []).map(getHeadingText).join('');
}

function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/[\s-]+/g, '-') || 'section';
}

function withHeadingIds() {
  return (tree) => {
    const usedIds = new Set();

    for (const node of tree.children || []) {
      if (node.type !== 'heading') continue;

      const text = getHeadingText(node);
      const baseId = slugifyHeading(text);
      let id = baseId;
      let suffix = 2;
      while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
      usedIds.add(id);

      node.data = {
        ...node.data,
        hProperties: { ...node.data?.hProperties, id },
      };
    }
  };
}

function getTableOfContents(content) {
  const headings = [];
  const usedIds = new Set();
  const headingPattern = /^(#{1,6})\s+(.+?)\s*#*\s*$/gm;
  let match;

  while ((match = headingPattern.exec(content))) {
    const text = match[2].trim();
    const baseId = slugifyHeading(text);
    let id = baseId;
    let suffix = 2;
    while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
    usedIds.add(id);
    headings.push({ level: match[1].length, text, id });
  }

  const roots = [];
  const parents = [];
  for (const heading of headings) {
    const item = { ...heading, children: [] };
    while (parents.length && parents[parents.length - 1].level >= item.level) {
      parents.pop();
    }
    if (parents.length) parents[parents.length - 1].children.push(item);
    else roots.push(item);
    parents.push(item);
  }

  return roots;
}

function readMarkdownFiles() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith('.md'));
}

function estimateReadingMinutes(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

function buildExcerpt(data, content) {
  if (data.excerpt) return data.excerpt;
  const plain = content
    .replace(/^#.+$/m, '')
    .replace(/[#*_`>[\]()]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  return plain.length > 160 ? `${plain.slice(0, 160)}…` : plain;
}

export function getAllSlugs() {
  return readMarkdownFiles().map((file) => file.replace(/\.md$/, ''));
}

export function getAllPosts() {
  const posts = readMarkdownFiles().map((file) => {
    const slug = file.replace(/\.md$/, '');
    const fullPath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title || slug,
      date: data.date || null,
      excerpt: buildExcerpt(data, content),
      tags: data.tags || [],
      readingMinutes: estimateReadingMinutes(content),
    };
  });

  return posts.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });
}

export async function getPostBySlug(slug) {
  const fullPath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`لا يوجد ملف بالاسم: ${slug}.md`);
  }

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  const processed = await remark()
    .use(remarkGfm)
    .use(withHeadingIds)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    slug,
    title: data.title || slug,
    date: data.date || null,
    excerpt: buildExcerpt(data, content),
    tags: data.tags || [],
    readingMinutes: estimateReadingMinutes(content),
    tableOfContents: getTableOfContents(content),
    contentHtml: processed.toString(),
  };
}
