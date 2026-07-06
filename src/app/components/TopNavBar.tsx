"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoSrc from "public/logo.svg";
import { cx } from "lib/cx";
import { ThemeToggle } from "components/ThemeToggle";

const HOME_ANCHORS = [
  ["#features", "Features"],
  ["#ats", "ATS Score"],
  ["#templates", "Templates"],
  ["#pricing", "Pricing"],
  ["#faq", "FAQ"],
];

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";
  const isAppRoute = ["/resume-builder", "/resume-parser", "/resume-import", "/dashboard"].includes(pathName);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHomePage) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomePage]);

  if (isAppRoute) {
    return null;
  }

  return (
    <header
      aria-label="Site Header"
      className={cx(
        "lp sticky top-0 z-50 flex h-[var(--top-nav-bar-height)] items-center px-4 transition-[background-color,box-shadow,border-color] duration-300 lg:px-8",
        isHomePage
          ? scrolled
            ? "border-b border-border bg-background/80 shadow-e1 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
            : "border-b border-transparent bg-transparent"
          : "border-b border-border bg-background"
      )}
    >
      <div className="mx-auto flex h-10 w-full max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center rounded-lg">
          <span className="sr-only">ResumeFlow — home</span>
          <Image src={logoSrc} alt="" className="h-8 w-auto dark:invert" priority />
        </Link>

        {isHomePage && (
          <nav aria-label="Page sections" className="hidden items-center gap-1 md:flex">
            {HOME_ANCHORS.map(([href, text]) => (
              <a
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {text}
              </a>
            ))}
          </nav>
        )}

        <nav aria-label="Primary" className="flex items-center gap-1.5 text-sm font-medium">
          {!isHomePage &&
            [
              ["/resume-builder", "Builder"],
              ["/resume-parser", "Parser"],
            ].map(([href, text]) => (
              <Link
                key={text}
                className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                href={href}
              >
                {text}
              </Link>
            ))}
          <ThemeToggle />
          {isHomePage && (
            <Link
              href="/resume-import"
              className="ml-1.5 hidden items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-e1 transition-all hover:opacity-90 sm:inline-flex"
            >
              Build resume
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
