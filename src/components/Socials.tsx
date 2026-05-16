import { useRef, useState } from "react";
import { Instagram, Facebook, ChevronLeft, ChevronRight } from "lucide-react";
import TikTokIcon from "@/components/ui/TikTokIcon";
import { useSiteConfig } from "@/context/SiteConfigContext";

const getEmbedUrl = (postUrl?: string): string | null => {
  if (!postUrl) return null;
  const ig = postUrl.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
  if (ig) return `https://www.instagram.com/p/${ig[1]}/embed/captioned/`;
  const tt = postUrl.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (tt) return `https://www.tiktok.com/embed/v2/${tt[1]}`;
  return null;
};

const Socials = () => {
  const { general, socialSection } = useSiteConfig();
  const mapsUrl = (general as typeof general & { mapsUrl?: string }).mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(general.address)}`;
  const items = socialSection?.items ?? [];
  const [mobileIdx, setMobileIdx] = useState(0);
  const [desktopOff, setDesktopOff] = useState(0);
  const mobileTouchX = useRef<number | null>(null);
  const desktopTouchX = useRef<number | null>(null);

  if (items.length === 0) return null;

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const resolveUrl = (url: string) =>
    url.startsWith("http") ? url : `${base}/${url.replace(/^\//, "")}`;

  const desktopMax = Math.max(0, items.length - 4);
  const mobilePrev = () => setMobileIdx((i) => Math.max(0, i - 1));
  const mobileNext = () => setMobileIdx((i) => Math.min(items.length - 1, i + 1));
  const desktopPrev = () => setDesktopOff((i) => Math.max(0, i - 1));
  const desktopNext = () => setDesktopOff((i) => Math.min(desktopMax, i + 1));

  const onMobileTouchStart = (e: React.TouchEvent) => { mobileTouchX.current = e.touches[0].clientX; };
  const onMobileTouchEnd = (e: React.TouchEvent) => {
    if (mobileTouchX.current === null) return;
    const diff = mobileTouchX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? mobileNext() : mobilePrev();
    mobileTouchX.current = null;
  };
  const onDesktopTouchStart = (e: React.TouchEvent) => { desktopTouchX.current = e.touches[0].clientX; };
  const onDesktopTouchEnd = (e: React.TouchEvent) => {
    if (desktopTouchX.current === null) return;
    const diff = desktopTouchX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? desktopNext() : desktopPrev();
    desktopTouchX.current = null;
  };

  const ss = socialSection as typeof socialSection & { displayName?: string; bio?: string; following?: string };

  const avatar = (size: "sm" | "lg" | "xl") => {
    const cls = {
      xl: "w-20 h-20 md:w-24 md:h-24 rounded-full object-cover flex-shrink-0 shadow-lg border-2 border-gold/40",
      lg: "w-16 h-16 rounded-full object-cover flex-shrink-0 shadow-lg border-2 border-gold/40",
      sm: "w-9 h-9 rounded-full object-cover flex-shrink-0",
    }[size];
    const ring = {
      xl: "w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-400 via-gold to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg",
      lg: "w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-gold to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg",
      sm: "w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 via-gold to-amber-600 flex items-center justify-center flex-shrink-0",
    }[size];
    const textSize = size === "sm" ? "text-sm" : "text-2xl";
    return socialSection.profileImage ? (
      <img src={resolveUrl(socialSection.profileImage)} alt={general.businessName} className={cls} referrerPolicy="no-referrer" />
    ) : (
      <div className={ring}>
        <span className={`font-serif font-bold text-primary ${textSize}`}>A</span>
      </div>
    );
  };

  const socialButtons = (
    <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start mt-3">
      <a href={general.instagram} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-[#0095f6] hover:bg-[#0077d6] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
        <Instagram className="w-4 h-4" /> Instagram
      </a>
      {general.tiktok && (
        <a href={general.tiktok} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-black hover:bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <TikTokIcon className="w-4 h-4" /> TikTok
        </a>
      )}
      {general.facebook && (
        <a href={general.facebook} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[#1877f2] hover:bg-[#0f5dd4] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Facebook className="w-4 h-4" /> Facebook
        </a>
      )}
    </div>
  );

  const currentItem = items[mobileIdx];
  const currentEmbed = getEmbedUrl(currentItem?.postUrl);

  return (
    <section className="py-24 md:py-32 bg-secondary overflow-hidden">
      <div className="container max-w-6xl">

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{socialSection.badge}</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 text-balance">{socialSection.heading}</h2>
        </div>

        {/* ── Mobile: story-style single card carousel ── */}
        <div className="md:hidden flex flex-col items-center gap-6">

          {/* Profile header — Instagram style */}
          <div className="flex flex-col items-center gap-2 text-center w-full">
            {avatar("xl")}
            <p className="font-semibold text-base leading-tight mt-1">{ss.displayName ?? general.businessName}</p>
            <div className="flex justify-center gap-5 text-sm">
              <span><strong>{socialSection.posts}</strong> opslag</span>
              <span><strong>{socialSection.followers}</strong> følgere</span>
              <span><strong>{ss.following ?? "0"}</strong> følger</span>
            </div>
            {ss.bio && <p className="text-xs text-muted-foreground whitespace-pre-line leading-snug">{ss.bio}</p>}
            {socialSection.instagramHandle && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium hover:text-gold transition-colors">{socialSection.instagramHandle}</a>
            )}
            {socialButtons}
          </div>

          {/* Card + arrows */}
          <div
            className="relative flex items-center justify-center w-full"
            onTouchStart={onMobileTouchStart}
            onTouchEnd={onMobileTouchEnd}
          >
            {mobileIdx > 0 && (
              <button onClick={mobilePrev} aria-label="Forrige"
                className="absolute left-0 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center -translate-x-1">
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            {mobileIdx < items.length - 1 && (
              <button onClick={mobileNext} aria-label="Næste"
                className="absolute right-0 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center translate-x-1">
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            )}

            <div className="w-full max-w-[320px] bg-black rounded-2xl shadow-xl overflow-hidden">
              {/* Media — iframe clipped to hide Instagram header/footer */}
              {currentEmbed ? (
                <div style={{ height: 520, overflow: "hidden" }}>
                  <iframe
                    src={currentEmbed}
                    className="w-full"
                    style={{ height: 1100, marginTop: -62, display: "block" }}
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency
                    allowFullScreen
                    title={currentItem.alt}
                  />
                </div>
              ) : (
                <a href={general.instagram} target="_blank" rel="noopener noreferrer">
                  <img
                    src={resolveUrl(currentItem.url)}
                    alt={currentItem.alt}
                    className="w-full aspect-[4/5] object-cover"
                  />
                </a>
              )}
            </div>
          </div>

          {/* Dot indicators */}
          {items.length > 1 && (
            <div className="flex justify-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMobileIdx(i)}
                  aria-label={`Gå til billede ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === mobileIdx ? "bg-gold" : "bg-border"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Desktop: 4-column carousel ── */}
        <div className="hidden md:block">
          {/* Profile header — Instagram style */}
          <div className="flex items-start gap-8 mb-10">
            {avatar("xl")}
            <div className="flex-1">
              <p className="font-semibold text-lg mb-3">{ss.displayName ?? general.businessName}</p>
              <div className="flex gap-6 text-sm mb-3">
                <span><strong className="font-semibold">{socialSection.posts}</strong> opslag</span>
                <span><strong className="font-semibold">{socialSection.followers}</strong> følgere</span>
                <span><strong className="font-semibold">{ss.following ?? "0"}</strong> følger</span>
              </div>
              {ss.bio && <p className="text-sm text-muted-foreground whitespace-pre-line leading-snug mb-1">{ss.bio}</p>}
              {socialSection.instagramHandle && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium mb-0 hover:text-gold transition-colors block">{socialSection.instagramHandle}</a>
              )}
              {socialButtons}
            </div>
          </div>

          {/* Carousel */}
          <div className="relative" onTouchStart={onDesktopTouchStart} onTouchEnd={onDesktopTouchEnd}>
            {desktopOff > 0 && (
              <button onClick={desktopPrev} aria-label="Forrige"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            )}
            {desktopOff < desktopMax && (
              <button onClick={desktopNext} aria-label="Næste"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            )}
            <div className="overflow-hidden rounded-xl">
              <div className="flex gap-4 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(calc(-${desktopOff} * (25% + 1rem)))` }}>
                {items.map((item) => {
                  const embed = getEmbedUrl(item.postUrl);
                  return embed ? (
                    <div key={item.id} className="flex-shrink-0 w-[calc(25%-0.75rem)] rounded-xl overflow-hidden bg-black shadow-sm">
                      {/* Very tall iframe forces video to fill height naturally, footer stays below clip */}
                      <div style={{ height: 440, overflow: "hidden" }}>
                        <iframe
                          src={embed}
                          className="w-full"
                          style={{ height: 1100, marginTop: -62, display: "block" }}
                          frameBorder="0"
                          scrolling="no"
                          allowTransparency
                          allowFullScreen
                          title={item.alt}
                        />
                      </div>
                    </div>
                  ) : (
                    <a key={item.id} href={general.instagram} target="_blank" rel="noopener noreferrer"
                      className="relative flex-shrink-0 w-[calc(25%-0.75rem)] rounded-xl overflow-hidden group bg-black shadow-sm"
                      style={{ height: 430 }}>
                      <img src={resolveUrl(item.url)} alt={item.alt} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Socials;
