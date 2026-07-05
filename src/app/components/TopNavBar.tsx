"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoSrc from "public/logo.svg";
import { cx } from "lib/cx";
import { ThemeToggle } from "components/ThemeToggle";

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";
  const isAppRoute = ["/resume-builder", "/resume-parser", "/resume-import", "/dashboard"].includes(pathName);

  if (isAppRoute) {
    return null;
  }

  return (
    <header
      aria-label="Site Header"
      className={cx(
        "flex h-[var(--top-nav-bar-height)] items-center border-b border-border bg-background text-foreground px-3 lg:px-12",
        isHomePage && "bg-dot"
      )}
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/">
          <span className="sr-only">ResumeFlow</span>
          <Image
            src={logoSrc}
            alt="ResumeFlow Logo"
            className="h-8 w-full dark:invert"
            priority
          />
        </Link>
        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-2 text-sm font-medium"
        >
          {[
            ["/resume-builder", "Builder"],
            ["/resume-parser", "Parser"],
          ].map(([href, text]) => (
            <Link
              key={text}
              className="rounded-md px-1.5 py-2 text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-850 dark:hover:bg-zinc-800 lg:px-4"
              href={href}
            >
              {text}
            </Link>
          ))}
          <ThemeToggle />

        </nav>
      </div>
    </header>
  );
};
