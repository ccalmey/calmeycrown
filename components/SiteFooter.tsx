import Link from "next/link";
import { SITE_NAVIGATION } from "@/lib/site-navigation";

export default function SiteFooter() {
  return (
    <footer className="site-footer shared-site-footer">
      <Link className="footer-brand" href="/#home" aria-label="Calmey Crown home">
        <svg viewBox="0 0 48 40" fill="none" aria-hidden="true">
          <path d="M5 10L15 22L24 3L33 22L43 10L38 34H10L5 10Z" />
          <path d="M10 37H38" />
        </svg>
        <span>CALMEY CROWN</span>
      </Link>

      <p className="footer-signature">
        <span>Space</span><span aria-hidden="true">•</span>
        <span>Cybersecurity</span><span aria-hidden="true">•</span>
        <span>STEM</span>
      </p>

      <nav className="footer-nav" aria-label="Footer navigation">
        {SITE_NAVIGATION.map((item) => (
          <Link href={item.href} key={item.id}>{item.label}</Link>
        ))}
      </nav>

      <p className="footer-copyright">© 2026 Calmey Crown. All Rights Reserved.</p>
    </footer>
  );
}
