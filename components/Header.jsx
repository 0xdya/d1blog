import Link from 'next/link';
import Image from 'next/image';
import { site } from '@/lib/site';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header({ backHref }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <ThemeToggle />
        <div className="site-header-start">
          {/* <Link href="/" className="site-name">
            {site.title}
          </Link> */}
          <Link href="/" className="site-logo" aria-label={`${site.title} home`}>
            {/* <Image src="/logo.png" draggable={false} alt="" width={40} height={40} priority onContextMenu={(e) => e.preventDefault()} /> */}
          </Link>
        </div>
      </div>
    </header>
  );
}
