import Header from "@/components/public/Header";
import CredibilityHero from "@/components/public/credibility/CredibilityHero";
import WhatIsIt from "@/components/public/credibility/WhatIsIt";
import QuestionCategories from "@/components/public/credibility/QuestionCategories";
import PlatformFlow from "@/components/public/credibility/PlatformFlow";
import PreparationVideo from "@/components/public/credibility/PreparationVideo";
import PracticeAreas from "@/components/public/credibility/PracticeAreas";
import InterfacePreview from "@/components/public/credibility/InterfacePreview";
import CredibilityCTA from "@/components/public/credibility/CredibilityCTA";
import Footer from "@/components/public/Footer";

export default function CredibilityInterviewTestPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-500/30 selection:text-slate-900">
      <Header />
      <main>
        <CredibilityHero />
        <WhatIsIt />
        <QuestionCategories />
        <PlatformFlow />
        <PreparationVideo />
        <PracticeAreas />
        <InterfacePreview />
        <CredibilityCTA />
      </main>
      <Footer />
    </div>
  );
}
