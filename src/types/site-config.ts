export interface StatItem {
  value: string;
  label: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  price: string;
  time: string;
  desc: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  tagline: string;
  perks: string[];
  cta: string;
  highlight: boolean;
}

export interface SEOPage {
  title: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  initials: string;
  avatarUrl?: string;
  rating: number;
  text: string;
  date: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteConfig {
  general: {
    businessName: string;
    phone: string;
    address: string;
    hours: string;
    planwayUrl: string;
    instagram: string;
    facebook: string;
  };
  hero: {
    badge: string;
    headline1: string;
    headline2: string;
    subtext: string;
    ctaBook: string;
    stats: StatItem[];
  };
  about: {
    badge: string;
    welcomePrefix: string;
    nameDisplay: string;
    introPrefix: string;
    ownerName: string;
    intro: string;
    bio1: string;
    bio2: string;
    cert1Title: string;
    cert1Sub: string;
    cert2Title: string;
    cert2Sub: string;
    yearsExp: string;
    yearsLabel: string;
  };
  offer: {
    badge: string;
    heading1: string;
    heading2: string;
    subtext: string;
    smallPrint: string;
  };
  servicesSection: {
    badge: string;
    heading: string;
    body: string;
    cta: string;
  };
  gallery: {
    badge: string;
    heading: string;
    images: { id: string; url: string; alt: string }[];
  };
  contact: {
    badge: string;
    heading: string;
    body: string;
    cardHeading: string;
    cardBody: string;
    cardCta: string;
  };
  pages: {
    services: {
      badge: string;
      heading1: string;
      heading2: string;
      subtext: string;
    };
    booking: {
      badge: string;
      heading1: string;
      heading2: string;
      subtext: string;
      iframeHeading: string;
      iframeSubtext: string;
      iframeCta: string;
    };
  };
  faqSection: {
    badge: string;
    heading: string;
  };
  services: Service[];
  memberships: MembershipPlan[];
  reviews: Review[];
  faq: FaqItem[];
  seo: {
    canonicalBase: string;
    ogImage: string;
    home: SEOPage;
    services: SEOPage;
    booking: SEOPage;
  };
}
