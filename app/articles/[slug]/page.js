import { notFound } from 'next/navigation';
import { getAllSlugs, getPostBySlug } from '@/lib/posts';
import { formatDate, readingTimeLabel } from '@/lib/format';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollTopButton from '@/components/ScrollTopButton';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  try {
    const post = await getPostBySlug(params.slug);
    return {
      title: post.title,
      description: post.excerpt,
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }) {
  let post;
  try {
    post = await getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="page">
      <Header backHref="/" />

      <main className="container article">
        <h1 className="article-title">{post.title}</h1>

        <div className="post-meta">
          {post.date && <time dateTime={post.date}>{formatDate(post.date)}</time>}
          <span className="dot" aria-hidden="true" />
          <span>{readingTimeLabel(post.readingMinutes)}</span>
        </div>

        {post.tags.length > 0 && (
          <div className="tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <article className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </main>

      <Footer />
      <ScrollTopButton />
    </div>
  );
}
