import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultConfig } from "@/config/defaultConfig";
import { mergeConfig } from "@/context/SiteConfigContext";
import { getIcon } from "@/lib/icons";
import type { SiteConfig, Service, MembershipPlan, SEOPage, Review } from "@/types/site-config";
import {
  ArrowLeft, Plus, Trash2, Eye, EyeOff, CheckCircle, XCircle, X,
  Loader2, Settings as SettingsIcon, LogOut, Monitor, Check,
  Globe, Search, Facebook, Terminal, Smartphone, Tablet,
  ChevronDown, Home, Scissors, CalendarDays, type LucideIcon,
} from "lucide-react";

const REPO_OWNER = "vincenzohashiro";
const REPO_NAME = "S-nderborg-Salon-Unlimited-Cuts";
const CONFIG_PATH = "public/site-config.json";
const toBase64 = (s: string) => btoa(unescape(encodeURIComponent(s)));

const ROLES: Record<string, { label: string; color: string }> = {
  "Barber$SEO-2025":  { label: "SEO",     color: "bg-blue-500"   },
  "Wasim$Owner-2025": { label: "Ejer",     color: "bg-green-600"  },
  "Dev$Panel-2025":   { label: "Udvikler", color: "bg-purple-600" },
};

const ICON_OPTIONS: { key: string; label: string }[] = [
  { key: "scissors",       label: "Klip"       },
  { key: "beard",          label: "Skæg"       },
  { key: "scissors-beard", label: "Klip+Skæg"  },
  { key: "elderly",        label: "Pensionist" },
  { key: "baby",           label: "Barn"       },
  { key: "gift",           label: "Gave"       },
  { key: "clipper",        label: "Maskine"    },
  { key: "flame",          label: "Barbering"  },
  { key: "droplet",        label: "Farve"      },
];

interface LogEntry {
  id: string;
  type: "success" | "error";
  timestamp: string;
  role: string;
  message: string;
}

type Tab = "forside" | "services" | "booking" | "seo" | "publish" | "advanced";

const TABS: { id: Tab; label: string; icon: string; path: string }[] = [
  { id: "forside",  label: "Forside",   icon: "🏠", path: "/"        },
  { id: "services", label: "Services",  icon: "✂️", path: "/services" },
  { id: "booking",  label: "Book Tid",  icon: "📅", path: "/booking"  },
  { id: "seo",      label: "SEO",       icon: "🔍", path: "/"        },
  { id: "publish",  label: "Udgiv",     icon: "🚀", path: "/"        },
  { id: "advanced", label: "Avanceret", icon: "⚙️", path: "/"        },
];

// ── Shared UI helpers (defined at module level — stable refs) ──────────────

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="mb-3">
    <label className="block text-[11px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">{label}</label>
    {hint && <p className="text-[11px] text-gray-400 mb-1 leading-relaxed">{hint}</p>}
    {children}
  </div>
);

const SectionBlock = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-3 border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">{title}</span>
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="p-4 space-y-0">{children}</div>}
    </div>
  );
};

const CharCount = ({ text, min, max }: { text: string; min: number; max: number }) => {
  const n = text.length;
  const color = n >= min && n <= max ? "text-green-600" : n > max ? "text-red-500" : "text-amber-500";
  const label = n >= min && n <= max ? "Optimal" : n > max ? "For lang" : "For kort";
  return (
    <div className={`flex items-center gap-1.5 mt-1 text-[11px] ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${color.replace("text-", "bg-")}`} />
      {n} tegn · {label} ({min}–{max})
    </div>
  );
};

const GooglePreview = ({ page, config }: { page: SEOPage; config: SiteConfig }) => {
  const domain = config.seo.canonicalBase.replace(/^https?:\/\//, "");
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg font-sans">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
        <Search className="w-3 h-3" /> Google preview
      </p>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-4 h-4 rounded-full bg-[#1a73e8] text-white text-[7px] flex items-center justify-center font-bold">A</div>
        <div className="text-[11px] text-gray-500">{domain}</div>
      </div>
      <div className="text-[#1a0dab] text-base leading-tight hover:underline cursor-pointer mb-0.5 line-clamp-1">
        {(page.title || "Ingen titel").slice(0, 60)}
      </div>
      <div className="text-xs text-gray-600 leading-snug line-clamp-2">
        {(page.description || "Ingen beskrivelse").slice(0, 160)}
      </div>
    </div>
  );
};

const SocialPreview = ({ page, config }: { page: SEOPage; config: SiteConfig }) => {
  const domain = config.seo.canonicalBase.replace(/^https?:\/\//, "");
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg font-sans">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
        <Facebook className="w-3 h-3" /> Social preview
      </p>
      <div className="border border-gray-200 rounded overflow-hidden">
        <div className="aspect-[1.91/1] bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white/30 text-xs">
          {config.seo.ogImage
            ? <img src={config.seo.ogImage} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            : "OG billede (1200×630 px)"}
        </div>
        <div className="p-2 bg-gray-50">
          <div className="text-[10px] text-gray-400 uppercase mb-0.5">{domain}</div>
          <div className="text-xs font-semibold text-gray-900 line-clamp-1">{page.title}</div>
          <div className="text-[10px] text-gray-500 line-clamp-2">{page.description}</div>
        </div>
      </div>
    </div>
  );
};

const TokenSetup = () => {
  const [t, setT] = useState(localStorage.getItem("ab_gh_token") || "");
  const [vis, setVis] = useState(false);
  const [saved, setSaved] = useState(false);
  const save = () => {
    localStorage.setItem("ab_gh_token", t.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">GitHub token — gemmes lokalt i browseren. Sæt én gang op, alle roller kan derefter udgive.</p>
      <div className="relative">
        <Input type={vis ? "text" : "password"} value={t} onChange={(e) => setT(e.target.value)} placeholder="github_pat_..." className="pr-10 font-mono text-xs" />
        <button type="button" onClick={() => setVis(!vis)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {vis ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
      <Button variant="outline" size="sm" onClick={save} className="w-full">
        {saved ? <><Check className="w-3.5 h-3.5 mr-1 text-green-600" /> Gemt!</> : "Gem token"}
      </Button>
    </div>
  );
};

// ── Toast notification (module level — stable ref) ────────────────────────
const Toast = ({
  show, type, message, onClose,
}: {
  show: boolean; type: "success" | "error"; message: string; onClose: () => void;
}) => {
  if (!show) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl text-white max-w-sm border ${
        type === "success"
          ? "bg-green-700 border-green-500"
          : "bg-red-700 border-red-500"
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight">
          {type === "success" ? "Udgivet!" : "Udgivelse fejlede"}
        </p>
        <p className="text-xs text-white/80 mt-0.5 break-words leading-relaxed">{message}</p>
        {type === "success" && (
          <p className="text-[10px] text-white/55 mt-1.5 flex items-center gap-1">
            <Terminal className="w-3 h-3" />
            GitHub Actions deployer → live om ~2 min
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-white/50 hover:text-white flex-shrink-0 -mt-0.5 -mr-1 p-1 rounded"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────

export default function Settings() {
  const [authed, setAuthed]         = useState(false);
  const [role, setRole]             = useState("");
  const [pw, setPw]                 = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [config, setConfig]         = useState<SiteConfig>(defaultConfig);
  const [activeTab, setActiveTab]   = useState<Tab>("forside");
  const [seoPage, setSeoPage]       = useState<"home" | "services" | "booking">("home");
  const [publishStatus, setPublishStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [publishMsg, setPublishMsg] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [toast, setToast]           = useState<{ show: boolean; type: "success" | "error"; message: string }>({ show: false, type: "success", message: "" });
  const [logs, setLogs]             = useState<LogEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem("ab_publish_logs") || "[]"); } catch { return []; }
  });

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialConfigRef = useRef<string | null>(null);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (toast.show) {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 5000);
    }
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  }, [toast.show]);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("ab_admin_role");
    if (storedRole) { setAuthed(true); setRole(storedRole); }
    fetch(`${import.meta.env.BASE_URL}site-config.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const merged = mergeConfig(d);
        setConfig(merged);
        initialConfigRef.current = JSON.stringify(merged);
      })
      .catch(() => {
        setConfig(defaultConfig);
        initialConfigRef.current = JSON.stringify(defaultConfig);
      });
  }, []);

  // Write config to localStorage on every change — the iframe's
  // SiteConfigContext receives a storage event and updates instantly
  useEffect(() => {
    localStorage.setItem("ab_preview_config", JSON.stringify(config));
  }, [config]);

  const hasUnsaved = initialConfigRef.current !== null && JSON.stringify(config) !== initialConfigRef.current;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handlePublish();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handlePublish]);

  const activeTabDef = TABS.find((t) => t.id === activeTab)!;
  const previewUrl = `${import.meta.env.BASE_URL}`.replace(/\/$/, "") + activeTabDef.path + "?preview=1";

  const handleTabChange = (tab: Tab) => setActiveTab(tab);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = ROLES[pw];
    if (matched) {
      sessionStorage.setItem("ab_admin_role", matched.label);
      setAuthed(true);
      setRole(matched.label);
    } else {
      setPw("");
      alert("Forkert adgangskode.");
    }
  };

  const appendLog = useCallback((type: "success" | "error", message: string, currentRole: string) => {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date().toISOString(),
      role: currentRole,
      message,
    };
    setLogs((prev) => {
      const next = [entry, ...prev].slice(0, 100);
      localStorage.setItem("ab_publish_logs", JSON.stringify(next));
      return next;
    });
  }, []);

  const handlePublish = useCallback(async () => {
    // Build-time token (set as VITE_GH_TOKEN in GitHub Actions secrets) takes priority,
    // with localStorage as a developer override fallback.
    const token = (import.meta.env.VITE_GH_TOKEN as string | undefined) || localStorage.getItem("ab_gh_token") || "";
    if (!token.trim()) {
      alert("GitHub token mangler.\n\nKontakt udvikleren for at konfigurere VITE_GH_TOKEN i GitHub secrets.");
      return;
    }
    setPublishStatus("loading");
    setPublishMsg("");
    try {
      const getRes = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONFIG_PATH}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
      );
      if (!getRes.ok) throw new Error(`GitHub fejl ${getRes.status}`);
      const { sha } = await getRes.json();
      const putRes = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONFIG_PATH}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/vnd.github+json" },
          body: JSON.stringify({
            message: `Update site config [${role}]`,
            content: toBase64(JSON.stringify(config, null, 2)),
            sha,
          }),
        }
      );
      if (!putRes.ok) {
        const e = await putRes.json().catch(() => ({}));
        throw new Error((e as { message?: string }).message || `HTTP ${putRes.status}`);
      }
      const successMsg = `Udgivet af ${role} — live-siden opdateres om ca. 2 minutter.`;
      initialConfigRef.current = JSON.stringify(config);
      setPublishStatus("success");
      setPublishMsg(successMsg);
      appendLog("success", successMsg, role);
      setToast({ show: true, type: "success", message: `Ændringer gemt og sendt til GitHub.` });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Ukendt fejl.";
      setPublishStatus("error");
      setPublishMsg(errMsg);
      appendLog("error", errMsg, role);
      setToast({ show: true, type: "error", message: errMsg });
    }
  }, [role, config, appendLog]);

  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem("ab_publish_logs");
  };

  // ── Updaters ─────────────────────────────────────────────────────────────
  const upG   = (k: keyof SiteConfig["general"], v: string)        => setConfig((c) => ({ ...c, general: { ...c.general, [k]: v } }));
  const upH   = (k: keyof SiteConfig["hero"], v: string)           => setConfig((c) => ({ ...c, hero:    { ...c.hero,    [k]: v } }));
  const upStat = (i: number, f: "value" | "label", v: string)      => setConfig((c) => ({ ...c, hero: { ...c.hero, stats: c.hero.stats.map((s, idx) => idx === i ? { ...s, [f]: v } : s) } }));
  const upA   = (k: keyof SiteConfig["about"], v: string)          => setConfig((c) => ({ ...c, about:  { ...c.about,  [k]: v } }));
  const upO   = (k: keyof SiteConfig["offer"], v: string)          => setConfig((c) => ({ ...c, offer:  { ...c.offer,  [k]: v } }));
  const upSS  = (k: keyof SiteConfig["servicesSection"], v: string) => setConfig((c) => ({ ...c, servicesSection: { ...c.servicesSection, [k]: v } }));
  const upGal = (k: keyof SiteConfig["gallery"], v: string)        => setConfig((c) => ({ ...c, gallery: { ...c.gallery, [k]: v } }));
  const upCon = (k: keyof SiteConfig["contact"], v: string)        => setConfig((c) => ({ ...c, contact: { ...c.contact, [k]: v } }));
  const upPS  = (k: keyof SiteConfig["pages"]["services"], v: string) => setConfig((c) => ({ ...c, pages: { ...c.pages, services: { ...c.pages.services, [k]: v } } }));
  const upPB  = (k: keyof SiteConfig["pages"]["booking"],  v: string) => setConfig((c) => ({ ...c, pages: { ...c.pages, booking:  { ...c.pages.booking,  [k]: v } } }));
  const upSvc = (id: string, f: keyof Service, v: string)          => setConfig((c) => ({ ...c, services: c.services.map((s) => s.id === id ? { ...s, [f]: v } : s) }));
  const addSvc = () => setConfig((c) => ({ ...c, services: [...c.services, { id: crypto.randomUUID(), icon: "scissors", title: "Ny tjeneste", price: "0 kr", time: "30 min", desc: "" }] }));
  const rmSvc  = (id: string) => setConfig((c) => ({ ...c, services: c.services.filter((s) => s.id !== id) }));
  const upM    = (id: string, f: keyof MembershipPlan, v: unknown)  => setConfig((c) => ({ ...c, memberships: c.memberships.map((m) => m.id === id ? { ...m, [f]: v } : m) }));
  const upPerks = (id: string, text: string) => upM(id, "perks", text.split("\n").filter(Boolean));
  const upReview = (id: string, f: keyof Review, v: string | number) =>
    setConfig((c) => ({ ...c, reviews: c.reviews.map((r) => r.id === id ? { ...r, [f]: v } : r) }));
  const addReview = () => setConfig((c) => ({
    ...c,
    reviews: [...c.reviews, { id: crypto.randomUUID(), author: "Ny anmelder", initials: "NA", rating: 5, text: "", date: "For nylig" }],
  }));
  const rmReview = (id: string) => setConfig((c) => ({ ...c, reviews: c.reviews.filter((r) => r.id !== id) }));

  const upSEO  = (page: "home" | "services" | "booking", f: keyof SEOPage, v: string) =>
    setConfig((c) => ({ ...c, seo: { ...c.seo, [page]: { ...c.seo[page], [f]: v } } }));
  const upSEORoot = (k: "canonicalBase" | "ogImage", v: string) =>
    setConfig((c) => ({ ...c, seo: { ...c.seo, [k]: v } }));

  // ── Form content — called as a function (not a component) to preserve focus ──
  // IMPORTANT: renderForm() must NOT be used as <RenderForm /> — it must be
  // called as {renderForm()} so React doesn't treat it as a new component type
  // on each render, which would unmount inputs and lose focus.
  const renderForm = () => {
    if (activeTab === "forside") return (
      <div>
        <SectionBlock title="Hero — øverste sektion">
          <Field label="Badge-tekst">
            <Input value={config.hero.badge} onChange={(e) => upH("badge", e.target.value)} className="h-8 text-sm" />
          </Field>
          <Field label="Overskrift — linje 1">
            <Input value={config.hero.headline1} onChange={(e) => upH("headline1", e.target.value)} className="h-8 text-sm" />
          </Field>
          <Field label="Overskrift — linje 2 (guld, kursiv)">
            <Input value={config.hero.headline2} onChange={(e) => upH("headline2", e.target.value)} className="h-8 text-sm" />
          </Field>
          <Field label="Undertekst">
            <Textarea value={config.hero.subtext} onChange={(e) => upH("subtext", e.target.value)} rows={3} className="text-sm" />
          </Field>
          <Field label="Knap — book-tekst">
            <Input value={config.hero.ctaBook} onChange={(e) => upH("ctaBook", e.target.value)} className="h-8 text-sm" />
          </Field>
          <div className="border-t border-gray-100 pt-3 mt-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Statistikker (tal + label)</p>
            {config.hero.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                <Input value={s.value} onChange={(e) => upStat(i, "value", e.target.value)} placeholder="499" className="h-8 text-sm" />
                <Input value={s.label} onChange={(e) => upStat(i, "label", e.target.value)} placeholder="kr/md klip" className="h-8 text-sm" />
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Om os">
          <Field label="Badge-tekst"><Input value={config.about.badge} onChange={(e) => upA("badge", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Overskrift — præfiks" hint='Fx "Velkommen til"'>
            <Input value={config.about.welcomePrefix} onChange={(e) => upA("welcomePrefix", e.target.value)} className="h-8 text-sm" />
          </Field>
          <Field label="Overskrift — navn (guld, kursiv)">
            <Input value={config.about.nameDisplay} onChange={(e) => upA("nameDisplay", e.target.value)} className="h-8 text-sm" />
          </Field>
          <Field label="Intro-præfiks" hint='Fx "Mit navn er"'>
            <Input value={config.about.introPrefix} onChange={(e) => upA("introPrefix", e.target.value)} className="h-8 text-sm" />
          </Field>
          <Field label="Ejernavn"><Input value={config.about.ownerName} onChange={(e) => upA("ownerName", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Intro-sætning"><Textarea value={config.about.intro} onChange={(e) => upA("intro", e.target.value)} rows={2} className="text-sm" /></Field>
          <Field label="Biografi — afsnit 1"><Textarea value={config.about.bio1} onChange={(e) => upA("bio1", e.target.value)} rows={3} className="text-sm" /></Field>
          <Field label="Biografi — afsnit 2"><Textarea value={config.about.bio2} onChange={(e) => upA("bio2", e.target.value)} rows={3} className="text-sm" /></Field>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div>
              <Field label="Certifikat 1 — titel"><Input value={config.about.cert1Title} onChange={(e) => upA("cert1Title", e.target.value)} className="h-8 text-sm" /></Field>
              <Field label="Certifikat 1 — detalje"><Input value={config.about.cert1Sub} onChange={(e) => upA("cert1Sub", e.target.value)} className="h-8 text-sm" /></Field>
            </div>
            <div>
              <Field label="Certifikat 2 — titel"><Input value={config.about.cert2Title} onChange={(e) => upA("cert2Title", e.target.value)} className="h-8 text-sm" /></Field>
              <Field label="Certifikat 2 — detalje"><Input value={config.about.cert2Sub} onChange={(e) => upA("cert2Sub", e.target.value)} className="h-8 text-sm" /></Field>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Field label="Års erfaring (fx '10+')"><Input value={config.about.yearsExp} onChange={(e) => upA("yearsExp", e.target.value)} className="h-8 text-sm" /></Field>
            <Field label="Label (fx 'års erfaring')"><Input value={config.about.yearsLabel} onChange={(e) => upA("yearsLabel", e.target.value)} className="h-8 text-sm" /></Field>
          </div>
        </SectionBlock>

        <SectionBlock title="Medlemskaber — sektion på forsiden">
          <Field label="Badge-tekst"><Input value={config.offer.badge} onChange={(e) => upO("badge", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Overskrift — linje 1"><Input value={config.offer.heading1} onChange={(e) => upO("heading1", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Overskrift — linje 2 (guld, kursiv)"><Input value={config.offer.heading2} onChange={(e) => upO("heading2", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Undertekst"><Textarea value={config.offer.subtext} onChange={(e) => upO("subtext", e.target.value)} rows={2} className="text-sm" /></Field>
          <Field label="Småt under knap">
            <Input value={config.offer.smallPrint} onChange={(e) => upO("smallPrint", e.target.value)} className="h-8 text-sm" />
          </Field>

          <div className="border-t border-gray-100 pt-3 mt-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Kort — indhold</p>
            {config.memberships.map((m, idx) => (
              <div key={m.id} className={`border rounded-lg p-3 mb-3 ${m.highlight ? "border-yellow-300 bg-yellow-50/30" : "border-gray-200 bg-gray-50"}`}>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Kort {idx + 1}{m.highlight ? " · Mest populær" : ""}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Navn"><Input value={m.name} onChange={(e) => upM(m.id, "name", e.target.value)} className="h-8 text-sm" /></Field>
                  <Field label="Pris (kr)"><Input value={m.price} onChange={(e) => upM(m.id, "price", e.target.value)} className="h-8 text-sm" /></Field>
                </div>
                <Field label="Slogan"><Input value={m.tagline} onChange={(e) => upM(m.id, "tagline", e.target.value)} className="h-8 text-sm" /></Field>
                <Field label="Knap-tekst"><Input value={m.cta} onChange={(e) => upM(m.id, "cta", e.target.value)} className="h-8 text-sm" /></Field>
                <Field label="Fordele — én per linje">
                  <Textarea value={m.perks.join("\n")} onChange={(e) => upPerks(m.id, e.target.value)} rows={m.perks.length + 1} className="text-sm font-mono" />
                </Field>
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Services — sektion på forsiden">
          <Field label="Badge-tekst"><Input value={config.servicesSection.badge} onChange={(e) => upSS("badge", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Overskrift"><Input value={config.servicesSection.heading} onChange={(e) => upSS("heading", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Brødtekst"><Textarea value={config.servicesSection.body} onChange={(e) => upSS("body", e.target.value)} rows={3} className="text-sm" /></Field>
          <Field label="Knap-tekst"><Input value={config.servicesSection.cta} onChange={(e) => upSS("cta", e.target.value)} className="h-8 text-sm" /></Field>

          <div className="border-t border-gray-100 pt-3 mt-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">De 4 kort vist på forsiden</p>
            {config.services.slice(0, 4).map((s, idx) => (
              <div key={s.id} className="border border-gray-200 rounded-lg p-3 mb-2 bg-gray-50">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Kort {idx + 1}</p>
                <Field label="Navn"><Input value={s.title} onChange={(e) => upSvc(s.id, "title", e.target.value)} className="h-8 text-sm" /></Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Pris"><Input value={s.price} onChange={(e) => upSvc(s.id, "price", e.target.value)} className="h-8 text-sm" /></Field>
                  <Field label="Tid"><Input value={s.time} onChange={(e) => upSvc(s.id, "time", e.target.value)} className="h-8 text-sm" /></Field>
                </div>
                <Field label="Beskrivelse"><Textarea value={s.desc} onChange={(e) => upSvc(s.id, "desc", e.target.value)} rows={2} className="text-sm" /></Field>
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock title="Anmeldelser" defaultOpen={false}>
          {(config.reviews ?? []).map((r, idx) => (
            <div key={r.id} className="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50 relative">
              <button type="button" onClick={() => rmReview(r.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Anmeldelse {idx + 1}</p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Navn"><Input value={r.author} onChange={(e) => upReview(r.id, "author", e.target.value)} className="h-8 text-sm" /></Field>
                <Field label="Initialer (fx MH)"><Input value={r.initials} onChange={(e) => upReview(r.id, "initials", e.target.value)} className="h-8 text-sm" maxLength={3} /></Field>
              </div>
              <Field label="Profilbillede URL (valgfri)" hint="Højreklik på profilbillede i Google Maps → Kopiér billedadresse">
                <Input value={r.avatarUrl ?? ""} onChange={(e) => upReview(r.id, "avatarUrl", e.target.value)} className="h-8 text-sm font-mono" placeholder="https://lh3.googleusercontent.com/..." />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Stjerner (1–5)">
                  <Input type="number" min={1} max={5} value={r.rating} onChange={(e) => upReview(r.id, "rating", Math.min(5, Math.max(1, Number(e.target.value))))} className="h-8 text-sm" />
                </Field>
                <Field label="Dato (fx 'For 2 uger siden')"><Input value={r.date} onChange={(e) => upReview(r.id, "date", e.target.value)} className="h-8 text-sm" /></Field>
              </div>
              <Field label="Anmeldelsestekst">
                <Textarea value={r.text} onChange={(e) => upReview(r.id, "text", e.target.value)} rows={3} className="text-sm" />
              </Field>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addReview} className="w-full mt-1">
            <Plus className="w-3.5 h-3.5 mr-1" /> Tilføj anmeldelse
          </Button>
        </SectionBlock>

        <SectionBlock title="Galleri" defaultOpen={false}>
          <Field label="Badge-tekst"><Input value={config.gallery.badge} onChange={(e) => upGal("badge", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Overskrift"><Input value={config.gallery.heading} onChange={(e) => upGal("heading", e.target.value)} className="h-8 text-sm" /></Field>
        </SectionBlock>

        <SectionBlock title="Kontakt" defaultOpen={false}>
          <Field label="Badge-tekst"><Input value={config.contact.badge} onChange={(e) => upCon("badge", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Overskrift"><Input value={config.contact.heading} onChange={(e) => upCon("heading", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Brødtekst"><Textarea value={config.contact.body} onChange={(e) => upCon("body", e.target.value)} rows={2} className="text-sm" /></Field>
          <Field label="Booking-boks — overskrift"><Input value={config.contact.cardHeading} onChange={(e) => upCon("cardHeading", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Booking-boks — tekst"><Textarea value={config.contact.cardBody} onChange={(e) => upCon("cardBody", e.target.value)} rows={2} className="text-sm" /></Field>
          <Field label="Booking-boks — knap"><Input value={config.contact.cardCta} onChange={(e) => upCon("cardCta", e.target.value)} className="h-8 text-sm" /></Field>
          <div className="border-t border-gray-100 pt-3 mt-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Kontaktinfo</p>
            <Field label="Telefon"><Input value={config.general.phone} onChange={(e) => upG("phone", e.target.value)} className="h-8 text-sm" /></Field>
            <Field label="Adresse"><Input value={config.general.address} onChange={(e) => upG("address", e.target.value)} className="h-8 text-sm" /></Field>
            <Field label="Åbningstider"><Input value={config.general.hours} onChange={(e) => upG("hours", e.target.value)} className="h-8 text-sm" /></Field>
            <Field label="Instagram URL"><Input value={config.general.instagram} onChange={(e) => upG("instagram", e.target.value)} className="h-8 text-sm" /></Field>
            <Field label="Facebook URL"><Input value={config.general.facebook} onChange={(e) => upG("facebook", e.target.value)} className="h-8 text-sm" /></Field>
          </div>
        </SectionBlock>

        <SectionBlock title="Navigation & generelt" defaultOpen={false}>
          <Field label="Virksomhedsnavn (logo)"><Input value={config.general.businessName} onChange={(e) => upG("businessName", e.target.value)} className="h-8 text-sm" /></Field>
        </SectionBlock>
      </div>
    );

    if (activeTab === "services") return (
      <div>
        <SectionBlock title="Sideoverskrift">
          <Field label="Badge-tekst"><Input value={config.pages.services.badge} onChange={(e) => upPS("badge", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Overskrift — del 1"><Input value={config.pages.services.heading1} onChange={(e) => upPS("heading1", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Overskrift — del 2 (guld, kursiv)"><Input value={config.pages.services.heading2} onChange={(e) => upPS("heading2", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Undertekst"><Textarea value={config.pages.services.subtext} onChange={(e) => upPS("subtext", e.target.value)} rows={2} className="text-sm" /></Field>
        </SectionBlock>

        <SectionBlock title="Tjenester">
          {config.services.map((s) => (
            <div key={s.id} className="border border-gray-100 rounded-lg p-3 mb-3 bg-gray-50 relative">
              <button type="button" onClick={() => rmSvc(s.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <Field label="Ikon">
                <div className="flex flex-wrap gap-1.5">
                  {ICON_OPTIONS.map(({ key, label }) => {
                    const Icon = getIcon(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        title={label}
                        onClick={() => upSvc(s.id, "icon", key)}
                        className={`p-2 rounded border flex flex-col items-center gap-1 transition-colors ${
                          s.icon === key
                            ? "bg-yellow-50 border-yellow-400 text-yellow-700"
                            : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.5} />
                        <span className="text-[8px] leading-none">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Navn"><Input value={s.title} onChange={(e) => upSvc(s.id, "title", e.target.value)} className="h-8 text-sm" /></Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Pris"><Input value={s.price} onChange={(e) => upSvc(s.id, "price", e.target.value)} className="h-8 text-sm" /></Field>
                <Field label="Tid"><Input value={s.time} onChange={(e) => upSvc(s.id, "time", e.target.value)} className="h-8 text-sm" /></Field>
              </div>
              <Field label="Beskrivelse"><Textarea value={s.desc} onChange={(e) => upSvc(s.id, "desc", e.target.value)} rows={2} className="text-sm" /></Field>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addSvc} className="w-full mt-1">
            <Plus className="w-3.5 h-3.5 mr-1" /> Tilføj tjeneste
          </Button>
        </SectionBlock>

        <SectionBlock title="Medlemskaber" defaultOpen={false}>
          {config.memberships.map((m) => (
            <div key={m.id} className={`border rounded-lg p-3 mb-3 ${m.highlight ? "border-yellow-300 bg-yellow-50/40" : "border-gray-100 bg-gray-50"}`}>
              {m.highlight && <div className="text-[10px] bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full font-medium inline-block mb-2">Mest populær</div>}
              <div className="grid grid-cols-2 gap-2">
                <Field label="Navn"><Input value={m.name} onChange={(e) => upM(m.id, "name", e.target.value)} className="h-8 text-sm" /></Field>
                <Field label="Pris (tal)"><Input value={m.price} onChange={(e) => upM(m.id, "price", e.target.value)} className="h-8 text-sm" /></Field>
              </div>
              <Field label="Slogan"><Input value={m.tagline} onChange={(e) => upM(m.id, "tagline", e.target.value)} className="h-8 text-sm" /></Field>
              <Field label="Knap-tekst"><Input value={m.cta} onChange={(e) => upM(m.id, "cta", e.target.value)} className="h-8 text-sm" /></Field>
              <Field label="Fordele — én per linje">
                <Textarea value={m.perks.join("\n")} onChange={(e) => upPerks(m.id, e.target.value)} rows={m.perks.length + 1} className="text-sm font-mono" />
              </Field>
            </div>
          ))}
        </SectionBlock>
      </div>
    );

    if (activeTab === "booking") return (
      <div>
        <SectionBlock title="Sideoverskrift">
          <Field label="Badge-tekst"><Input value={config.pages.booking.badge} onChange={(e) => upPB("badge", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Overskrift — del 1"><Input value={config.pages.booking.heading1} onChange={(e) => upPB("heading1", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Overskrift — del 2 (guld, kursiv)"><Input value={config.pages.booking.heading2} onChange={(e) => upPB("heading2", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Undertekst"><Textarea value={config.pages.booking.subtext} onChange={(e) => upPB("subtext", e.target.value)} rows={2} className="text-sm" /></Field>
        </SectionBlock>

        <SectionBlock title="Booking-widget">
          <Field label="Overskrift"><Input value={config.pages.booking.iframeHeading} onChange={(e) => upPB("iframeHeading", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Undertitel" hint='Fx "Drevet af Planway"'>
            <Input value={config.pages.booking.iframeSubtext} onChange={(e) => upPB("iframeSubtext", e.target.value)} className="h-8 text-sm" />
          </Field>
          <Field label="Knap-tekst"><Input value={config.pages.booking.iframeCta} onChange={(e) => upPB("iframeCta", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Planway URL"><Input value={config.general.planwayUrl} onChange={(e) => upG("planwayUrl", e.target.value)} className="h-8 text-sm" /></Field>
        </SectionBlock>

        <SectionBlock title="Info-kort" defaultOpen={false}>
          <Field label="Telefon"><Input value={config.general.phone} onChange={(e) => upG("phone", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Adresse"><Input value={config.general.address} onChange={(e) => upG("address", e.target.value)} className="h-8 text-sm" /></Field>
          <Field label="Åbningstider"><Input value={config.general.hours} onChange={(e) => upG("hours", e.target.value)} className="h-8 text-sm" /></Field>
        </SectionBlock>
      </div>
    );

    if (activeTab === "seo") return (
      <div>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-4">
          {(["home", "services", "booking"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSeoPage(p)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${seoPage === p ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
            >
              {p === "home" ? "Forside" : p === "services" ? "Services" : "Book Tid"}
            </button>
          ))}
        </div>
        <Field label="Sidetitel (Title tag)" hint="Optimal: 30–60 tegn">
          <Input value={config.seo[seoPage].title} onChange={(e) => upSEO(seoPage, "title", e.target.value)} className="text-sm" />
          <CharCount text={config.seo[seoPage].title} min={30} max={60} />
        </Field>
        <Field label="Meta-beskrivelse" hint="Optimal: 120–160 tegn">
          <Textarea value={config.seo[seoPage].description} onChange={(e) => upSEO(seoPage, "description", e.target.value)} rows={4} className="text-sm" />
          <CharCount text={config.seo[seoPage].description} min={120} max={160} />
        </Field>
        <Field label="Canonical URL">
          <Input value={config.seo.canonicalBase} onChange={(e) => upSEORoot("canonicalBase", e.target.value)} className="text-sm" />
        </Field>
        <Field label="OG-billede URL" hint="1200×630 px anbefalet">
          <Input value={config.seo.ogImage} onChange={(e) => upSEORoot("ogImage", e.target.value)} className="text-sm" />
        </Field>
        <div className="mt-4 space-y-3">
          <GooglePreview page={config.seo[seoPage]} config={config} />
          <SocialPreview page={config.seo[seoPage]} config={config} />
        </div>
      </div>
    );

    if (activeTab === "publish") return (
      <div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="font-semibold text-gray-900 mb-1">Klar til at udgive?</h3>
          <p className="text-sm text-gray-500 mb-1">
            Indlogget som{" "}
            <span className={`font-medium px-1.5 py-0.5 rounded text-white text-xs ${Object.values(ROLES).find((r) => r.label === role)?.color ?? "bg-gray-600"}`}>
              {role}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Preview-siden afspejler dine ændringer. Udgiv for at gøre dem permanente.
          </p>
        </div>

        <Button variant="gold" size="lg" onClick={handlePublish} disabled={publishStatus === "loading"} className="w-full text-base py-6">
          {publishStatus === "loading"
            ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Udgiver som {role}…</>
            : `Udgiv ændringer som ${role}`}
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

        {role === "Udvikler" && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Token-opsætning (kun udvikler)</p>
            <TokenSetup />
          </div>
        )}
      </div>
    );

    // Advanced tab (Udvikler only)
    if (activeTab === "advanced") {
      const successLogs = logs.filter((l) => l.type === "success");
      const errorLogs   = logs.filter((l) => l.type === "error");
      return (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-500" />
              <h3 className="font-semibold text-gray-900 text-sm">Avancerede indstillinger</h3>
            </div>
            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Kun Udvikler</span>
          </div>

          {/* Token setup */}
          <SectionBlock title="GitHub Token">
            <TokenSetup />
          </SectionBlock>

          {/* System info */}
          <SectionBlock title="System info" defaultOpen={false}>
            <div className="space-y-1.5 font-mono text-xs text-gray-500 bg-gray-950 rounded-lg p-4 text-green-400">
              <div><span className="text-gray-500">repo</span>    <span className="ml-2">{REPO_OWNER}/{REPO_NAME}</span></div>
              <div><span className="text-gray-500">config</span>  <span className="ml-2">{CONFIG_PATH}</span></div>
              <div><span className="text-gray-500">token</span>   <span className="ml-2">{localStorage.getItem("ab_gh_token") ? "✓ konfigureret" : "✗ mangler"}</span></div>
              <div><span className="text-gray-500">logs</span>    <span className="ml-2">{logs.length} entries</span></div>
              <div><span className="text-gray-500">version</span> <span className="ml-2">{new Date().toLocaleDateString("da-DK")}</span></div>
            </div>
          </SectionBlock>

          {/* Publish log */}
          <SectionBlock title={`Publish-log (${successLogs.length} ok)`}>
            {successLogs.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Ingen publiceringer endnu</p>
            ) : (
              <div className="space-y-2">
                {successLogs.map((entry) => (
                  <div key={entry.id} className="p-3 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">UDGIV OK</span>
                      <span className="text-[10px] text-gray-400 ml-auto font-mono">{entry.role}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{entry.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">
                      {new Date(entry.timestamp).toLocaleString("da-DK", { dateStyle: "short", timeStyle: "medium" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionBlock>

          {/* Error log */}
          <SectionBlock title={`Fejllog (${errorLogs.length} fejl)`} defaultOpen={errorLogs.length > 0}>
            {errorLogs.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Ingen fejl registreret</p>
            ) : (
              <div className="space-y-2">
                {errorLogs.map((entry) => (
                  <div key={entry.id} className="p-3 rounded-lg border border-red-200 bg-red-50">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <span className="text-[10px] font-bold text-red-700 uppercase tracking-widest">FEJL</span>
                      <span className="text-[10px] text-gray-400 ml-auto font-mono">{entry.role}</span>
                    </div>
                    <p className="text-xs text-red-700 leading-relaxed font-mono break-all">{entry.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">
                      {new Date(entry.timestamp).toLocaleString("da-DK", { dateStyle: "short", timeStyle: "medium" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionBlock>

          {/* Clear logs */}
          {logs.length > 0 && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearLogs}
                className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Ryd alle logs ({logs.length})
              </Button>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // ── Login screen ─────────────────────────────────────────────────────────
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
              <p className="text-xs text-gray-400 mt-1.5">Brug din tildelte adgangskode (SEO, Ejer eller Udvikler).</p>
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

  // ── Main admin UI ────────────────────────────────────────────────────────
  const roleColor = Object.values(ROLES).find((r) => r.label === role)?.color ?? "bg-gray-600";
  const visibleTabs = TABS.filter((t) => t.id !== "advanced" || role === "Udvikler");

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <header className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between flex-shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-4 h-4 text-gray-900" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">A&B Admin</span>
            <span className="text-gray-400 text-xs hidden sm:inline">Website Editor</span>
            {role && <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full text-white ${roleColor}`}>{role}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handlePublish}
            disabled={publishStatus === "loading"}
            title={hasUnsaved ? "Udgiv ændringer (Ctrl+S)" : "Ingen ændringer at udgive"}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-semibold transition-all duration-200 ${
              publishStatus === "loading"
                ? "bg-green-600 text-white opacity-80 cursor-wait"
                : hasUnsaved
                ? "bg-green-500 hover:bg-green-600 text-white shadow shadow-green-900/30"
                : "bg-white/10 text-white/40 cursor-default"
            }`}
          >
            {publishStatus === "loading"
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span className="hidden sm:inline ml-1">Udgiver…</span></>
              : <><span className="hidden sm:inline">Udgiv</span><span className="sm:hidden">↑</span>{hasUnsaved && <span className="w-1.5 h-1.5 ml-1 rounded-full bg-yellow-300 inline-block" />}</>
            }
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${showPreview ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showPreview ? "Skjul" : "Vis"} preview</span>
          </button>
          <Link to="/" target="_blank" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
            <Globe className="w-3 h-3" /> <span className="hidden sm:inline">Live side</span>
          </Link>
          <button
            onClick={() => { sessionStorage.removeItem("ab_admin_role"); setAuthed(false); setRole(""); }}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <LogOut className="w-3 h-3" /> <span className="hidden sm:inline">Log ud</span>
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 flex-shrink-0 overflow-x-auto">
        <div className="flex min-w-max">
          {visibleTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`px-5 py-3 text-sm flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? "border-yellow-500 text-gray-900 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
              }`}
            >
              <span>{t.icon}</span> {t.label}
              {t.id === "publish" && publishStatus === "idle" && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
              {t.id === "advanced" && logs.filter((l) => l.type === "error").length > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {logs.filter((l) => l.type === "error").length > 9 ? "9+" : logs.filter((l) => l.type === "error").length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings panel */}
        <div className={`flex-shrink-0 overflow-y-auto bg-white border-r border-gray-200 ${showPreview ? "w-full lg:w-[400px]" : "w-full"}`}>
          <div className="p-4">
            {/* Called as a function — NOT as <Component /> — to prevent focus loss on re-render */}
            {renderForm()}
          </div>
        </div>

        {/* Real iframe preview */}
        {showPreview && (
          <div className="hidden lg:flex flex-1 flex-col overflow-hidden bg-[#e8eaed]">
            <div className="flex items-center gap-3 px-4 py-2 bg-[#dee1e6] border-b border-gray-300 flex-shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-500 flex items-center gap-1.5 border border-gray-300 max-w-sm">
                <Globe className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">ab-barberlounge2.dk{activeTabDef.path} · PREVIEW</span>
              </div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Live Preview</span>
            </div>

            <div className="flex-1 overflow-hidden">
              <iframe
                key={activeTab}
                src={previewUrl}
                title="Preview"
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        )}
      </div>

      {/* Toast notification — visible across all tabs */}
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
