import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import salon from "@/assets/salon-wide.jpg";
import shave from "@/assets/barber-shave.jpg";
import chairs from "@/assets/interior-chairs.jpg";
import storefront from "@/assets/storefront.jpg";
import { useSiteConfig } from "@/context/SiteConfigContext";

const images = [
  { src: chairs,     alt: "Sorte og guld barberstole hos A&B Barber Lounge 2" },
  { src: shave,      alt: "Barbering med varm håndklædebehandling" },
  { src: storefront, alt: "Facaden af A&B Barber Lounge 2 i Sønderborg" },
  { src: salon,      alt: "Salon interiør med kunde i stolen" },
];

const Gallery = () => {
  const { gallery } = useSiteConfig();
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <section id="galleri" className="py-24 md:py-32 bg-secondary overflow-hidden">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{gallery.badge}</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 text-balance">
            {gallery.heading}
          </h2>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Main image */}
          <div
            className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-elegant select-none"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {images.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  i === current ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              />
            ))}

            {/* Prev / Next buttons */}
            <button
              onClick={prev}
              aria-label="Forrige billede"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Næste billede"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 right-4 text-xs text-white/80 bg-black/40 px-2 py-0.5 rounded-full">
              {current + 1} / {images.length}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Billede ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-gold w-5" : "bg-gold/30"
                }`}
              />
            ))}
          </div>

          {/* Thumbnail strip */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`aspect-square rounded-sm overflow-hidden border-2 transition-all ${
                  i === current ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
