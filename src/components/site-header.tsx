"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { primaryNavigation } from "@/lib/site-content";

function isActive(pathname: string, matchers: string[]) {
  return matchers.some((matcher) => {
    if (matcher === "/") {
      return pathname === "/";
    }

    return pathname === matcher || pathname.startsWith(`${matcher}/`);
  });
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [closedItem, setClosedItem] = useState<string | null>(null);
  const isHome = pathname === "/";
  const showFilledHeader = !isHome || isScrolled || menuOpen;

  function handleNavLinkClick(itemHref: string) {
    setMenuOpen(false);
    setClosedItem(itemHref);
  }

  useEffect(() => {
    if (!isHome) {
      return;
    }

    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  return (
    <header
      className={`site-header${isHome ? " site-header--home" : ""}${
        showFilledHeader ? " site-header--scrolled" : ""
      }${menuOpen ? " site-header--open" : ""}`}
    >
      <div className="container site-header__inner">
        <Link
          className="brand-logo"
          href="/"
          onClick={() => setMenuOpen(false)}
          aria-label="Vermilion Gate home"
        >
          <Image
            src="/assets/vermilion-gate-logo.svg"
            alt="Vermilion Gate"
            width={728}
            height={111}
            priority={isHome}
          />
        </Link>

        <button
          className={`menu-toggle${menuOpen ? " menu-toggle--open" : ""}`}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className="menu-toggle__bar" aria-hidden="true" />
          <span className="menu-toggle__bar" aria-hidden="true" />
          <span className="menu-toggle__bar" aria-hidden="true" />
        </button>

        <nav
          id="primary-navigation"
          className={`site-nav${menuOpen ? " site-nav--open" : ""}`}
          aria-label="Primary"
        >
          {primaryNavigation.map((item) => (
            <div
              key={item.href}
              className={`site-nav__item${item.children ? " has-children" : ""}${
                closedItem === item.href ? " is-force-closed" : ""
              }`}
              onMouseLeave={() => setClosedItem((current) => (current === item.href ? null : current))}
            >
              <Link
                className={`site-nav__link${
                  isActive(pathname, item.match) ? " is-active" : ""
                }`}
                href={item.href}
                onClick={() => handleNavLinkClick(item.href)}
              >
                {item.label}
              </Link>

              {item.children ? (
                <div className="site-nav__dropdown" role="menu" aria-label={item.label}>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      className="site-nav__dropdown-link"
                      href={child.href}
                      onClick={() => handleNavLinkClick(item.href)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
