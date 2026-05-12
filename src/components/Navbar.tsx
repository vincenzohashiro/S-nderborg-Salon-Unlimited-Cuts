import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";

const links = [
  { href: "/", label: "Forside" },
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Book tid" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { general } = useSiteConfig();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = pathname === "/" && !scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        transparent ? "bg-transparent py-4" : "bg-background/95 backdrop-blur-md shadow-soft py-2"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className={`font-serif text-xl md:text-2xl leading-tight tracking-tight ${transparent ? "text-background" : "text-foreground"}`}>
            {general.businessName.split(" ")[0]} <span className="text-gold italic">{general.businessName.split(" ").slice(1).join(" ")}</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`text-sm uppercase tracking-widest transition-colors hover:text-gold ${
                transparent ? "text-background/90" : "text-foreground"
              } ${pathname === l.href ? "text-gold" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <Button variant="gold" size="sm" asChild>
            <Link to="/booking">Book nu</Link>
          </Button>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className={transparent ? "text-background" : "text-foreground"} /> : <Menu className={transparent ? "text-background" : "text-foreground"} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="container py-6 flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-foreground hover:text-gold">
                {l.label}
              </Link>
            ))}
            <Button variant="gold" asChild>
              <Link to="/booking" onClick={() => setOpen(false)}>Book nu</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
