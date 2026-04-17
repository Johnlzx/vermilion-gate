"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavigationItem } from "@/lib/site-content";

function isActive(pathname: string, matchers: string[]) {
  return matchers.some((matcher) => pathname === matcher);
}

type SectionNavProps = {
  items: NavigationItem[];
};

export function SectionNav({ items }: SectionNavProps) {
  const pathname = usePathname();

  return (
    <nav className="section-nav" aria-label="Section">
      {items.map((item) => (
        <Link
          key={item.href}
          className={`section-nav__link${
            isActive(pathname, item.match) ? " is-active" : ""
          }`}
          href={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
