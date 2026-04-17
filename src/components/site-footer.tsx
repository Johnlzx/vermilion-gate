import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__copy">
          © 2026 Vermilion Gate Pte Ltd. All Rights Reserved.
        </p>

        <nav className="site-footer__nav" aria-label="Footer">
          <Link href="/contact-us/our-office">Contact Us</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
          <Link href="/sitemap.xml">Site Map</Link>
        </nav>
      </div>
    </footer>
  );
}
