import React from "react";
import Image from "next/image";
import testimonialSpiegelSrc from "public/assets/testimonial-spiegel.jpg";
import testimonialSantiSrc from "public/assets/testimonial-santi.jpg";
import testimonialVivianSrc from "public/assets/testimonial-vivian.jpg";
import { Section, SectionHeader } from "home/Section";
import { Reveal } from "home/Reveal";

const TESTIMONIALS = [
  {
    src: testimonialSpiegelSrc,
    quote:
      "The formatting and templates make it incredibly fast to draft clean, ATS-optimized resumes. Multi-metric scoring takes the guesswork out of tailoring.",
    name: "Ms. Spiegel",
    title: "Educator",
  },
  {
    src: testimonialSantiSrc,
    quote:
      "The application package exporter is a game-changer. Tailored cover letters and my resume in one click saved me weeks of manual work.",
    name: "Santi",
    title: "Software Engineer",
  },
  {
    src: testimonialVivianSrc,
    quote:
      "The keyword heatmaps show me exactly what to change. It feels premium, fast, and my data never leaves my browser.",
    name: "Vivian",
    title: "College Student",
  },
];

export const Testimonials = () => (
  <Section id="testimonials">
    <SectionHeader
      kicker="Testimonials"
      title="Job seekers ship better applications with ResumeFlow"
      subtitle="From students to senior engineers — here's what changed for them."
    />
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {TESTIMONIALS.map(({ src, quote, name, title }, i) => (
        <Reveal key={name} delay={i * 100}>
          <figure className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-7 shadow-e1 transition-all duration-300 hover:-translate-y-1 hover:shadow-e3">
            <blockquote className="text-[15px] leading-relaxed text-foreground">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <Image
                src={src}
                className="h-10 w-10 rounded-full object-cover"
                alt={`Portrait of ${name}`}
              />
              <div>
                <div className="text-sm font-bold text-foreground">{name}</div>
                <div className="text-xs text-muted-foreground">{title}</div>
              </div>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  </Section>
);
