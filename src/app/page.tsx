import Header from "@/components/public/Header";
import HeroSection from "@/components/public/HeroSection";
import CompanyOverview from "@/components/public/CompanyOverview";
import UniversitiesShowcase from "@/components/public/UniversitiesShowcase";
import ServicesPreview from "@/components/public/ServicesPreview";
import CredibilityInterviewPreview from "@/components/public/CredibilityInterviewPreview";
import FinalCTA from "@/components/public/FinalCTA";
import Footer from "@/components/public/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-yellow-500/30 selection:text-slate-900">
      <Header />
      <main>
        <HeroSection />
        <CompanyOverview />
        <UniversitiesShowcase />
        <ServicesPreview />
        <CredibilityInterviewPreview />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
