import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import shaveFallback from "@/assets/barber-shave.jpg";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useSEO } from "@/hooks/useSEO";
import { getIcon } from "@/lib/icons";

const br = (text: string) => text.replace(/<br\s*\/?>/gi, "\n");

const ServicesPage = () => {
  const { services, memberships, seo, pages, images } = useSiteConfig();
  useSEO(seo.services.title, seo.services.description, seo.ogImage);
  const shave = images?.services || shaveFallback;
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setFlipped((p) => ({ ...p, [id]: !p[id] }));

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

      <section className="py-24 overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((s) => {
              const Icon = getIcon(s.icon);
              const isFlipped = !!flipped[s.id];
              return (
                <div
                  key={s.id}
                  className="cursor-pointer"
                  style={{ perspective: "1000px" }}
                  onClick={() => toggle(s.id)}
                >
                  <div
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      position: "relative",
                    }}
                  >
                    {/* FRONT */}
                    <div
                      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                      className="p-8 bg-secondary border border-border rounded-sm min-h-[200px] flex flex-col"
                    >
                      <Icon className="w-8 h-8 text-gold mb-6" strokeWidth={1.5} />
                      <h3 className="font-serif text-2xl mb-1">{s.title}</h3>
                      <p className="text-gold uppercase tracking-widest text-sm">{s.price}</p>
                      <p className="text-[11px] text-muted-foreground mt-auto pt-4 opacity-60">Tryk for detaljer →</p>
                    </div>

                    {/* BACK */}
                    <div
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                      className="absolute inset-0 p-8 bg-primary text-background border border-gold/30 rounded-sm flex flex-col overflow-hidden"
                    >
                      <h3 className="font-serif text-xl mb-1">{s.title}</h3>
                      <p className="text-[11px] text-gold uppercase tracking-widest mb-4">{s.price} · {s.time}</p>
                      <p className="font-light text-sm leading-relaxed whitespace-pre-line opacity-80 flex-1 overflow-auto">
                        {br(s.desc)}
                      </p>
                      <p className="text-[10px] text-background/40 mt-3">← Tryk for at lukke</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="max-w-5xl mx-auto mt-20 grid md:grid-cols-2 gap-6 md:gap-8">
            {memberships.map((m) => (
              <div
                key={m.id}
                className={`relative bg-gradient-dark text-background rounded-sm p-6 md:p-10 flex flex-col md:shadow-elegant w-full min-w-0 text-center ${m.highlight ? "border border-gold" : ""}`}
              >
                {m.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-primary text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-sm whitespace-nowrap">
                    Mest populær
                  </span>
                )}
                <span className="text-xs uppercase tracking-[0.3em] text-gold">Medlemskab</span>
                <h2 className="font-serif text-2xl md:text-4xl mt-4 mb-2">{m.name}</h2>
                <div className="font-serif text-4xl md:text-5xl text-gold mb-4">{m.price} kr/md</div>
                <p className="text-background/70 font-light mb-6 text-sm">{m.tagline}</p>
                <ul className="text-left space-y-2 mb-8">
                  {m.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-background/90">
                      <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Button variant="gold" size="lg" className="w-full mt-auto" asChild>
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
