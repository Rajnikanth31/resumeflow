import { Hero } from "home/Hero";
import { LogoCloud } from "home/LogoCloud";
import { Steps } from "home/Steps";
import { Features } from "home/Features";
import { InteractiveDemo } from "home/InteractiveDemo";
import { Comparison } from "home/Comparison";
import { Testimonials } from "home/Testimonials";
import { Pricing } from "home/Pricing";
import { QuestionsAndAnswers } from "home/QuestionsAndAnswers";
import { Footer } from "home/Footer";

export default function Home() {
  return (
    <main className="mx-auto max-w-screen-2xl px-6 pb-12 lg:px-12 min-h-screen py-8 space-y-12 bg-background text-foreground">
      <Hero />
      <LogoCloud />
      <Steps />
      <Features />
      <InteractiveDemo />
      <Comparison />
      <Testimonials />
      <Pricing />
      <QuestionsAndAnswers />
      <Footer />
    </main>
  );
}
