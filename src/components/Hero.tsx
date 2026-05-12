import heroImg from "@/assets/hero-beard.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteConfig } from "@/context/SiteConfigContext";

const Hero = () => {
  const { hero, general } = useSiteConfig();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="A&B Barber Lounge 2 interiør i Sønderborg med sorte og guld barberstole"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-primary/95" />

      <div className="container relative z-10 text-center text-background pt-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-gold/40 backdrop-blur-sm bg-background/5 animate-fade-in">
          <MapPin className="w-4 h-4 text-gold" />
          <span className="text-xs uppercase tracking-[0.2em]">{hero.badge}</span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-balance animate-fade-up">
          {hero.headline1}<br />
          <span className="italic text-gold">{hero.headline2}</span>
        </h1>

        <p className="mt-8 max-w-xl mx-auto text-lg md:text-xl text-background/85 font-light animate-fade-up [animation-delay:200ms]">
          {hero.subtext}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up [animation-delay:400ms]">
          <Button variant="gold" size="xl" asChild>
            <Link to="/booking">
              Book din tid <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button variant="ghostLight" size="xl" asChild>
            <a href={`tel:${general.phone.replace(/\s/g, "")}`}>
              <Phone className="mr-2 w-4 h-4" /> {general.phone}
            </a>
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in [animation-delay:600ms]">
          {hero.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-serif text-2xl md:text-4xl text-gold">{s.value}</div>
              <div className="text-xs uppercase tracking-widest text-background/60 mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
