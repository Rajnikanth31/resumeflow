"use client";
import React, { useEffect, useRef } from "react";

/**
 * Scroll-reveal wrapper. Fades + lifts children in when they enter the
 * viewport. Pure CSS transition driven by a `.is-visible` class, so it
 * costs nothing after the first paint. `prefers-reduced-motion` is
 * handled in globals.css (elements render fully visible, no transform).
 */
export const Reveal = ({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  /** Stagger delay in ms */
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
};
