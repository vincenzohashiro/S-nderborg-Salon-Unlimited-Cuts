import shaveImg from "@/assets/barber-shave.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { getIcon } from "@/lib/icons";

const Services = () => {
  const { services, servicesSection } = useSiteConfig();
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
            return (
              <div
                key={s.id}
                className="group p-5 md:p-8 bg-secondary border border-border rounded-sm hover:bg-primary hover:text-background transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant"
              >
                <Icon className="w-7 h-7 md:w-8 md:h-8 text-gold mb-4 md:mb-6" strokeWidth={1.5} />
                <h3 className="font-serif text-lg md:text-2xl mb-1 md:mb-2">{s.title}</h3>
                <p className="text-xs md:text-sm text-gold mb-2 md:mb-4 uppercase tracking-widest">{s.price}</p>
                <p className="font-light text-xs md:text-sm opacity-80 leading-relaxed hidden sm:block whitespace-pre-line">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
