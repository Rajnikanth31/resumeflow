import React from "react";

export const LogoCloud = () => {
  const logos = ["Google", "Stripe", "Notion", "Airbnb", "Shopify", "Datadog", "Figma"];

  return (
    <section className="max-w-[1180px] mx-auto py-12 px-6 border-b border-border">
      <div className="text-center font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-6">
        TRUSTED BY CANDIDATES LANDING OFFERS AT
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 hover:opacity-85 transition-opacity duration-300">
        {logos.map((logo) => (
          <span key={logo} className="text-lg font-bold text-muted-foreground font-heading">
            {logo}
          </span>
        ))}
      </div>
    </section>
  );
};
