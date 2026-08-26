import Header from "@/components/public/Header";
import ServicesHero from "@/components/public/services/ServicesHero";
import ServicesOverview from "@/components/public/services/ServicesOverview";
import MainServices from "@/components/public/services/MainServices";
import ServicesJourney from "@/components/public/services/ServicesJourney";
import WhyOurSupportMatters from "@/components/public/services/WhyOurSupportMatters";
import ServicesCTA from "@/components/public/services/ServicesCTA";
import Footer from "@/components/public/Footer";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-yellow-500/30 selection:text-slate-900">
      <Header />
      <main>
        <ServicesHero />
        <ServicesOverview />
        <MainServices />
        <ServicesJourney />
        <WhyOurSupportMatters />
        <ServicesCTA />
      </main>
      <Footer />
    </div>
  );
}
