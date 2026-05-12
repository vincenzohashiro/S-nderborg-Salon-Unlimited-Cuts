import salon from "@/assets/salon-wide.jpg";
import shave from "@/assets/barber-shave.jpg";
import chairs from "@/assets/interior-chairs.jpg";
import storefront from "@/assets/storefront.jpg";
import { useSiteConfig } from "@/context/SiteConfigContext";

const items = [
  { src: chairs, alt: "Sorte og guld barberstole hos A&B Barber Lounge 2", className: "row-span-2" },
  { src: shave, alt: "Barbering med varm håndklædebehandling" },
  { src: storefront, alt: "Facaden af A&B Barber Lounge 2 i Sønderborg" },
  { src: salon, alt: "Salon interiør med kunde i stolen", className: "row-span-2" },
];

const Gallery = () => {
  const { gallery } = useSiteConfig();

  return (
    <section id="galleri" className="py-24 md:py-32 bg-secondary">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{gallery.badge}</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 text-balance">
            {gallery.heading}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-2 gap-4 max-w-5xl mx-auto h-[600px] md:h-[700px]">
          {items.map((it, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-sm group ${it.className || ""}`}
            >
              <img
                src={it.src}
                alt={it.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
