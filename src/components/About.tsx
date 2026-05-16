import salonImgFallback from "@/assets/salon-wide.jpg";
import { Award, Scissors } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const resolveImg = (url: string) =>
  url.startsWith("http") ? url : `${base}/${url.replace(/^\//, "")}`;

const About = () => {
  const { about, images } = useSiteConfig();
  const salonImg = images?.about ? resolveImg(images.about) : salonImgFallback;

  return (
    <section id="om" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="relative">
            <img
              src={salonImg}
              alt="A&B Barberlounge2 salon i Sønderborg"
              className="w-full h-[500px] object-cover rounded-sm shadow-elegant"
            />
            <div className="absolute -bottom-6 -right-6 bg-gold text-primary p-6 rounded-sm shadow-elegant hidden md:block">
              <div className="font-serif text-4xl">{about.yearsExp}</div>
              <div className="text-xs uppercase tracking-widest">{about.yearsLabel}</div>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">{about.badge}</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6 text-balance">
              {about.welcomePrefix} <span className="italic text-gold">{about.nameDisplay}</span>
            </h2>
            <p className="text-muted-foreground font-light text-lg mb-4 leading-relaxed">
              {about.introPrefix} <span className="text-foreground font-medium">{about.ownerName}</span>, {about.intro}
            </p>
            <p className="text-muted-foreground font-light leading-relaxed mb-4">{about.bio1}</p>
            <p className="text-muted-foreground font-light leading-relaxed mb-8">{about.bio2}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 border border-border rounded-sm">
                <Award className="w-6 h-6 text-gold mb-3" strokeWidth={1.5} />
                <div className="font-serif text-lg">{about.cert1Title}</div>
                <div className="text-xs text-muted-foreground">{about.cert1Sub}</div>
              </div>
              <div className="p-5 border border-border rounded-sm">
                <Scissors className="w-6 h-6 text-gold mb-3" strokeWidth={1.5} />
                <div className="font-serif text-lg">{about.cert2Title}</div>
                <div className="text-xs text-muted-foreground">{about.cert2Sub}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
