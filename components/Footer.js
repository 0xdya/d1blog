import { site } from '@/lib/site';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>صنع من طرف: <br></br> <Link href="https://0xdya.vercel.app/" className="site-footer-inner">ضياء الدين ملوك -  {site.owner}@</Link></div>
    </footer>
  );
}
