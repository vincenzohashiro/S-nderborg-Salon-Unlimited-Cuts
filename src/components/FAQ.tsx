import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";

const FAQ = () => {
  const { faq, faqSection } = useSiteConfig();
  const items = faq ?? [];
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id));

  if (items.length === 0) return null;

  return (
    <section id="faq" className="py-24 md:py-32 overflow-hidden">
      <div className="container max-w-3xl">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{faqSection.badge}</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 text-balance">{faqSection.heading}</h2>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const isOpen = open === item.id;
            return (
              <div
                key={item.id}
                className={`border rounded-sm transition-colors duration-200 ${
                  isOpen ? "border-gold/40 bg-secondary" : "border-border bg-secondary/50 hover:border-gold/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base md:text-lg leading-snug">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    strokeWidth={1.5}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="px-6 pb-6 text-muted-foreground font-light leading-relaxed text-sm md:text-base">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
