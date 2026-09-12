import Link from 'next/link';

export default function BackButton({ href }) {
  return (
    <Link href={href} className="icon-button" aria-label="العودة إلى المقالات">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
