import Header from "@/components/public/Header";
import ContactHero from "@/components/public/contact/ContactHero";
import ContactLayout from "@/components/public/contact/ContactLayout";
import ContactCTA from "@/components/public/contact/ContactCTA";
import Footer from "@/components/public/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-500/30 selection:text-slate-900">
      <Header />
      <main>
        <ContactHero />
        <ContactLayout />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
