import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultConfig } from "@/config/defaultConfig";
import type { SiteConfig, Service, MembershipPlan } from "@/types/site-config";
import {
  ArrowLeft, Plus, Trash2, Eye, EyeOff, CheckCircle,
  XCircle, Loader2, Settings as SettingsIcon, LogOut,
} from "lucide-react";

const REPO_OWNER = "vincenzohashiro";
const REPO_NAME = "S-nderborg-Salon-Unlimited-Cuts";
const CONFIG_PATH = "public/site-config.json";

const toBase64 = (str: string) => btoa(unescape(encodeURIComponent(str)));

type Tab = "general" | "hero" | "about" | "services" | "memberships" | "publish";

const TABS: { id: Tab; label: string }[] = [
  { id: "general", label: "Generelt" },
  { id: "hero", label: "Forside" },
  { id: "about", label: "Om os" },
  { id: "services", label: "Tjenester" },
  { id: "memberships", label: "Medlemskaber" },
  { id: "publish", label: "Udgiv" },
];

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="mb-5">
    <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
    {hint && <p className="text-xs text-muted-foreground mb-1.5">{hint}</p>}
    {children}
  </div>
);

export default function Settings() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [publishStatus, setPublishStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [publishMsg, setPublishMsg] = useState("");
  const [newPw, setNewPw] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("ab_admin") === "1") setAuthed(true);
    const savedToken = localStorage.getItem("ab_gh_token");
    if (savedToken) setToken(savedToken);
    fetch(`${import.meta.env.BASE_URL}site-config.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: SiteConfig) => setConfig(data))
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
      alert("Forkert adgangskode.\n\nStandard adgangskode: abbarber2");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("ab_admin");
    setAuthed(false);
  };

  const handlePublish = useCallback(async () => {
    if (!token.trim()) {
      alert("Indtast venligst dit GitHub Personal Access Token.");
      return;
    }
    setPublishStatus("loading");
    setPublishMsg("");
    localStorage.setItem("ab_gh_token", token);

    try {
      const getRes = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONFIG_PATH}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
      );
      if (!getRes.ok) throw new Error(`GitHub svarede med ${getRes.status}. Tjek at dit token er korrekt.`);
      const getJson = await getRes.json();

      const putRes = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONFIG_PATH}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github+json",
          },
          body: JSON.stringify({
            message: "Update site config via admin panel",
            content: toBase64(JSON.stringify(config, null, 2)),
            sha: getJson.sha,
          }),
        }
      );

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error((errJson as { message?: string }).message || `HTTP ${putRes.status}`);
      }

      setPublishStatus("success");
      setPublishMsg("Ændringer er udgivet! Siden opdateres automatisk om ca. 2 minutter.");
    } catch (err) {
      setPublishStatus("error");
      setPublishMsg(err instanceof Error ? err.message : "Ukendt fejl opstod.");
    }
  }, [token, config]);

  const upGeneral = (k: keyof SiteConfig["general"], v: string) =>
    setConfig((c) => ({ ...c, general: { ...c.general, [k]: v } }));

  const upHero = (k: keyof SiteConfig["hero"], v: unknown) =>
    setConfig((c) => ({ ...c, hero: { ...c.hero, [k]: v } }));

  const upStat = (i: number, f: "value" | "label", v: string) =>
    setConfig((c) => {
      const stats = c.hero.stats.map((s, idx) => (idx === i ? { ...s, [f]: v } : s));
      return { ...c, hero: { ...c.hero, stats } };
    });

  const upAbout = (k: keyof SiteConfig["about"], v: string) =>
    setConfig((c) => ({ ...c, about: { ...c.about, [k]: v } }));

  const upService = (id: string, f: keyof Service, v: string) =>
    setConfig((c) => ({
      ...c,
      services: c.services.map((s) => (s.id === id ? { ...s, [f]: v } : s)),
    }));

  const addService = () =>
    setConfig((c) => ({
      ...c,
      services: [
        ...c.services,
        { id: crypto.randomUUID(), icon: "scissors", title: "Ny tjeneste", price: "0 kr", time: "30 min", desc: "" },
      ],
    }));

  const removeService = (id: string) =>
    setConfig((c) => ({ ...c, services: c.services.filter((s) => s.id !== id) }));

  const upMembership = (id: string, f: keyof MembershipPlan, v: unknown) =>
    setConfig((c) => ({
      ...c,
      memberships: c.memberships.map((m) => (m.id === id ? { ...m, [f]: v } : m)),
    }));

  const upPerks = (id: string, text: string) =>
    upMembership(id, "perks", text.split("\n").filter(Boolean));

  // ─── Login gate ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-background rounded-sm shadow-elegant p-8">
          <div className="flex items-center gap-3 mb-8">
            <SettingsIcon className="w-6 h-6 text-gold" />
            <div>
              <div className="font-serif text-xl">A&B Admin</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">Hjemmeside indstillinger</div>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Adgangskode</label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="Indtast adgangskode"
                  autoFocus
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button variant="gold" className="w-full" type="submit">Log ind</Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Tilbage til hjemmesiden
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Admin panel ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-primary text-background py-4 px-6 flex items-center justify-between sticky top-0 z-40 shadow-elegant">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-5 h-5 text-gold" />
          <span className="font-serif text-lg">A&B Admin</span>
          <span className="text-background/40 hidden sm:inline">·</span>
          <span className="text-background/60 text-sm hidden sm:inline">Hjemmeside indstillinger</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs text-background/60 hover:text-gold flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Se siden
          </Link>
          <button onClick={handleLogout} className="text-xs text-background/60 hover:text-gold flex items-center gap-1">
            <LogOut className="w-3 h-3" /> Log ud
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-background border-b border-border sticky top-[60px] z-30 overflow-x-auto">
        <div className="flex px-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === t.id
                  ? "border-gold text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-6">

        {/* ── GENERELT ── */}
        {activeTab === "general" && (
          <div className="bg-background rounded-sm border border-border p-6">
            <h2 className="font-serif text-2xl mb-6 pb-3 border-b border-border">Generelt</h2>
            <Field label="Forretningsnavn">
              <Input value={config.general.businessName} onChange={(e) => upGeneral("businessName", e.target.value)} />
            </Field>
            <Field label="Telefonnummer">
              <Input value={config.general.phone} onChange={(e) => upGeneral("phone", e.target.value)} />
            </Field>
            <Field label="Adresse">
              <Input value={config.general.address} onChange={(e) => upGeneral("address", e.target.value)} />
            </Field>
            <Field label="Åbningstider" hint="Vises i kontaktsektionen og på bookingsiden">
              <Input value={config.general.hours} onChange={(e) => upGeneral("hours", e.target.value)} />
            </Field>
            <Field label="Planway booking-URL" hint="URL til dit Planway bookingsystem">
              <Input value={config.general.planwayUrl} onChange={(e) => upGeneral("planwayUrl", e.target.value)} />
            </Field>
            <Field label="Instagram-URL">
              <Input value={config.general.instagram} onChange={(e) => upGeneral("instagram", e.target.value)} />
            </Field>
            <Field label="Facebook-URL">
              <Input value={config.general.facebook} onChange={(e) => upGeneral("facebook", e.target.value)} />
            </Field>

            <hr className="my-6" />
            <h3 className="font-medium mb-4">Skift admin-adgangskode</h3>
            <div className="flex gap-3 max-w-xs">
              <Input
                type="password"
                placeholder="Ny adgangskode (min. 4 tegn)"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (newPw.length >= 4) {
                    localStorage.setItem("ab_admin_pw", newPw);
                    setNewPw("");
                    alert("Adgangskode ændret!");
                  } else {
                    alert("Adgangskoden skal være mindst 4 tegn.");
                  }
                }}
              >
                Gem
              </Button>
            </div>
          </div>
        )}

        {/* ── HERO ── */}
        {activeTab === "hero" && (
          <div className="bg-background rounded-sm border border-border p-6">
            <h2 className="font-serif text-2xl mb-6 pb-3 border-b border-border">Forside — Hero-sektion</h2>
            <Field label="Badge-tekst" hint='Vises øverst i hero (f.eks. "Nyåbnet · Sønderborg")'>
              <Input value={config.hero.badge} onChange={(e) => upHero("badge", e.target.value)} />
            </Field>
            <Field label="Overskrift linje 1">
              <Input value={config.hero.headline1} onChange={(e) => upHero("headline1", e.target.value)} />
            </Field>
            <Field label="Overskrift linje 2 (guldfarvet, kursiv)">
              <Input value={config.hero.headline2} onChange={(e) => upHero("headline2", e.target.value)} />
            </Field>
            <Field label="Undertekst">
              <Textarea value={config.hero.subtext} onChange={(e) => upHero("subtext", e.target.value)} rows={3} />
            </Field>

            <h3 className="font-medium mt-6 mb-4">Statistikker (3 tal i bunden af hero)</h3>
            {config.hero.stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tal #{i + 1}</label>
                  <Input value={stat.value} onChange={(e) => upStat(i, "value", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Etiket #{i + 1}</label>
                  <Input value={stat.label} onChange={(e) => upStat(i, "label", e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── OM OS ── */}
        {activeTab === "about" && (
          <div className="bg-background rounded-sm border border-border p-6">
            <h2 className="font-serif text-2xl mb-6 pb-3 border-b border-border">Om os-sektion</h2>
            <Field label="Ejerens navn">
              <Input value={config.about.ownerName} onChange={(e) => upAbout("ownerName", e.target.value)} />
            </Field>
            <Field label="Intro-sætning" hint='Vises efter "Mit navn er [Navn],"'>
              <Input value={config.about.intro} onChange={(e) => upAbout("intro", e.target.value)} />
            </Field>
            <Field label="Biografi — afsnit 1">
              <Textarea value={config.about.bio1} onChange={(e) => upAbout("bio1", e.target.value)} rows={4} />
            </Field>
            <Field label="Biografi — afsnit 2">
              <Textarea value={config.about.bio2} onChange={(e) => upAbout("bio2", e.target.value)} rows={3} />
            </Field>
            <Field label="Års erfaring" hint='Vises på billedet (f.eks. "10+")'>
              <Input value={config.about.yearsExp} onChange={(e) => upAbout("yearsExp", e.target.value)} className="max-w-xs" />
            </Field>

            <h3 className="font-medium mt-6 mb-4">Kvalifikationskort</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Kort 1 — Titel</label>
                <Input value={config.about.cert1Title} onChange={(e) => upAbout("cert1Title", e.target.value)} className="mb-2" />
                <label className="text-xs text-muted-foreground block mb-1">Kort 1 — Undertitel</label>
                <Input value={config.about.cert1Sub} onChange={(e) => upAbout("cert1Sub", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Kort 2 — Titel</label>
                <Input value={config.about.cert2Title} onChange={(e) => upAbout("cert2Title", e.target.value)} className="mb-2" />
                <label className="text-xs text-muted-foreground block mb-1">Kort 2 — Undertitel</label>
                <Input value={config.about.cert2Sub} onChange={(e) => upAbout("cert2Sub", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* ── TJENESTER ── */}
        {activeTab === "services" && (
          <div className="bg-background rounded-sm border border-border p-6">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
              <h2 className="font-serif text-2xl">Tjenester & priser</h2>
              <Button variant="outline" size="sm" onClick={addService}>
                <Plus className="w-4 h-4 mr-1" /> Tilføj tjeneste
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              De første 4 tjenester vises på forsiden. Alle tjenester vises på services-siden.
            </p>
            <div className="space-y-4">
              {config.services.map((s, idx) => (
                <div key={s.id} className="border border-border rounded-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                      {idx < 4 ? `Tjeneste ${idx + 1} · Vist på forsiden` : `Tjeneste ${idx + 1}`}
                    </span>
                    <button
                      onClick={() => removeService(s.id)}
                      className="text-destructive hover:text-destructive/80 p-1"
                      title="Slet tjeneste"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Navn</label>
                      <Input value={s.title} onChange={(e) => upService(s.id, "title", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Pris</label>
                      <Input value={s.price} onChange={(e) => upService(s.id, "price", e.target.value)} placeholder="200 kr" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Tid</label>
                      <Input value={s.time} onChange={(e) => upService(s.id, "time", e.target.value)} placeholder="30 min" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground block mb-1">Beskrivelse</label>
                      <Textarea value={s.desc} onChange={(e) => upService(s.id, "desc", e.target.value)} rows={2} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MEDLEMSKABER ── */}
        {activeTab === "memberships" && (
          <div className="bg-background rounded-sm border border-border p-6">
            <h2 className="font-serif text-2xl mb-6 pb-3 border-b border-border">Medlemskaber</h2>
            <div className="space-y-8">
              {config.memberships.map((m) => (
                <div key={m.id} className={`border rounded-sm p-5 ${m.highlight ? "border-gold" : "border-border"}`}>
                  <div className="flex items-center gap-2 mb-4">
                    {m.highlight && <span className="text-[10px] bg-gold text-primary px-2 py-0.5 rounded-sm uppercase tracking-widest">Mest populær</span>}
                    <h3 className="font-medium">{m.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Navn</label>
                      <Input value={m.name} onChange={(e) => upMembership(m.id, "name", e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Pris (kun tal)</label>
                      <Input value={m.price} onChange={(e) => upMembership(m.id, "price", e.target.value)} placeholder="499" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground block mb-1">Slogan</label>
                      <Input value={m.tagline} onChange={(e) => upMembership(m.id, "tagline", e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground block mb-1">Knaptekst (CTA)</label>
                      <Input value={m.cta} onChange={(e) => upMembership(m.id, "cta", e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-muted-foreground block mb-1">
                        Fordele — én fordel per linje
                      </label>
                      <Textarea
                        value={m.perks.join("\n")}
                        onChange={(e) => upPerks(m.id, e.target.value)}
                        rows={m.perks.length + 1}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── UDGIV ── */}
        {activeTab === "publish" && (
          <div className="bg-background rounded-sm border border-border p-6">
            <h2 className="font-serif text-2xl mb-6 pb-3 border-b border-border">Udgiv ændringer</h2>

            <div className="bg-secondary rounded-sm p-4 mb-6 text-sm space-y-2">
              <p className="font-medium">Sådan fungerer det:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Rediger indholdet i fanerne ovenfor</li>
                <li>Klik "Udgiv ændringer" herunder</li>
                <li>GitHub bygger siden automatisk (~2 minutter)</li>
                <li>Dine ændringer er live på ab-barberlounge2.dk</li>
              </ol>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">GitHub Personal Access Token</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Opret et token på{" "}
                <strong>github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens</strong>.
                Giv det adgang til repository <strong>S-nderborg-Salon-Unlimited-Cuts</strong> med tilladelsen{" "}
                <strong>Contents: Read and write</strong>. Tokenet gemmes kun i din browser.
              </p>
              <div className="relative max-w-lg">
                <Input
                  type={showToken ? "text" : "password"}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="github_pat_..."
                  className="pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              variant="gold"
              size="lg"
              onClick={handlePublish}
              disabled={publishStatus === "loading"}
              className="min-w-48"
            >
              {publishStatus === "loading" ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Udgiver...</>
              ) : (
                "Udgiv ændringer"
              )}
            </Button>

            {publishStatus === "success" && (
              <div className="flex items-start gap-2 mt-4 p-4 bg-green-50 border border-green-200 rounded-sm text-green-800 text-sm">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{publishMsg}</span>
              </div>
            )}
            {publishStatus === "error" && (
              <div className="flex items-start gap-2 mt-4 p-4 bg-red-50 border border-red-200 rounded-sm text-red-800 text-sm">
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Udgivelse fejlede</p>
                  <p>{publishMsg}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating save reminder */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Ændringer gemmes ikke automatisk — gå til fanen <strong>Udgiv</strong> for at gøre dem permanente.
        </p>
      </div>
    </div>
  );
}
