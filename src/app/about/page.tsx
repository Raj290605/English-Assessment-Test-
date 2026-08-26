import Header from "@/components/public/Header";
import AboutHero from "@/components/public/about/AboutHero";
import CompanyVideo from "@/components/public/about/CompanyVideo";
import WhoWeAre from "@/components/public/about/WhoWeAre";
import MissionVision from "@/components/public/about/MissionVision";
import StudentJourney from "@/components/public/about/StudentJourney";
import FinalCTA from "@/components/public/FinalCTA";
import Footer from "@/components/public/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-yellow-500/30 selection:text-slate-900">
      <Header />
      <main>
        <AboutHero />
        <CompanyVideo />
        <WhoWeAre />
        <MissionVision />
        <StudentJourney />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
