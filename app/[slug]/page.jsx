import { notFound } from 'next/navigation';
import { getAllSlugs, getPostBySlug } from '@/lib/posts';
import { formatDateWithRelativeTime, readingTimeLabel } from '@/lib/format';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollTopButton from '@/components/ScrollTopButton';
import TableOfContents from '@/components/TableOfContents';
import CodeBlocks from '@/components/CodeBlocks';
import { site } from '@/lib/site';
import { Clock3, PencilLine } from 'lucide-react';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  try {
    const post = await getPostBySlug(params.slug);
    const image = post.image || '/opengraph-image.png';
    const url = `${site.url}/${post.slug}`;

    return {
      title: { absolute: post.title },
      description: post.excerpt,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        url,
        type: 'article',
        publishedTime: post.date || undefined,
        authors: [site.owner],
        images: [{
          url: image,
          alt: post.title,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        creator: site.twitterHandle,
        images: [image],
      },
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
          {post.date && <time dateTime={post.date}><PencilLine size={12} /> {formatDateWithRelativeTime(post.date)}</time>}
          <span><Clock3 size={12} style={{ marginTop: "-2px" }} /> {readingTimeLabel(post.readingMinutes)}</span>
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

        <TableOfContents items={post.tableOfContents} />

        <article className="prose">
          <CodeBlocks html={post.contentHtml} />
        </article>
      </main>

      <Footer />
      <ScrollTopButton />
    </div>
  );
}