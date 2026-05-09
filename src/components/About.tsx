import salonImg from "@/assets/salon-wide.jpg";
import { Award, Scissors } from "lucide-react";

const About = () => {
  return (
    <section id="om" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <div className="relative">
            <img
              src={salonImg}
              alt="A&B Barberlounge2 salon i Sønderborg"
              className="w-full h-[500px] object-cover rounded-sm shadow-elegant"
            />
            <div className="absolute -bottom-6 -right-6 bg-gold text-primary p-6 rounded-sm shadow-elegant hidden md:block">
              <div className="font-serif text-4xl">10+</div>
              <div className="text-xs uppercase tracking-widest">års erfaring</div>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Om os</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-6 text-balance">
              Velkommen til <span className="italic text-gold">A&B Barberlounge2</span>
            </h2>
            <p className="text-muted-foreground font-light text-lg mb-4 leading-relaxed">
              Mit navn er <span className="text-foreground font-medium">Wasim</span>, og jeg er indehaver af A&B Barberlounge2 i Sønderborg.
            </p>
            <p className="text-muted-foreground font-light leading-relaxed mb-4">
              Jeg er uddannet frisør fra Damaskus og har over 10 års erfaring i branchen. Jeg har desuden et certificeret herrefrisørkursus fra Københavns Professionshøjskole, hvilket sikrer moderne teknikker og høj faglig kvalitet.
            </p>
            <p className="text-muted-foreground font-light leading-relaxed mb-8">
              Hos os får du en skarp klipning og professionel skægtrimning i rolige omgivelser med fokus på kvalitet og detaljer.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 border border-border rounded-sm">
                <Award className="w-6 h-6 text-gold mb-3" strokeWidth={1.5} />
                <div className="font-serif text-lg">Certificeret</div>
                <div className="text-xs text-muted-foreground">Københavns Professionshøjskole</div>
              </div>
              <div className="p-5 border border-border rounded-sm">
                <Scissors className="w-6 h-6 text-gold mb-3" strokeWidth={1.5} />
                <div className="font-serif text-lg">Uddannet</div>
                <div className="text-xs text-muted-foreground">Frisør fra Damaskus</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
