import { Hero } from "home/Hero";
import { LogoCloud } from "home/LogoCloud";
import { Features } from "home/Features";
import { InteractiveDemo } from "home/InteractiveDemo";
import { Steps } from "home/Steps";
import { Templates } from "home/Templates";
import { AiFeatures } from "home/AiFeatures";
import { Comparison } from "home/Comparison";
import { Testimonials } from "home/Testimonials";
import { Pricing } from "home/Pricing";
import { QuestionsAndAnswers } from "home/QuestionsAndAnswers";
import { FinalCta } from "home/FinalCta";
import { Footer } from "home/Footer";

export default function Home() {
  return (
    <main className="lp min-h-screen bg-background text-foreground">
      <Hero />
      <LogoCloud />
      <Features />
      <InteractiveDemo />
      <Steps />
      <Templates />
      <AiFeatures />
      <Comparison />
      <Testimonials />
      <Pricing />
      <QuestionsAndAnswers />
      <FinalCta />
      <Footer />
    </main>
  );
}
