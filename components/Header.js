import Link from 'next/link';
import { site } from '@/lib/site';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header({ backHref }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-header-start">
          <Link href="/" className="site-name">
            {site.title}
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
