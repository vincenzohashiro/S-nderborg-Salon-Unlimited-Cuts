import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSiteConfig } from "@/context/SiteConfigContext";

const Offer = () => {
  const { memberships, offer } = useSiteConfig();

  return (
    <section id="tilbud" className="py-24 md:py-32 bg-gradient-dark text-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-soft rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-[0.3em] mb-6">
            <Sparkles className="w-4 h-4" /> {offer.badge}
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-balance">
            {offer.heading1}<br />
            <span className="italic text-gold">{offer.heading2}</span>
          </h2>
          <p className="mt-6 text-background/70 font-light">{offer.subtext}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {memberships.map((p) => (
            <div
              key={p.id}
              className={`relative bg-background/5 backdrop-blur-sm border rounded-sm p-8 md:p-10 shadow-elegant flex flex-col ${
                p.highlight ? "border-gold" : "border-gold/20"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-primary text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-sm">
                  Mest populær
                </span>
              )}
              <div className="text-xs uppercase tracking-[0.3em] text-gold mb-4">{p.name}</div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-serif text-6xl md:text-7xl text-background">{p.price}</span>
                <span className="text-background/60 text-lg">kr/md</span>
              </div>
              <p className="text-background/70 font-light mb-8">{p.tagline}</p>

              <ul className="space-y-3 mb-10">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-background/90">
                    <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-gold" />
                    </span>
                    <span className="font-light text-sm">{perk}</span>
                  </li>
                ))}
              </ul>

              <Button variant="gold" size="xl" className="w-full mt-auto" asChild>
                <Link to="/booking">{p.cta}</Link>
              </Button>
              <p className="text-xs text-background/50 mt-4 text-center">{offer.smallPrint}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offer;
