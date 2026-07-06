import React from "react";
import { cx } from "lib/cx";
import { Reveal } from "home/Reveal";

/**
 * Section shell — enforces one consistent container width, horizontal
 * padding, and vertical rhythm across the entire landing page.
 */
export const Section = ({
  id,
  children,
  className,
  container = true,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  container?: boolean;
}) => (
  <section id={id} className={cx("relative py-16 sm:py-20 lg:py-24 scroll-mt-16", className)}>
    {container ? (
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    ) : (
      children
    )}
  </section>
);

/** Consistent section header: kicker chip, title, one-line subtitle. */
export const SectionHeader = ({
  kicker,
  title,
  subtitle,
  align = "center",
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
}) => (
  <Reveal
    className={cx(
      "mb-12 lg:mb-16 max-w-2xl",
      align === "center" ? "mx-auto text-center" : "text-left"
    )}
  >
    {kicker && (
      <span className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        {kicker}
      </span>
    )}
    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
    )}
  </Reveal>
);
