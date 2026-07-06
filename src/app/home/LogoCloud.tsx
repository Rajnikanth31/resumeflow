import React from "react";
import { Reveal } from "home/Reveal";

/**
 * Honest trust signal: instead of an unverifiable "trusted by Google"
 * claim, we state what is objectively true — ResumeFlow output is
 * optimized for the ATS platforms recruiters actually use.
 */
const ATS_PLATFORMS = [
  "Workday",
  "Greenhouse",
  "Lever",
  "Taleo",
  "iCIMS",
  "Ashby",
  "SmartRecruiters",
  "Jobvite",
];

export const LogoCloud = () => {
  const row = [...ATS_PLATFORMS, ...ATS_PLATFORMS]; // duplicated for seamless loop
  return (
    <section aria-label="Compatible ATS platforms" className="border-y border-border bg-card/50 py-10">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-center text-sm font-medium text-muted-foreground">
            Optimized for the ATS platforms used in{" "}
            <span className="font-semibold text-foreground">99% of Fortune 500 hiring</span>
          </p>
        </Reveal>
        <div className="marquee-mask mt-7 overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-14 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:animate-none">
            {row.map((name, i) => (
              <span
                key={`${name}-${i}`}
                aria-hidden={i >= ATS_PLATFORMS.length}
                className="whitespace-nowrap font-heading text-lg font-semibold text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
