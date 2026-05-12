import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultConfig } from "@/config/defaultConfig";
import type { SiteConfig, Service, MembershipPlan, SEOPage } from "@/types/site-config";
import {
  ArrowLeft, Plus, Trash2, Eye, EyeOff, CheckCircle, XCircle,
  Loader2, Settings as SettingsIcon, LogOut, Monitor, Check,
  Globe, Phone, MapPin, Clock, Instagram, Facebook, Search,
} from "lucide-react";

const REPO_OWNER = "vincenzohashiro";
const REPO_NAME = "S-nderborg-Salon-Unlimited-Cuts";
const CONFIG_PATH = "public/site-config.json";
const toBase64 = (s: string) => btoa(unescape(encodeURIComponent(s)));

type Tab = "general" | "hero" | "about" | "services" | "memberships" | "seo" | "publish";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "general", label: "Generelt", icon: "🏠" },
  { id: "hero", label: "Forside", icon: "✨" },
  { id: "about", label: "Om os", icon: "👤" },
  { id: "services", label: "Tjenester", icon: "✂️" },
  { id: "memberships", label: "Medlemskaber", icon: "⭐" },
  { id: "seo", label: "SEO", icon: "🔍" },
  { id: "publish", label: "Udgiv", icon: "🚀" },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-1.5 leading-relaxed">{hint}</p>}
    {children}
  </div>
);

const CharCount = ({ text, min, max }: { text: string; min: number; max: number }) => {
  const n = text.length;
  const color = n >= min && n <= max ? "text-green-600" : n > max ? "text-red-500" : "text-amber-500";
  const label = n >= min && n <= max ? "Optimal" : n > max ? "For lang" : "For kort";
  return (
    <div className={`flex items-center gap-1.5 mt-1 text-xs ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${color.replace("text-", "bg-")}`} />
      <span>{n} tegn · {label} ({min}–{max})</span>
    </div>
  );
};

// ── Preview components ─────────────────────────────────────────────────────

const BrowserFrame = ({ url, children }: { url: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
    <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-3 border-b border-gray-200">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>
      <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-500 flex items-center gap-1.5 border border-gray-200">
        <Globe className="w-3 h-3" /> {url}
      </div>
    </div>
    <div className="overflow-y-auto max-h-[calc(100vh-220px)]">{children}</div>
  </div>
);

const GooglePreview = ({ page, config }: { page: SEOPage; config: SiteConfig }) => {
  const domain = config.seo.canonicalBase.replace(/^https?:\/\//, "");
  const title = page.title || "Ingen titel endnu";
  const desc = page.description || "Ingen beskrivelse endnu";
  const truncTitle = title.length > 60 ? title.slice(0, 57) + "…" : title;
  const truncDesc = desc.length > 160 ? desc.slice(0, 157) + "…" : desc;

  return (
    <div className="p-6 bg-white">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
        <Search className="w-3 h-3" /> Google Søgeresultat Preview
      </p>
      <div className="font-sans max-w-lg">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-[#1a73e8] text-white text-[8px] flex items-center justify-center font-bold">A</div>
          <div>
            <div className="text-xs text-gray-800 leading-none">{config.general.businessName}</div>
            <div className="text-xs text-gray-500 leading-none">{domain} › ...</div>
          </div>
        </div>
        <h3 className="text-[#1a0dab] text-lg leading-tight hover:underline cursor-pointer mb-0.5">{truncTitle}</h3>
        <p className="text-sm text-gray-600 leading-snug">{truncDesc}</p>
      </div>
    </div>
  );
};

const SocialPreview = ({ page, config }: { page: SEOPage; config: SiteConfig }) => {
  const domain = config.seo.canonicalBase.replace(/^https?:\/\//, "");
  return (
    <div className="p-6 pt-2 bg-white">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
        <Facebook className="w-3 h-3" /> Social Share Preview
      </p>
      <div className="border border-gray-200 rounded-lg overflow-hidden max-w-sm font-sans">
        <div className="aspect-[1.91/1] bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white/40 text-xs">
          {config.seo.ogImage ? (
            <img src={config.seo.ogImage} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : "OG billede (1200×630)"}
        </div>
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <div className="text-xs text-gray-500 uppercase mb-1">{domain}</div>
          <div className="text-sm font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">{page.title}</div>
          <div className="text-xs text-gray-500 line-clamp-2">{page.description}</div>
        </div>
      </div>
    </div>
  );
};

const HeroPreview = ({ config }: { config: SiteConfig }) => (
  <div className="bg-gray-900 p-8 text-white text-center min-h-64 flex flex-col justify-center">
    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-yellow-500/40 bg-white/5 mx-auto">
      <MapPin className="w-3 h-3 text-yellow-400" />
      <span className="text-[10px] uppercase tracking-widest">{config.hero.badge}</span>
    </div>
    <h1 className="font-serif text-2xl font-bold mb-1">{config.hero.headline1}</h1>
    <h2 className="font-serif text-2xl italic text-yellow-400 mb-3">{config.hero.headline2}</h2>
    <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed mb-6">{config.hero.subtext}</p>
    <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
      {config.hero.stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="font-serif text-lg text-yellow-400">{s.value}</div>
          <div className="text-[9px] uppercase tracking-widest text-white/50">{s.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const AboutPreview = ({ config }: { config: SiteConfig }) => (
  <div className="p-6 bg-white">
    <div className="text-xs uppercase tracking-widest text-yellow-600 mb-2">Om os</div>
    <h2 className="font-serif text-xl mb-3">
      Velkommen til <span className="italic text-yellow-600">A&B Barberlounge2</span>
    </h2>
    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
      Mit navn er <strong>{config.about.ownerName}</strong>, {config.about.intro}
    </p>
    <p className="text-xs text-gray-500 leading-relaxed mb-2">{config.about.bio1}</p>
    <p className="text-xs text-gray-500 leading-relaxed mb-4">{config.about.bio2}</p>
    <div className="grid grid-cols-2 gap-3">
      {[
        { title: config.about.cert1Title, sub: config.about.cert1Sub },
        { title: config.about.cert2Title, sub: config.about.cert2Sub },
      ].map((c) => (
        <div key={c.title} className="p-3 border border-gray-200 rounded-sm">
          <div className="text-sm font-medium">{c.title}</div>
          <div className="text-xs text-gray-400">{c.sub}</div>
        </div>
      ))}
    </div>
  </div>
);

const ServicesPreview = ({ config }: { config: SiteConfig }) => (
  <div className="p-6 bg-gray-50">
    <div className="text-xs uppercase tracking-widest text-yellow-600 mb-3">Tjenester — forside</div>
    <div className="grid grid-cols-2 gap-3">
      {config.services.slice(0, 4).map((s) => (
        <div key={s.id} className="p-3 bg-white border border-gray-200 rounded-sm">
          <div className="text-sm font-serif font-medium mb-0.5">{s.title}</div>
          <div className="text-xs text-yellow-600 mb-1">{s.price}</div>
          <div className="text-xs text-gray-400 leading-snug">{s.desc}</div>
        </div>
      ))}
    </div>
    {config.services.length > 4 && (
      <p className="text-xs text-gray-400 mt-3 text-center">+ {config.services.length - 4} tjenester mere på servicessiden</p>
    )}
  </div>
);

const MembershipsPreview = ({ config }: { config: SiteConfig }) => (
  <div className="p-6 bg-gray-900">
    <div className="text-xs uppercase tracking-widest text-yellow-400 mb-4 text-center">Medlemskaber</div>
    <div className="grid grid-cols-2 gap-3">
      {config.memberships.map((m) => (
        <div
          key={m.id}
          className={`p-4 rounded-sm border text-white ${m.highlight ? "border-yellow-400 bg-white/10" : "border-white/20 bg-white/5"}`}
        >
          {m.highlight && <div className="text-[9px] text-yellow-400 uppercase tracking-widest mb-2">Mest populær</div>}
          <div className="text-xs text-yellow-400 mb-1">{m.name}</div>
          <div className="font-serif text-2xl text-white mb-1">{m.price} <span className="text-sm text-white/50">kr/md</span></div>
          <p className="text-[10px] text-white/60 mb-2">{m.tagline}</p>
          <ul className="space-y-1">
            {m.perks.slice(0, 3).map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-[10px] text-white/80">
                <Check className="w-2.5 h-2.5 text-yellow-400 mt-0.5 flex-shrink-0" />
                {p}
              </li>
            ))}
            {m.perks.length > 3 && <li className="text-[10px] text-white/40">+{m.perks.length - 3} mere…</li>}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const GeneralPreview = ({ config }: { config: SiteConfig }) => (
  <div className="p-6 bg-white space-y-5">
    <div>
      <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">Kontakt info</div>
      <div className="space-y-3">
        {[
          { icon: Phone, label: config.general.phone },
          { icon: MapPin, label: config.general.address },
          { icon: Clock, label: config.general.hours },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-3.5 h-3.5 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
    <div>
      <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Sociale medier</div>
      <div className="flex gap-2">
        {[{ icon: Instagram, label: "Instagram" }, { icon: Facebook, label: "Facebook" }].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600">
            <s.icon className="w-3 h-3" /> {s.label}
          </div>
        ))}
      </div>
    </div>
    <div>
      <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Navbar preview</div>
      <div className="bg-gray-900 rounded px-4 py-2 flex items-center justify-between">
        <span className="text-white text-sm font-serif">{config.general.businessName}</span>
        <div className="flex gap-4 items-center">
          {["Forside", "Services", "Book tid"].map((l) => (
            <span key={l} className="text-white/60 text-xs">{l}</span>
          ))}
          <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded font-medium">Book nu</span>
        </div>
      </div>
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────

export default function Settings() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [seoPage, setSeoPage] = useState<"home" | "services" | "booking">("home");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [publishStatus, setPublishStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [publishMsg, setPublishMsg] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("ab_admin") === "1") setAuthed(true);
    const t = localStorage.getItem("ab_gh_token");
    if (t) setToken(t);
    fetch(`${import.meta.env.BASE_URL}site-config.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: SiteConfig) => setConfig(d))
      .catch(() => setConfig(defaultConfig));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = localStorage.getItem("ab_admin_pw") || "abbarber2";
    if (pw === saved) {
      sessionStorage.setItem("ab_admin", "1");
      setAuthed(true);
    } else {
      setPw("");
      alert("Forkert adgangskode.\n\nStandard: abbarber2");
    }
  };

  const handlePublish = useCallback(async () => {
    if (!token.trim()) { alert("Indtast dit GitHub Personal Access Token."); return; }
    setPublishStatus("loading");
    setPublishMsg("");
    localStorage.setItem("ab_gh_token", token);
    try {
      const getRes = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONFIG_PATH}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
      );
      if (!getRes.ok) throw new Error(`GitHub fejl ${getRes.status} — tjek dit token.`);
      const getJson = await getRes.json();
      const putRes = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONFIG_PATH}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/vnd.github+json" },
          body: JSON.stringify({ message: "Update site config via admin", content: toBase64(JSON.stringify(config, null, 2)), sha: getJson.sha }),
        }
      );
      if (!putRes.ok) {
        const e = await putRes.json().catch(() => ({}));
        throw new Error((e as { message?: string }).message || `HTTP ${putRes.status}`);
      }
      setPublishStatus("success");
      setPublishMsg("Ændringer udgivet! Siden opdateres om ca. 2 minutter.");
    } catch (err) {
      setPublishStatus("error");
      setPublishMsg(err instanceof Error ? err.message : "Ukendt fejl.");
    }
  }, [token, config]);

  // Updaters
  const upG = (k: keyof SiteConfig["general"], v: string) => setConfig((c) => ({ ...c, general: { ...c.general, [k]: v } }));
  const upH = (k: keyof SiteConfig["hero"], v: unknown) => setConfig((c) => ({ ...c, hero: { ...c.hero, [k]: v } }));
  const upStat = (i: number, f: "value" | "label", v: string) =>
    setConfig((c) => ({ ...c, hero: { ...c.hero, stats: c.hero.stats.map((s, idx) => idx === i ? { ...s, [f]: v } : s) } }));
  const upA = (k: keyof SiteConfig["about"], v: string) => setConfig((c) => ({ ...c, about: { ...c.about, [k]: v } }));
  const upSvc = (id: string, f: keyof Service, v: string) =>
    setConfig((c) => ({ ...c, services: c.services.map((s) => s.id === id ? { ...s, [f]: v } : s) }));
  const addSvc = () => setConfig((c) => ({ ...c, services: [...c.services, { id: crypto.randomUUID(), icon: "scissors", title: "Ny tjeneste", price: "0 kr", time: "30 min", desc: "" }] }));
  const rmSvc = (id: string) => setConfig((c) => ({ ...c, services: c.services.filter((s) => s.id !== id) }));
  const upM = (id: string, f: keyof MembershipPlan, v: unknown) =>
    setConfig((c) => ({ ...c, memberships: c.memberships.map((m) => m.id === id ? { ...m, [f]: v } : m) }));
  const upPerks = (id: string, text: string) => upM(id, "perks", text.split("\n").filter(Boolean));
  const upSEO = (page: "home" | "services" | "booking", f: keyof SEOPage, v: string) =>
    setConfig((c) => ({ ...c, seo: { ...c.seo, [page]: { ...c.seo[page], [f]: v } } }));
  const upSEORoot = (k: "canonicalBase" | "ogImage", v: string) =>
    setConfig((c) => ({ ...c, seo: { ...c.seo, [k]: v } }));

  // ── Login ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="font-serif text-lg font-semibold">A&B Admin</div>
              <div className="text-xs text-gray-400">Hjemmeside editor</div>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adgangskode</label>
              <div className="relative">
                <Input type={showPw ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" autoFocus className="pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button variant="gold" className="w-full" type="submit">Log ind</Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Tilbage til hjemmesiden
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Preview content per tab ─────────────────────────────────────────────
  const previewUrl = "ab-barberlounge2.dk" + (activeTab === "seo" ? (seoPage === "home" ? "" : `/${seoPage}`) : "");

  const PreviewContent = () => {
    if (activeTab === "general") return <GeneralPreview config={config} />;
    if (activeTab === "hero") return <HeroPreview config={config} />;
    if (activeTab === "about") return <AboutPreview config={config} />;
    if (activeTab === "services") return <ServicesPreview config={config} />;
    if (activeTab === "memberships") return <MembershipsPreview config={config} />;
    if (activeTab === "seo") return (
      <>
        <GooglePreview page={config.seo[seoPage]} config={config} />
        <div className="h-px bg-gray-100 mx-6" />
        <SocialPreview page={config.seo[seoPage]} config={config} />
      </>
    );
    return (
      <div className="p-8 text-center text-gray-400">
        <div className="text-4xl mb-3">🚀</div>
        <p className="text-sm">Klik "Udgiv ændringer" i panelet til venstre for at gøre ændringerne permanente.</p>
      </div>
    );
  };

  // ── Form content per tab ────────────────────────────────────────────────
  const FormContent = () => {
    if (activeTab === "general") return (
      <div className="space-y-0">
        <Field label="Forretningsnavn">
          <Input value={config.general.businessName} onChange={(e) => upG("businessName", e.target.value)} />
        </Field>
        <Field label="Telefonnummer">
          <Input value={config.general.phone} onChange={(e) => upG("phone", e.target.value)} />
        </Field>
        <Field label="Adresse">
          <Input value={config.general.address} onChange={(e) => upG("address", e.target.value)} />
        </Field>
        <Field label="Åbningstider">
          <Input value={config.general.hours} onChange={(e) => upG("hours", e.target.value)} />
        </Field>
        <Field label="Planway booking-URL" hint="URL til dit online bookingsystem">
          <Input value={config.general.planwayUrl} onChange={(e) => upG("planwayUrl", e.target.value)} />
        </Field>
        <Field label="Instagram-URL">
          <Input value={config.general.instagram} onChange={(e) => upG("instagram", e.target.value)} />
        </Field>
        <Field label="Facebook-URL">
          <Input value={config.general.facebook} onChange={(e) => upG("facebook", e.target.value)} />
        </Field>
        <div className="border-t border-gray-100 pt-4 mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Skift adgangskode</p>
          <div className="flex gap-2">
            <Input type="password" placeholder="Ny adgangskode" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
            <Button variant="outline" size="sm" onClick={() => { if (newPw.length >= 4) { localStorage.setItem("ab_admin_pw", newPw); setNewPw(""); alert("Gemt!"); } else alert("Min. 4 tegn"); }}>Gem</Button>
          </div>
        </div>
      </div>
    );

    if (activeTab === "hero") return (
      <div>
        <Field label="Badge-tekst" hint='Lille tekst øverst i hero-sektionen'>
          <Input value={config.hero.badge} onChange={(e) => upH("badge", e.target.value)} />
        </Field>
        <Field label="Overskrift — linje 1">
          <Input value={config.hero.headline1} onChange={(e) => upH("headline1", e.target.value)} />
        </Field>
        <Field label="Overskrift — linje 2 (guld, kursiv)">
          <Input value={config.hero.headline2} onChange={(e) => upH("headline2", e.target.value)} />
        </Field>
        <Field label="Undertekst">
          <Textarea value={config.hero.subtext} onChange={(e) => upH("subtext", e.target.value)} rows={3} />
        </Field>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 mt-2">Statistikker</p>
        {config.hero.stats.map((s, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Tal {i + 1}</label>
              <Input value={s.value} onChange={(e) => upStat(i, "value", e.target.value)} placeholder="499" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Etiket {i + 1}</label>
              <Input value={s.label} onChange={(e) => upStat(i, "label", e.target.value)} placeholder="kr/md klip" />
            </div>
          </div>
        ))}
      </div>
    );

    if (activeTab === "about") return (
      <div>
        <Field label="Ejerens navn">
          <Input value={config.about.ownerName} onChange={(e) => upA("ownerName", e.target.value)} />
        </Field>
        <Field label="Intro-sætning" hint='Vises efter "Mit navn er [navn],"'>
          <Input value={config.about.intro} onChange={(e) => upA("intro", e.target.value)} />
        </Field>
        <Field label="Biografi — afsnit 1">
          <Textarea value={config.about.bio1} onChange={(e) => upA("bio1", e.target.value)} rows={4} />
        </Field>
        <Field label="Biografi — afsnit 2">
          <Textarea value={config.about.bio2} onChange={(e) => upA("bio2", e.target.value)} rows={3} />
        </Field>
        <Field label="Års erfaring (på billedet)">
          <Input value={config.about.yearsExp} onChange={(e) => upA("yearsExp", e.target.value)} className="max-w-24" />
        </Field>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 mt-2">Kvalifikationskort</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Kort 1 — Titel</label>
            <Input value={config.about.cert1Title} onChange={(e) => upA("cert1Title", e.target.value)} className="mb-2" />
            <label className="text-xs text-gray-400 block mb-1">Kort 1 — Undertitel</label>
            <Input value={config.about.cert1Sub} onChange={(e) => upA("cert1Sub", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Kort 2 — Titel</label>
            <Input value={config.about.cert2Title} onChange={(e) => upA("cert2Title", e.target.value)} className="mb-2" />
            <label className="text-xs text-gray-400 block mb-1">Kort 2 — Undertitel</label>
            <Input value={config.about.cert2Sub} onChange={(e) => upA("cert2Sub", e.target.value)} />
          </div>
        </div>
      </div>
    );

    if (activeTab === "services") return (
      <div>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          De første 4 tjenester vises på forsiden. Alle vises på servicessiden.
        </p>
        <div className="space-y-3">
          {config.services.map((s, idx) => (
            <div key={s.id} className={`border rounded-lg p-3 ${idx < 4 ? "border-yellow-200 bg-yellow-50/50" : "border-gray-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">
                  {idx < 4 ? `⭐ Forside #${idx + 1}` : `Tjeneste ${idx + 1}`}
                </span>
                <button onClick={() => rmSvc(s.id)} className="text-red-400 hover:text-red-600 p-0.5">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Navn</label>
                  <Input value={s.title} onChange={(e) => upSvc(s.id, "title", e.target.value)} className="h-8 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Pris</label>
                  <Input value={s.price} onChange={(e) => upSvc(s.id, "price", e.target.value)} className="h-8 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Tid</label>
                  <Input value={s.time} onChange={(e) => upSvc(s.id, "time", e.target.value)} className="h-8 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Beskrivelse</label>
                  <Input value={s.desc} onChange={(e) => upSvc(s.id, "desc", e.target.value)} className="h-8 text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={addSvc} className="w-full mt-3">
          <Plus className="w-3.5 h-3.5 mr-1" /> Tilføj tjeneste
        </Button>
      </div>
    );

    if (activeTab === "memberships") return (
      <div className="space-y-6">
        {config.memberships.map((m) => (
          <div key={m.id} className={`border rounded-lg p-4 ${m.highlight ? "border-yellow-300 bg-yellow-50/50" : "border-gray-200"}`}>
            <div className="flex items-center gap-2 mb-3">
              {m.highlight && <span className="text-[10px] bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full font-medium">Mest populær</span>}
              <span className="text-sm font-medium text-gray-700">{m.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Navn</label>
                <Input value={m.name} onChange={(e) => upM(m.id, "name", e.target.value)} className="h-8 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Pris (kun tal)</label>
                <Input value={m.price} onChange={(e) => upM(m.id, "price", e.target.value)} className="h-8 text-sm" placeholder="499" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400 block mb-1">Slogan</label>
                <Input value={m.tagline} onChange={(e) => upM(m.id, "tagline", e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400 block mb-1">Knaptekst</label>
                <Input value={m.cta} onChange={(e) => upM(m.id, "cta", e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400 block mb-1">Fordele — én per linje</label>
                <Textarea value={m.perks.join("\n")} onChange={(e) => upPerks(m.id, e.target.value)} rows={m.perks.length + 1} className="text-sm font-mono" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    if (activeTab === "seo") return (
      <div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-5">
          {(["home", "services", "booking"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSeoPage(p)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${seoPage === p ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
            >
              {p === "home" ? "Forside" : p === "services" ? "Services" : "Booking"}
            </button>
          ))}
        </div>

        <Field label="Sidetitel (Title tag)" hint="Vises i Google-resultater og browser-fanen. Optimal: 30–60 tegn.">
          <Input value={config.seo[seoPage].title} onChange={(e) => upSEO(seoPage, "title", e.target.value)} />
          <CharCount text={config.seo[seoPage].title} min={30} max={60} />
        </Field>

        <Field label="Meta-beskrivelse" hint="Vises under titlen i Google. Optimal: 120–160 tegn.">
          <Textarea value={config.seo[seoPage].description} onChange={(e) => upSEO(seoPage, "description", e.target.value)} rows={4} />
          <CharCount text={config.seo[seoPage].description} min={120} max={160} />
        </Field>

        <div className="border-t border-gray-100 pt-4 mt-2 space-y-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Generelle SEO-indstillinger</p>
          <Field label="Canonical URL (din primære domæne)" hint="Bruges til at fortælle Google hvad din rigtige URL er.">
            <Input value={config.seo.canonicalBase} onChange={(e) => upSEORoot("canonicalBase", e.target.value)} placeholder="https://ab-barberlounge2.dk" />
          </Field>
          <Field label="OG-billede URL" hint="Billede vist på Facebook/Instagram ved deling. Anbefalet størrelse: 1200×630 px.">
            <Input value={config.seo.ogImage} onChange={(e) => upSEORoot("ogImage", e.target.value)} placeholder="https://ab-barberlounge2.dk/og-image.jpg" />
          </Field>
        </div>
      </div>
    );

    return (
      <div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5 text-sm text-blue-800">
          <p className="font-medium mb-1">Sådan fungerer udgivelse:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-700 text-xs">
            <li>Rediger indhold i fanerne til venstre</li>
            <li>Bekræft ændringerne i preview-panelet</li>
            <li>Klik "Udgiv ændringer" her</li>
            <li>Siden genopbygges automatisk (~2 min)</li>
          </ol>
        </div>

        <Field label="GitHub Personal Access Token" hint="Opret token på: github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens. Giv adgang til repository S-nderborg-Salon-Unlimited-Cuts med tilladelsen Contents: Read and write.">
          <div className="relative">
            <Input type={showToken ? "text" : "password"} value={token} onChange={(e) => setToken(e.target.value)} placeholder="github_pat_..." className="pr-10 font-mono text-sm" />
            <button type="button" onClick={() => setShowToken(!showToken)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        <Button variant="gold" size="lg" onClick={handlePublish} disabled={publishStatus === "loading"} className="w-full">
          {publishStatus === "loading" ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Udgiver...</> : "🚀 Udgiv ændringer"}
        </Button>

        {publishStatus === "success" && (
          <div className="flex items-start gap-2 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{publishMsg}</span>
          </div>
        )}
        {publishStatus === "error" && (
          <div className="flex items-start gap-2 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div><p className="font-medium mb-0.5">Udgivelse fejlede</p><p className="text-xs">{publishMsg}</p></div>
          </div>
        )}
      </div>
    );
  };

  // ── Main admin UI ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between flex-shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-4 h-4 text-gray-900" />
          </div>
          <div>
            <span className="font-semibold text-sm">A&B Admin</span>
            <span className="text-gray-400 text-xs ml-2 hidden sm:inline">Hjemmeside editor</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${showPreview ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showPreview ? "Skjul" : "Vis"} preview</span>
          </button>
          <Link to="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> <span className="hidden sm:inline">Se siden</span>
          </Link>
          <button onClick={() => { sessionStorage.removeItem("ab_admin"); setAuthed(false); }} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
            <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Log ud</span>
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 overflow-x-auto">
        <div className="flex min-w-max">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-sm flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? "border-yellow-500 text-gray-900 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{t.icon}</span> {t.label}
              {t.id === "publish" && publishStatus === "idle" && (
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Settings panel */}
        <div className={`flex-shrink-0 overflow-y-auto bg-white border-r border-gray-200 ${showPreview ? "w-full lg:w-[420px]" : "w-full"}`}>
          <div className="p-5">
            <FormContent />
          </div>
          {activeTab !== "publish" && (
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-3">
              <p className="text-xs text-gray-400 text-center">
                Ændringer ses i preview → Gå til <strong>🚀 Udgiv</strong> for at gøre dem permanente
              </p>
            </div>
          )}
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="hidden lg:flex flex-1 flex-col overflow-hidden bg-gray-100">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-200 border-b border-gray-300">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">Live Preview</span>
              <div className="flex gap-2">
                {activeTab === "seo" && (["home", "services", "booking"] as const).map((p) => (
                  <button key={p} onClick={() => setSeoPage(p)} className={`text-xs px-2 py-0.5 rounded ${seoPage === p ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-700"}`}>
                    {p === "home" ? "Forside" : p === "services" ? "Services" : "Booking"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <BrowserFrame url={previewUrl}>
                <PreviewContent />
              </BrowserFrame>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
