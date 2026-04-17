import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-page">
      <div className="container not-found-panel">
        <p className="section-kicker">Page not found</p>
        <h1 className="classic-title classic-title--narrow">
          The page you asked for is not in this build.
        </h1>
        <p className="classic-copy">
          The refreshed site removes several legacy CMS sections. Use one of the
          links below to continue.
        </p>
        <div className="hero-button-row">
          <Link className="outline-button outline-button--dark" href="/">
            Go to home
          </Link>
          <Link className="outline-button outline-button--dark" href="/contact-us/our-office">
            Open contact page
          </Link>
        </div>
      </div>
    </main>
  );
}
