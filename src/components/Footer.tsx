import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-primary text-background/70 py-12">
    <div className="container">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="font-serif text-xl text-background">
            A&B <span className="text-gold italic">Barberlounge2</span>
          </div>
        </Link>
        <div className="flex gap-8 text-xs uppercase tracking-widest">
          <Link to="/" className="hover:text-gold">Forside</Link>
          <Link to="/services" className="hover:text-gold">Services</Link>
          <Link to="/booking" className="hover:text-gold">Book tid</Link>
        </div>
        <p className="text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} A&B Barberlounge2 · Perlegade 64, Sønderborg
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
