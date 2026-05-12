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
    stats: StatItem[];
  };
  about: {
    ownerName: string;
    intro: string;
    bio1: string;
    bio2: string;
    cert1Title: string;
    cert1Sub: string;
    cert2Title: string;
    cert2Sub: string;
    yearsExp: string;
  };
  services: Service[];
  memberships: MembershipPlan[];
  seo: {
    canonicalBase: string;
    ogImage: string;
    home: SEOPage;
    services: SEOPage;
    booking: SEOPage;
  };
}
