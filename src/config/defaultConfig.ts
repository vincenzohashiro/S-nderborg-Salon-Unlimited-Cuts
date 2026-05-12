import type { SiteConfig } from "@/types/site-config";

export const defaultConfig: SiteConfig = {
  general: {
    businessName: "A&B Barber Lounge 2",
    phone: "+45 91 75 24 70",
    address: "Perlegade 64, Sønderborg",
    hours: "Man–Lør: 09–18 · Søn: lukket",
    planwayUrl: "https://ab-barberlounge2.planway.com",
    instagram: "https://instagram.com/ab_barberlounge2",
    facebook: "https://facebook.com/ab_barberlounge2",
  },
  hero: {
    badge: "Nyåbnet · Sønderborg",
    headline1: "A&B Barber Lounge 2",
    headline2: "Klip uden grænser.",
    subtext:
      "Ubegrænset klip fra 499 kr/md — eller klip & skæg for 599 kr/md. Drop-in eller book online.",
    stats: [
      { value: "499", label: "kr/md klip" },
      { value: "599", label: "kr/md klip & skæg" },
      { value: "10+", label: "års erfaring" },
    ],
  },
  about: {
    ownerName: "Wasim",
    intro: "og jeg er indehaver af A&B Barberlounge2 i Sønderborg.",
    bio1: "Jeg er uddannet frisør fra Damaskus og har over 10 års erfaring i branchen. Jeg har desuden et certificeret herrefrisørkursus fra Københavns Professionshøjskole, hvilket sikrer moderne teknikker og høj faglig kvalitet.",
    bio2: "Hos os får du en skarp klipning og professionel skægtrimning i rolige omgivelser med fokus på kvalitet og detaljer.",
    cert1Title: "Certificeret",
    cert1Sub: "Københavns Professionshøjskole",
    cert2Title: "Uddannet",
    cert2Sub: "Frisør fra Damaskus",
    yearsExp: "10+",
  },
  services: [
    { id: "1", icon: "scissors", title: "Herreklip", price: "200 kr", time: "30 min", desc: "Klassisk eller moderne klipning, vask og styling inkluderet." },
    { id: "2", icon: "user", title: "Skægtrim", price: "149 kr", time: "20 min", desc: "Præcis trimning og formgivning af dit skæg." },
    { id: "3", icon: "flame", title: "Varm Barbering", price: "199 kr", time: "25 min", desc: "Klassisk barbering med varmt håndklæde og barberkniv." },
    { id: "4", icon: "sparkles", title: "Klip + Skæg", price: "349 kr", time: "45 min", desc: "Den komplette pakke — klipning og fuld skægbehandling." },
    { id: "5", icon: "crown", title: "Den Royale", price: "499 kr", time: "60 min", desc: "Klip, skæg, ansigtsmaske og massage. Vores signaturoplevelse." },
    { id: "6", icon: "baby", title: "Børneklip (0–12)", price: "179 kr", time: "20 min", desc: "Tålmodig klipning for de små i en rolig stol." },
    { id: "7", icon: "droplet", title: "Hårfarve", price: "fra 299 kr", time: "30 min", desc: "Dækning af grå hår eller fuld farveændring." },
    { id: "8", icon: "gift", title: "Gavekort", price: "valgfrit", time: "—", desc: "Den perfekte gave til ham. Fås i alle beløb." },
  ],
  memberships: [
    {
      id: "1",
      name: "Klip Medlemskab",
      price: "499",
      tagline: "Ubegrænset herreklip hver måned.",
      perks: [
        "Ubegrænset antal klipninger",
        "Drop-in eller online booking",
        "Også samme dag",
        "Ingen binding — opsig når du vil",
      ],
      cta: "Vælg Klip 499",
      highlight: false,
    },
    {
      id: "2",
      name: "Klip & Skæg Medlemskab",
      price: "599",
      tagline: "Klip + skæg og skægtrimning ubegrænset.",
      perks: [
        "Ubegrænset herreklip",
        "Ubegrænset skæg & skægtrim",
        "Drop-in eller online booking",
        "10% rabat på produkter",
        "Ingen binding — opsig når du vil",
      ],
      cta: "Vælg Klip & Skæg 599",
      highlight: true,
    },
  ],
  seo: {
    canonicalBase: "https://ab-barberlounge2.dk",
    ogImage: "https://ab-barberlounge2.dk/og-image.jpg",
    home: {
      title: "A&B Barber Lounge 2 Sønderborg — Ubegrænset klip 499 kr/md",
      description: "A&B Barber Lounge 2 i Sønderborg. Ubegrænset herreklip fra 499 kr/md eller klip & skæg for 599 kr/md. Drop-in eller online booking. Perlegade 64. Ring 91 75 24 70.",
    },
    services: {
      title: "Services & Priser — A&B Barber Lounge 2 Sønderborg",
      description: "Se alle vores barbertjenester og priser. Herreklip fra 200 kr, skægtrimning, varm barbering og mere. Bliv medlem og få ubegrænset klip fra 499 kr/md.",
    },
    booking: {
      title: "Book tid — A&B Barber Lounge 2 Sønderborg",
      description: "Book din tid online hos A&B Barber Lounge 2 i Sønderborg. Hurtig og nem booking via Planway. Drop-in velkommen man–lør 09–18.",
    },
  },
};
