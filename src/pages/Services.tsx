import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Scissors, User, Sparkles, Crown, Baby, Droplet, Flame, Gift } from "lucide-react";
import { useEffect } from "react";
import shave from "@/assets/barber-shave.jpg";

const services = [
  { icon: Scissors, title: "Herreklip", price: "200 kr", time: "30 min", desc: "Klassisk eller moderne klipning, vask og styling inkluderet." },
  { icon: User, title: "Skægtrim", price: "149 kr", time: "20 min", desc: "Præcis trimning og formgivning af dit skæg." },
  { icon: Flame, title: "Varm Barbering", price: "199 kr", time: "25 min", desc: "Klassisk barbering med varmt håndklæde og barberkniv." },
  { icon: Sparkles, title: "Klip + Skæg", price: "349 kr", time: "45 min", desc: "Den komplette pakke — klipning og fuld skægbehandling." },
  { icon: Crown, title: "Den Royale", price: "499 kr", time: "60 min", desc: "Klip, skæg, ansigtsmaske og massage. Vores signaturoplevelse." },
  { icon: Baby, title: "Børneklip (0–12)", price: "179 kr", time: "20 min", desc: "Tålmodig klipning for de små i en rolig stol." },
  { icon: Droplet, title: "Hårfarve", price: "fra 299 kr", time: "30 min", desc: "Dækning af grå hår eller fuld farveændring." },
  { icon: Gift, title: "Gavekort", price: "valgfrit", time: "—", desc: "Den perfekte gave til ham. Fås i alle beløb." },
];

const ServicesPage = () => {
  useEffect(() => {
    document.title = "Services & Priser — A&B Barber Lounge 2 Sønderborg";
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-40 pb-20 bg-gradient-dark text-background overflow-hidden">
        <img src={shave} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="container relative z-10 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Services</span>
          <h1 className="font-serif text-5xl md:text-7xl mt-4 text-balance">
            Priser & <span className="italic text-gold">behandlinger</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-background/80 font-light">
            Transparente priser. Ingen overraskelser. Bliv medlem og få det hele ubegrænset for 499 kr/md.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((s) => (
              <div key={s.title} className="p-8 bg-secondary border border-border rounded-sm hover:shadow-elegant hover:-translate-y-1 transition-all duration-500">
                <s.icon className="w-8 h-8 text-gold mb-6" strokeWidth={1.5} />
                <h3 className="font-serif text-2xl mb-1">{s.title}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gold uppercase tracking-widest text-sm">{s.price}</span>
                  <span className="text-muted-foreground text-xs">· {s.time}</span>
                </div>
                <p className="font-light text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-5xl mx-auto mt-20 grid md:grid-cols-2 gap-8">
            <div className="p-10 bg-gradient-dark text-background rounded-sm text-center shadow-elegant">
              <span className="text-xs uppercase tracking-[0.3em] text-gold">Medlemskab</span>
              <h2 className="font-serif text-3xl md:text-4xl mt-4 mb-2">
                Ubegrænset klip
              </h2>
              <div className="font-serif text-5xl text-gold mb-4">499 kr/md</div>
              <p className="text-background/70 font-light mb-8 text-sm">
                Herreklip så ofte du vil. Ingen binding.
              </p>
              <Button variant="gold" size="lg" asChild>
                <Link to="/booking">Vælg Klip 499</Link>
              </Button>
            </div>
            <div className="p-10 bg-gradient-dark text-background rounded-sm text-center shadow-elegant border border-gold relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-primary text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-sm">
                Mest populær
              </span>
              <span className="text-xs uppercase tracking-[0.3em] text-gold">Medlemskab</span>
              <h2 className="font-serif text-3xl md:text-4xl mt-4 mb-2">
                Klip & skæg
              </h2>
              <div className="font-serif text-5xl text-gold mb-4">599 kr/md</div>
              <p className="text-background/70 font-light mb-8 text-sm">
                Klip + skæg og skægtrimning ubegrænset. Ingen binding.
              </p>
              <Button variant="gold" size="lg" asChild>
                <Link to="/booking">Vælg Klip & Skæg 599</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ServicesPage;
