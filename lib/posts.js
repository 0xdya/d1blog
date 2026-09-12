import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const CONTENT_DIR = path.join(process.cwd(), 'content');

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
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    slug,
    title: data.title || slug,
    date: data.date || null,
    excerpt: buildExcerpt(data, content),
    tags: data.tags || [],
    readingMinutes: estimateReadingMinutes(content),
    contentHtml: processed.toString(),
  };
}
