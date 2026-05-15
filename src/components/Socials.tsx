import { useRef, useState } from "react";
import { Instagram, Facebook, ChevronLeft, ChevronRight } from "lucide-react";
import TikTokIcon from "@/components/ui/TikTokIcon";
import { useSiteConfig } from "@/context/SiteConfigContext";

const Socials = () => {
  const { general, socialSection } = useSiteConfig();
  const items = socialSection?.items ?? [];
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  if (items.length === 0) return null;

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const resolveUrl = (url: string) =>
    url.startsWith("http") ? url : `${base}/${url.replace(/^\//, "")}`;

  const visibleCount = 4;
  const maxIndex = Math.max(0, items.length - visibleCount);
  const prev = () => setCurrent((i) => Math.max(0, i - 1));
  const next = () => setCurrent((i) => Math.min(maxIndex, i + 1));

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <section className="py-24 md:py-32 bg-secondary overflow-hidden">
      <div className="container">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{socialSection.badge}</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 text-balance">{socialSection.heading}</h2>
        </div>

        {/* Profile header */}
        <div className="flex items-center justify-between max-w-3xl mx-auto mb-8 px-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 via-gold to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="font-serif text-xl text-primary font-bold">A</span>
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">{general.businessName}</p>
              <p className="text-xs text-muted-foreground">{socialSection.instagramHandle}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                <span className="font-semibold text-foreground">{socialSection.posts}</span> opslag &nbsp;·&nbsp;
                <span className="font-semibold text-foreground">{socialSection.followers}</span> følgere
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={general.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#0095f6] hover:bg-[#0077d6] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Instagram className="w-4 h-4" /> Følg
            </a>
            {general.tiktok && (
              <a
                href={general.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-black hover:bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <TikTokIcon className="w-4 h-4" /> TikTok
              </a>
            )}
            {general.facebook && (
              <a
                href={general.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#1877f2] hover:bg-[#0f5dd4] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Feed carousel */}
        <div className="relative max-w-3xl mx-auto">
          {/* Prev arrow */}
          {current > 0 && (
            <button
              onClick={prev}
              aria-label="Forrige"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {/* Next arrow */}
          {current < maxIndex && (
            <button
              onClick={next}
              aria-label="Næste"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          )}

          <div
            className="overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              ref={trackRef}
              className="flex gap-3 transition-transform duration-400 ease-in-out"
              style={{ transform: `translateX(calc(-${current} * (25% + 0.75rem)))` }}
            >
              {items.map((item) => (
                <a
                  key={item.id}
                  href={general.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex-shrink-0 w-[calc(25%-0.5625rem)] aspect-square rounded-lg overflow-hidden group"
                >
                  <img
                    src={resolveUrl(item.url)}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-[10px] font-semibold leading-tight">{general.businessName}</p>
                        <p className="text-white/70 text-[9px]">{item.date}</p>
                      </div>
                      <Instagram className="w-3.5 h-3.5 text-white/80" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Socials;
