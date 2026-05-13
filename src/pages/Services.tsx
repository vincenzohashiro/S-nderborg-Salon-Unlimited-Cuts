import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import shave from "@/assets/barber-shave.jpg";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useSEO } from "@/hooks/useSEO";
import { getIcon } from "@/lib/icons";

const br = (text: string) => text.replace(/<br\s*\/?>/gi, "\n");

const ServicesPage = () => {
  const { services, memberships, seo, pages } = useSiteConfig();
  useSEO(seo.services.title, seo.services.description, seo.ogImage);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-40 pb-20 bg-gradient-dark text-background overflow-hidden">
        <img src={shave} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="container relative z-10 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{pages.services.badge}</span>
          <h1 className="font-serif text-5xl md:text-7xl mt-4 text-balance">
            {pages.services.heading1} <span className="italic text-gold">{pages.services.heading2}</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-background/80 font-light">
            {pages.services.subtext}
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <div key={s.id} className="p-8 bg-secondary border border-border rounded-sm hover:shadow-elegant hover:-translate-y-1 transition-all duration-500">
                  <Icon className="w-8 h-8 text-gold mb-6" strokeWidth={1.5} />
                  <h3 className="font-serif text-2xl mb-1">{s.title}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold uppercase tracking-widest text-sm">{s.price}</span>
                    <span className="text-muted-foreground text-xs">· {s.time}</span>
                  </div>
                  <p className="font-light text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{br(s.desc)}</p>
                </div>
              );
            })}
          </div>

          <div className="max-w-5xl mx-auto mt-20 grid md:grid-cols-2 gap-8">
            {memberships.map((m) => (
              <div
                key={m.id}
                className={`p-10 bg-gradient-dark text-background rounded-sm text-center shadow-elegant relative ${m.highlight ? "border border-gold" : ""}`}
              >
                {m.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-primary text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-sm">
                    Mest populær
                  </span>
                )}
                <span className="text-xs uppercase tracking-[0.3em] text-gold">Medlemskab</span>
                <h2 className="font-serif text-3xl md:text-4xl mt-4 mb-2">{m.name}</h2>
                <div className="font-serif text-5xl text-gold mb-4">{m.price} kr/md</div>
                <p className="text-background/70 font-light mb-6 text-sm">{m.tagline}</p>
                <ul className="text-left space-y-2 mb-8">
                  {m.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-background/90">
                      <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Button variant="gold" size="lg" className="w-full" asChild>
                  <Link to="/booking">{m.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ServicesPage;
