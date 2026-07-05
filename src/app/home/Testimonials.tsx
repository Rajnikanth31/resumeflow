"use client";
import React from "react";
import Image from "next/image";
import heartSrc from "public/assets/heart.svg";
import testimonialSpiegelSrc from "public/assets/testimonial-spiegel.jpg";
import testimonialSantiSrc from "public/assets/testimonial-santi.jpg";
import testimonialVivianSrc from "public/assets/testimonial-vivian.jpg";

const TESTIMONIALS = [
  {
    src: testimonialSpiegelSrc,
    quote: "ResumeFlow's formatting and layout templates make it incredibly fast to draft clean, standard, ATS-optimized resumes. The multi-metric scoring takes the guesswork out of tailoring.",
    name: "Ms. Spiegel",
    title: "Educator",
  },
  {
    src: testimonialSantiSrc,
    quote: "The unified application package ZIP exporter is a game-changer. Delivering tailored Word-compatible cover letters along with my resume in one click saved me weeks of manual work.",
    name: "Santi",
    title: "Software Engineer",
  },
  {
    src: testimonialVivianSrc,
    quote: "The ATS scanning scorecards and keyword heatmaps show me exactly what changes to make. It feels premium, responsive, and completely secure.",
    name: "Vivian",
    title: "College Student",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 lg:py-28 bg-card text-foreground rounded-3xl px-8 lg:px-16 border border-border mt-12">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl flex items-center justify-center gap-2">
          Loved by Job Seekers
          <Image src={heartSrc} alt="love" className="h-7 w-7 inline-block animate-pulse" />
        </h2>
        <p className="text-sm text-muted-foreground">Hear from our community about how ResumeFlow has simplified their application pipelines.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {TESTIMONIALS.map(({ src, quote, name, title }, idx) => (
          <div key={idx} className="flex flex-col justify-between p-6 rounded-2xl border border-border bg-card shadow-lg">
            <blockquote className="text-sm text-muted-foreground italic leading-relaxed">
              &ldquo;{quote}&rdquo;
            </blockquote>
            
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-border">
              <Image
                src={src}
                className="h-10 w-10 rounded-full select-none"
                alt="profile"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-foreground">{name}</div>
                <div className="text-[10px] text-muted-foreground">{title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
