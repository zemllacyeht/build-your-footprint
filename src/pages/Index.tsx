import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Process } from "@/components/site/Process";
import { Work } from "@/components/site/Work";
import { Pricing } from "@/components/site/Pricing";
import { ClientStories } from "@/components/site/ClientStories";
import { ClientPortal } from "@/components/site/ClientPortal";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { MobileSelectionsBar } from "@/components/site/MobileSelectionsBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Process />
        <Work />
        <ClientStories />
        <Pricing />
        <ClientPortal />
        <Contact />
      </main>
      <Footer />
      <MobileSelectionsBar />
    </div>
  );
};

export default Index;
