import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { formatDateWithRelativeTime, readingTimeLabel } from '@/lib/format';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { site } from '@/lib/site';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="page">
      <Header />

      <main className="container">
        <p className="site-intro">{site.description}</p>

        {posts.length === 0 ? (
          <p className="empty">
            لا توجد مقالات بعد.
          </p>
        ) : (
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.slug} className="post-item">
                <Link href={`/${post.slug}`} className="post-link">
                  <h2 className="post-title">{post.title}</h2>
                  {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
                  <div className="post-meta">
                    <span>{readingTimeLabel(post.readingMinutes)}</span>
                    {post.date && (
                      <>
                        <time dateTime={post.date}>{formatDateWithRelativeTime(post.date)}</time>
                      </>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
}
