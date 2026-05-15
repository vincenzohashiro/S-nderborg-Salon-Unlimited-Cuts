import { useState } from "react";
import shaveImgFallback from "@/assets/barber-shave.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { getIcon } from "@/lib/icons";

const br = (text: string) => text.replace(/<br\s*\/?>/gi, "\n");

const Services = () => {
  const { services, servicesSection, images } = useSiteConfig();
  const shaveImg = images?.services || shaveImgFallback;
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setFlipped((p) => ({ ...p, [id]: !p[id] }));

  return (
    <section id="services" className="py-24 md:py-32 overflow-hidden">
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
            <span className="text-xs uppercase tracking-[0.3em] text-gold">{servicesSection.badge}</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6 text-balance">
              {servicesSection.heading}
            </h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed mb-6">
              {servicesSection.body}
            </p>
            <Button variant="default" asChild>
              <Link to="/services">{servicesSection.cta}</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((s) => {
            const Icon = getIcon(s.icon);
            const isFlipped = !!flipped[s.id];
            return (
              <div
                key={s.id}
                className="cursor-pointer relative"
                style={{ perspective: "1000px" }}
                onClick={() => toggle(s.id)}
              >
                {/* Ghost — invisible, sets card height from back content */}
                <div className="invisible p-5 md:p-8 flex flex-col" aria-hidden="true">
                  <h3 className="font-serif text-base md:text-xl mb-1">{s.title}</h3>
                  <p className="text-[10px] md:text-xs uppercase tracking-widest mb-3">{s.price} · {s.time}</p>
                  <p className="text-xs md:text-sm leading-relaxed whitespace-pre-line">{br(s.desc)}</p>
                  <p className="text-[10px] mt-3">‹</p>
                </div>

                {/* Flip wrapper — covers the ghost */}
                <div
                  className="absolute inset-0"
                  style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT */}
                  <div
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                    className="absolute inset-0 p-5 md:p-8 bg-secondary border border-border rounded-sm flex flex-col justify-center"
                  >
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-gold mb-4 md:mb-6" strokeWidth={1.5} />
                    <h3 className="font-serif text-lg md:text-2xl mb-1 md:mb-2">{s.title}</h3>
                    <p className="text-xs md:text-sm text-gold uppercase tracking-widest mb-3">{s.price}</p>
                    <p className="text-[10px] text-muted-foreground opacity-60">Tryk for detaljer →</p>
                  </div>

                  {/* BACK */}
                  <div
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                    className="absolute inset-0 p-5 md:p-8 bg-primary text-background border border-gold/30 rounded-sm flex flex-col"
                  >
                    <h3 className="font-serif text-base md:text-xl mb-1">{s.title}</h3>
                    <p className="text-[10px] md:text-xs text-gold uppercase tracking-widest mb-3">{s.price} · {s.time}</p>
                    <p className="font-light text-xs md:text-sm leading-relaxed whitespace-pre-line opacity-80">
                      {br(s.desc)}
                    </p>
                    <p className="text-[10px] text-background/40 mt-3">← Tryk for at lukke</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
