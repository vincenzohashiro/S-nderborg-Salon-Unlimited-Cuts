import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Offer from "@/components/Offer";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Socials from "@/components/Socials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  const { seo } = useSiteConfig();
  useSEO(seo.home.title, seo.home.description, seo.ogImage);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Offer />
      <Services />
      <Gallery />
      <Reviews />
      <FAQ />
      <Socials />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
