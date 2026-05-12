import { useState } from "react";
import { Star } from "lucide-react";

interface Review {
  id: number;
  author: string;
  initials: string;
  rating: number;
  text: string;
  date: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    author: "Mikkel Hansen",
    initials: "MH",
    rating: 5,
    text: "Fantastisk oplevelse! Wasim er utrolig dygtig og tog sig tid til at forstå præcis, hvad jeg ønskede. Kommer helt sikkert igen.",
    date: "For 2 uger siden",
  },
  {
    id: 2,
    author: "Ahmed Al-Rashidi",
    initials: "AA",
    rating: 5,
    text: "Bedste barber i Sønderborg! Professionel service og et super hyggeligt sted. Klipningen sidder altid perfekt.",
    date: "For 1 måned siden",
  },
  {
    id: 3,
    author: "Jonas Petersen",
    initials: "JP",
    rating: 5,
    text: "Har været her flere gange og er aldrig blevet skuffet. Præcist arbejde og god atmosfære. Stærkt anbefalet!",
    date: "For 3 uger siden",
  },
  {
    id: 4,
    author: "Christoffer Larsen",
    initials: "CL",
    rating: 5,
    text: "Virkelig imponerende håndværk. Wasim ved præcis hvad han laver og resultatet er altid i top. 5 stjerner fortjent!",
    date: "For 2 måneder siden",
  },
  {
    id: 5,
    author: "Rasmus Nielsen",
    initials: "RN",
    rating: 5,
    text: "Kom ind uden aftale og blev taget imod med et smil. Klipningen var perfekt og prisen fair. Super sted!",
    date: "For 1 uge siden",
  },
  {
    id: 6,
    author: "Omar Khalid",
    initials: "OK",
    rating: 5,
    text: "Har gået her i over et år. Altid tilfreds med resultatet. Wasim er en rigtig dygtig barber og et godt menneske.",
    date: "For 3 måneder siden",
  },
];

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
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-gold text-gold" : "fill-muted text-muted"}`}
      />
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
  const [paused, setPaused] = useState(false);
  // Duplicate for seamless infinite loop
  const track = [...REVIEWS, ...REVIEWS];

  return (
    <section id="anmeldelser" className="py-24 md:py-32 bg-secondary overflow-hidden">
      {/* Heading — inside container */}
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

      {/* Full-width carousel track */}
      <div className="relative">
        {/* Edge fade — left */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
        {/* Edge fade — right */}
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />

        <div
          className="flex"
          style={{
            animation: "reviews-marquee 40s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {track.map((review, i) => (
            <ReviewCard key={`${review.id}-${i}`} review={review} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes reviews-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default Reviews;
