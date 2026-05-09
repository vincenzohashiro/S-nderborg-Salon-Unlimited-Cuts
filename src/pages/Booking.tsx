import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { useEffect } from "react";

const PLANWAY_URL = "https://ab-barberlounge2.planway.com";

const Booking = () => {
  useEffect(() => {
    document.title = "Book tid — A&B Barber Lounge 2 Sønderborg";
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-40 pb-16 bg-gradient-dark text-background text-center">
        <div className="container">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Book tid</span>
          <h1 className="font-serif text-5xl md:text-7xl mt-4 text-balance">
            Reservér din <span className="italic text-gold">stol</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-background/80 font-light">
            Vælg tid og service nedenfor — eller ring til os for drop-in.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <InfoCard icon={Phone} label="Ring" value="+45 91 75 24 70" href="tel:+4591752470" />
            <InfoCard icon={MapPin} label="Adresse" value="Perlegade 64, Sønderborg" />
            <InfoCard icon={Clock} label="Åbent" value="Man–Lør 09–18" />
          </div>

          <div className="bg-secondary border border-border rounded-sm overflow-hidden shadow-elegant">
            <div className="p-6 border-b border-border flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-serif text-2xl">Online booking</h2>
                <p className="text-sm text-muted-foreground">Drevet af Planway</p>
              </div>
              <Button variant="gold" asChild>
                <a href={PLANWAY_URL} target="_blank" rel="noopener noreferrer">
                  Åbn i nyt vindue <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
            <iframe
              src={PLANWAY_URL}
              title="Planway booking for A&B Barber Lounge 2"
              className="w-full h-[800px] bg-background"
              loading="lazy"
            />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Har du problemer med bookingen? Ring til os på{" "}
            <a href="tel:+4591752470" className="text-gold hover:underline">91 75 24 70</a>.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

const InfoCard = ({ icon: Icon, label, value, href }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string }) => {
  const content = (
    <div className="p-6 bg-secondary border border-border rounded-sm flex items-center gap-4 hover:border-gold transition-colors">
      <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gold" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
};

export default Booking;
