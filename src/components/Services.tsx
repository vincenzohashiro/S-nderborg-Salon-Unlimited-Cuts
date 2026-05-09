import shaveImg from "@/assets/barber-shave.jpg";
import { Scissors, Sparkles, Crown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  { icon: Scissors, title: "Herreklip", price: "fra 200 kr", desc: "Klassisk eller moderne klipning — tilpasset dig." },
  { icon: User, title: "Skæg & Trim", price: "fra 149 kr", desc: "Præcis trimning med varm barbering og olie." },
  { icon: Sparkles, title: "Klip + Skæg", price: "fra 349 kr", desc: "Den komplette behandling fra top til hage." },
  { icon: Crown, title: "Børneklip", price: "fra 179 kr", desc: "Tålmodig klipning for de mindste herrer." },
];

const Services = () => {
  return (
    <section id="services" className="py-24 md:py-32">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div className="relative">
            <img
              src={shaveImg}
              alt="A&B Barber giver klassisk varm håndklædebehandling"
              loading="lazy"
              className="w-full aspect-[4/5] object-cover rounded-sm shadow-elegant"
            />
            <div className="absolute -bottom-6 -right-6 hidden md:block bg-gold text-gold-foreground px-8 py-6 rounded-sm shadow-gold">
              <div className="font-serif text-3xl">A&B</div>
              <div className="text-xs uppercase tracking-widest">Barber Lounge 2</div>
            </div>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Vores håndværk</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6 text-balance">
              Hver klip er en kunstform.
            </h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed mb-6">
              Hos A&B Barber Lounge 2 i Sønderborg kombinerer vi klassisk barberhåndværk med moderne teknikker.
              Vores barbere uddannes løbende — så du altid får det skarpeste resultat.
            </p>
            <Button variant="default" asChild>
              <Link to="/services">Se alle services</Link>
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group p-8 bg-secondary border border-border rounded-sm hover:bg-primary hover:text-background transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant"
            >
              <s.icon className="w-8 h-8 text-gold mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl mb-2">{s.title}</h3>
              <p className="text-sm text-gold mb-4 uppercase tracking-widest">{s.price}</p>
              <p className="font-light text-sm opacity-80 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
