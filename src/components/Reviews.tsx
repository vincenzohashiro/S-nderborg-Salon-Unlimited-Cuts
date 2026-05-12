import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import type { Review } from "@/types/site-config";

const SPEED = 0.6;

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-gold text-gold" : "fill-muted text-muted"}`} />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="flex-shrink-0 w-[320px] md:w-[360px] bg-background border border-border rounded-sm p-6 mx-3 flex flex-col gap-4 shadow-soft">
    <div className="flex items-start justify-between gap-3">
      <StarRating rating={review.rating} />
      <div className="flex items-center gap-1 text-muted-foreground">
        <GoogleIcon />
        <span className="text-[10px] font-medium tracking-wide">Google</span>
      </div>
    </div>
    <p className="text-sm text-foreground/80 leading-relaxed flex-1">
      &ldquo;{review.text}&rdquo;
    </p>
    <div className="flex items-center gap-3 pt-3 border-t border-border">
      <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-semibold text-gold">{review.initials}</span>
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{review.author}</div>
        <div className="text-[11px] text-muted-foreground">{review.date}</div>
      </div>
    </div>
  </div>
);

const Reviews = () => {
  const { reviews } = useSiteConfig();
  const containerRef    = useRef<HTMLDivElement>(null);
  const animFrameRef    = useRef<number>();
  const isDragging      = useRef(false);
  const mouseStartX     = useRef(0);
  const mouseScrollBase = useRef(0);
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const loopCheck = () => {
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      if (el.scrollLeft < 0)    el.scrollLeft += half;
    };

    const tick = () => {
      if (!isDragging.current) {
        el.scrollLeft += SPEED;
        loopCheck();
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    const onTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      mouseStartX.current     = e.touches[0].clientX;
      mouseScrollBase.current = el.scrollLeft;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      el.scrollLeft = mouseScrollBase.current + (mouseStartX.current - e.touches[0].clientX);
      loopCheck();
    };
    const onTouchEnd = () => { isDragging.current = false; };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove",  onTouchMove,  { passive: false });
    el.addEventListener("touchend",   onTouchEnd);
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
      el.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    setGrabbing(true);
    mouseStartX.current     = e.clientX;
    mouseScrollBase.current = containerRef.current.scrollLeft;
    e.preventDefault();
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const el = containerRef.current;
    el.scrollLeft = mouseScrollBase.current + (mouseStartX.current - e.clientX);
    const half = el.scrollWidth / 2;
    if (el.scrollLeft >= half) el.scrollLeft -= half;
    if (el.scrollLeft < 0)    el.scrollLeft += half;
  };
  const onMouseUp = () => { isDragging.current = false; setGrabbing(false); };

  const track = [...reviews, ...reviews];

  return (
    <section id="anmeldelser" className="py-24 md:py-32 bg-secondary overflow-hidden">
      <div className="container mb-14">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Google Anmeldelser</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 text-balance">
            Hvad vores <span className="italic text-gold">kunder siger</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-5">
            <StarRating rating={5} />
            <span className="text-sm text-muted-foreground font-light">4.9 ud af 5 · Google Anmeldelser</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />
        <div
          ref={containerRef}
          className={`flex overflow-x-scroll select-none [&::-webkit-scrollbar]:hidden ${grabbing ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ scrollbarWidth: "none" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {track.map((review, i) => (
            <ReviewCard key={`${review.id}-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
