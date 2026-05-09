import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Offer from "@/components/Offer";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "A&B Barber Lounge 2 Sønderborg — Ubegrænset klip 499 kr/md";
    const desc = "A&B Barber Lounge 2 i Sønderborg. Få ubegrænset klipning for kun 499 kr/md. Drop-in eller book online. Ring 91 75 24 70.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Offer />
      <Services />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
