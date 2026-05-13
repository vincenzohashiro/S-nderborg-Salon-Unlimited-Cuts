import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (location.pathname === "/settings") return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Tilbage til toppen"
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gold text-primary shadow-gold flex items-center justify-center transition-all duration-300 hover:scale-110 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTopButton;
