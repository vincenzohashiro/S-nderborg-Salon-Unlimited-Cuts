import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSiteConfig } from "@/context/SiteConfigContext";
import TikTokIcon from "@/components/ui/TikTokIcon";

const Contact = () => {
  const { general, contact } = useSiteConfig();

  const items = [
    { icon: MapPin, label: "Adresse",      value: general.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(general.address)}` },
    { icon: Phone,  label: "Telefon",      value: general.phone, href: `tel:${general.phone.replace(/\s/g, "")}` },
    { icon: Clock,  label: "Åbningstider", value: general.hours },
  ];

  return (
    <section id="kontakt" className="py-24 md:py-32 bg-gradient-dark text-background overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">{contact.badge}</span>
            <h2 className="font-serif text-4xl md:text-6xl mt-4 mb-8 text-balance">
              {contact.heading}
            </h2>
            <p className="text-background/70 font-light text-lg mb-12 max-w-md">
              {contact.body}
            </p>

            <div className="space-y-6">
              {items.map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-background/50 mb-1">{c.label}</div>
                    {c.href ? (
                      <a href={c.href} {...(!c.href.startsWith("tel:") && { target: "_blank", rel: "noopener noreferrer" })} className="text-background hover:text-gold">{c.value}</a>
                    ) : (
                      <div className="text-background">{c.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-10">
              <a href={general.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:border-gold hover:text-gold transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={general.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:border-gold hover:text-gold transition">
                <Facebook className="w-4 h-4" />
              </a>
              {general.tiktok && (
                <a href={general.tiktok} aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:border-gold hover:text-gold transition">
                  <TikTokIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="bg-background/5 backdrop-blur-sm border border-gold/20 rounded-sm p-10 text-center shadow-elegant">
            <h3 className="font-serif text-3xl mb-4">{contact.cardHeading}</h3>
            <p className="text-background/70 mb-8 font-light">{contact.cardBody}</p>
            <Button variant="gold" size="xl" className="w-full" asChild>
              <Link to="/booking">{contact.cardCta}</Link>
            </Button>
            <p className="text-xs text-background/50 mt-6">
              eller ring {general.phone} for drop-in
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
