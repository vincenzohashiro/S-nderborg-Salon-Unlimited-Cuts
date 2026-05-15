import { useRef, useState } from "react";
import { Instagram, Facebook, ChevronLeft, ChevronRight } from "lucide-react";
import TikTokIcon from "@/components/ui/TikTokIcon";
import { useSiteConfig } from "@/context/SiteConfigContext";

const Socials = () => {
  const { general, socialSection } = useSiteConfig();
  const items = socialSection?.items ?? [];
  const [current, setCurrent] = useState(0);
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

  const SocialButtons = () => (
    <div className="flex items-center gap-2 flex-wrap">
      <a
        href={general.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-[#0095f6] hover:bg-[#0077d6] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
      >
        <Instagram className="w-4 h-4" /> Følg
      </a>
      {general.tiktok && (
        <a
          href={general.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-black hover:bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <TikTokIcon className="w-4 h-4" /> TikTok
        </a>
      )}
      {general.facebook && (
        <a
          href={general.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[#1877f2] hover:bg-[#0f5dd4] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Facebook className="w-4 h-4" />
        </a>
      )}
    </div>
  );

  return (
    <section className="py-24 md:py-32 bg-secondary overflow-hidden">
      <div className="container max-w-6xl">

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{socialSection.badge}</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 text-balance">{socialSection.heading}</h2>
        </div>

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-400 via-gold to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="font-serif text-2xl md:text-3xl text-primary font-bold">A</span>
            </div>
            <div>
              <p className="font-semibold text-base md:text-lg leading-tight">{general.businessName}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{socialSection.instagramHandle}</p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-semibold text-foreground">{socialSection.posts}</span> opslag
                &nbsp;·&nbsp;
                <span className="font-semibold text-foreground">{socialSection.followers}</span> følgere
              </p>
            </div>
          </div>
          <SocialButtons />
        </div>

        {/* ── Mobile: 2-column grid ── */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {items.map((item) => (
            <a
              key={item.id}
              href={general.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <img
                src={resolveUrl(item.url)}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-xs font-semibold leading-tight">{general.businessName}</p>
                    <p className="text-white/70 text-[10px]">{item.date}</p>
                  </div>
                  <Instagram className="w-4 h-4 text-white/80" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* ── Desktop: 4-column carousel ── */}
        <div
          className="hidden md:block relative"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {current > 0 && (
            <button
              onClick={prev}
              aria-label="Forrige"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}
          {current < maxIndex && (
            <button
              onClick={next}
              aria-label="Næste"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          )}

          <div className="overflow-hidden rounded-xl">
            <div
              className="flex gap-4 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(calc(-${current} * (25% + 1rem)))` }}
            >
              {items.map((item) => (
                <a
                  key={item.id}
                  href={general.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex-shrink-0 w-[calc(25%-0.75rem)] aspect-square rounded-xl overflow-hidden group"
                >
                  <img
                    src={resolveUrl(item.url)}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-xs font-semibold leading-tight">{general.businessName}</p>
                        <p className="text-white/70 text-[10px]">{item.date}</p>
                      </div>
                      <Instagram className="w-4 h-4 text-white/80" />
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
