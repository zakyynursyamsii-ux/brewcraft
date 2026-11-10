import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Coffee, Search, X, Clock, Thermometer, Droplets, Scale, Settings2, Gauge,
  Play, Pause, RotateCcw, SkipForward, ChevronRight, Minus, Plus, Snowflake, Flame,
  Heart, Volume2, VolumeX, Award, Sparkles, Timer, ExternalLink, Info, CheckCircle2, Sun,
  Smartphone, NotebookPen, Star, Save, History, Trash2, Copy, Check, Upload, FileCode2, GitBranch, Rocket, ChevronDown,
} from "lucide-react";

/* ==================================================================
   DATA RESEP — fokus: V60 (Hot & Iced) + Manual Espresso
   ------------------------------------------------------------------
   V60 Hot  : water = total air (g). target step = berat kumulatif di timbangan.
   V60 Iced : water = air PANAS (g), ice = es batu (g). Rasio = (air+es)/kopi.
   Espresso : water = YIELD di cangkir (g). target step = berat espresso di cangkir.
   ================================================================== */
const RECIPES = [
  // ---------------------------- V60 HOT ----------------------------
  {
    id: "hoffmann-v60", kind: "v60", style: "Hot",
    name: "The Ultimate V60 Technique", barista: "James Hoffmann",
    credential: "Juara Dunia Barista 2007", origin: "Inggris",
    coffee: 30, water: 500, temp: 100, tempNote: "Sepanas mungkin — air baru mendidih",
    grind: { level: "Medium-fine", scale: 4, ref: "Seperti garam meja agak kasar",
      clicks: { "Comandante C40": "22–26 klik", "Timemore C2": "16–18 klik" } },
    flavor: "Seimbang, manis, dan jernih. Bloom yang di-swirl dan dua tuangan besar membuat ekstraksi merata — resep harian yang cocok untuk hampir semua biji light–medium roast.",
    tags: ["Clean", "Sweet", "Balanced"],
    source: "https://www.youtube.com/watch?v=AI4ynXzkSQo",
    steps: [
      { t: 0, title: "Bloom", target: 60, desc: "Tuang hingga {target}g (2× berat kopi), lalu swirl dripper dengan kuat agar semua bubuk basah." },
      { t: 45, title: "Tuangan utama 1", target: 300, desc: "Tuang melingkar hingga {target}g (±60% air) dalam 30 detik." },
      { t: 75, title: "Tuangan utama 2", target: 500, desc: "Tuang lebih pelan hingga {target}g." },
      { t: 105, title: "Stir & swirl", target: null, desc: "Aduk 1× searah jarum jam dan 1× berlawanan, biarkan turun sedikit, lalu swirl pelan agar bed rata." },
      { t: 120, title: "Drawdown", target: null, desc: "Biarkan air turun sampai habis. Target selesai sekitar 3:30." },
    ],
    total: 210,
  },
  {
    id: "kasuya-46", kind: "v60", style: "Hot",
    name: "4:6 Method", barista: "Tetsu Kasuya",
    credential: "Juara World Brewers Cup 2016", origin: "Jepang",
    coffee: 20, water: 300, temp: 92, tempNote: "92°C untuk light roast; turunkan untuk roast lebih gelap",
    grind: { level: "Coarse", scale: 7, ref: "Seperti gula pasir kasar",
      clicks: { "Comandante C40": "±30 klik", "Timemore C2": "22–24 klik" } },
    flavor: "Resep yang bisa 'disetel': 40% air pertama mengatur manis vs asam, 60% sisanya mengatur kekuatan. Hasil standar manis, bulat, dan bersih walau pakai gilingan kasar.",
    tags: ["Sweet", "Adjustable", "Juara Dunia"],
    source: "https://www.hario-europe.com/blogs/hario-community/v60-ambassadors-tetsu-kasuya",
    steps: [
      { t: 0, title: "Tuangan 1 · 40% rasa", target: 60, desc: "Tuang hingga {target}g. Tuangan pertama lebih kecil = lebih manis; lebih besar = lebih cerah/asam." },
      { t: 45, title: "Tuangan 2 · 40% rasa", target: 120, desc: "Tuang hingga {target}g. Dua tuangan pertama menentukan keseimbangan rasa." },
      { t: 90, title: "Tuangan 3 · 60% kekuatan", target: 180, desc: "Tuang hingga {target}g. Mulai fase kekuatan." },
      { t: 135, title: "Tuangan 4 · 60% kekuatan", target: 240, desc: "Tuang hingga {target}g dengan gerakan melingkar perlahan." },
      { t: 180, title: "Tuangan 5 · 60% kekuatan", target: 300, desc: "Tuang hingga {target}g, lalu biarkan drawdown." },
      { t: 210, title: "Angkat dripper", target: null, desc: "Pada 3:30 angkat dripper walau masih ada air tersisa. Sajikan." },
    ],
    total: 220, time: 210,
  },
  {
    id: "perger-v60", kind: "v60", style: "Hot",
    name: "Perger V60 Method", barista: "Matt Perger",
    credential: "Juara World Brewers Cup 2012", origin: "Australia",
    coffee: 12, water: 200, temp: 97, tempNote: "Hampir mendidih",
    grind: { level: "Fine", scale: 3, ref: "Lebih halus dari garam meja",
      clicks: { "Comandante C40": "18–20 klik", "Timemore C2": "13–15 klik" } },
    flavor: "Ringan, cepat, dan bertekstur halus. Gilingan halus dengan rasio 1:16,7 menghasilkan satu cangkir kecil yang cerah dengan aroma menonjol.",
    tags: ["Bright", "Quick", "Single cup"],
    source: "https://longshortlondon.com/matt-perger-the-v60-pour-over-method/",
    steps: [
      { t: 0, title: "Bloom + stir", target: 50, desc: "Tuang hingga {target}g dan aduk menyeluruh agar tidak ada gumpalan kering." },
      { t: 30, title: "Tuangan 2", target: 100, desc: "Tuang hingga {target}g dengan perlahan di tengah." },
      { t: 60, title: "Tuangan terakhir", target: 200, desc: "Tuang hingga {target}g, akhiri di tepi untuk membilas dinding filter, lalu swirl." },
      { t: 90, title: "Drawdown", target: null, desc: "Biarkan turun hingga habis. Target selesai sekitar 2:20." },
    ],
    total: 140,
  },

  // ---------------------------- V60 ICED ---------------------------
  {
    id: "hoffmann-iced", kind: "v60", style: "Iced",
    name: "Ice Japanese V60", barista: "James Hoffmann",
    credential: "Juara Dunia Barista 2007", origin: "Inggris",
    coffee: 15, water: 150, ice: 100, temp: 100, tempNote: "Air baru mendidih — es akan langsung mendinginkan",
    grind: { level: "Medium-fine+", scale: 4, ref: "Sedikit lebih halus dari V60 panas (air lebih sedikit)",
      clicks: { "Comandante C40": "20–24 klik", "Timemore C2": "15–17 klik" } },
    flavor: "Flash brew: kopi diseduh panas langsung ke atas es sehingga aromatik terkunci. Hasilnya segar, harum, dan manis seperti teh buah — jauh lebih hidup daripada kopi panas yang didinginkan.",
    tags: ["Refreshing", "Aromatic", "60:40"],
    source: "https://secure.lamose.com/blogs/recipes/james-hoffmanns-ultimate-v60-pour-over-recipe",
    steps: [
      { t: 0, title: "Siapkan es & bloom", target: 30, desc: "Es batu {ice}g sudah di server. Tuang air hingga {target}g (2× kopi) dan swirl kuat." },
      { t: 45, title: "Tuangan utama", target: 150, desc: "Tuang stabil melingkar hingga {target}g air panas (bukan termasuk es)." },
      { t: 75, title: "Swirl", target: null, desc: "Swirl dripper pelan agar bed kopi rata dan drawdown konsisten." },
      { t: 90, title: "Drawdown", target: null, desc: "Biarkan turun habis ke atas es. Target selesai ±2:30." },
      { t: 150, title: "Aduk & sajikan", target: null, desc: "Swirl/aduk server sampai es kecil mencair, tuang ke gelas berisi es baru." },
    ],
    total: 165,
  },
  {
    id: "japanese-iced-classic", kind: "v60", style: "Iced",
    name: "Ice Japanese V60 Klasik", barista: "Resep Dasar 60:40",
    credential: "Rasio flash brew yang umum dipakai kedai specialty", origin: "Gaya Jepang",
    coffee: 30, water: 270, ice: 180, temp: 93, tempNote: "±92–94°C",
    grind: { level: "Medium-fine", scale: 4, ref: "Seperti garam meja",
      clicks: { "Comandante C40": "22–25 klik", "Timemore C2": "16–18 klik" } },
    flavor: "Versi dua cangkir dengan 60% air panas dan 40% es. Tiga tuangan membuat kontrol lebih mudah — tebal, manis, dan tetap jernih setelah dingin.",
    tags: ["2 cangkir", "Bold", "Iced"],
    source: "https://www.brewcoffeehome.com/wprm_print/japanese-style-iced-coffee-recipe",
    steps: [
      { t: 0, title: "Es & bloom", target: 60, desc: "Masukkan {ice}g es ke server. Tuang hingga {target}g dan swirl." },
      { t: 40, title: "Tuangan 2", target: 165, desc: "Tuang melingkar hingga {target}g." },
      { t: 75, title: "Tuangan 3", target: 270, desc: "Tuang hingga {target}g — total air panas." },
      { t: 105, title: "Swirl & drawdown", target: null, desc: "Swirl pelan dan biarkan turun ke atas es. Target selesai ±2:45." },
      { t: 165, title: "Aduk & sajikan", target: null, desc: "Aduk server hingga dingin merata, sajikan di atas es baru." },
    ],
    total: 180,
  },

  // ---------------------------- ESPRESSO ---------------------------
  {
    id: "espresso-normale", kind: "espresso", style: "Klasik",
    name: "Espresso Normale 1:2", barista: "Rasio Dasar 1:2",
    credential: "Titik awal di kursus Hoffmann, Scott Rao & Barista Hustle", origin: "Standar specialty",
    coffee: 18, water: 36, temp: 93, tempNote: "±93°C · panaskan portafilter & cangkir", pressure: "9 bar",
    grind: { level: "Fine (espresso)", scale: 1, ref: "Halus seperti tepung kasar" },
    shotTime: "25–30 detik",
    flavor: "Shot seimbang antara manis, asam, dan body. Ini 'resep nol' untuk dial-in biji baru: kunci dosis dulu, lalu yield, baru atur gilingan sampai waktunya pas.",
    tags: ["Balanced", "Dial-in base", "Milk-friendly"],
    source: "https://clivecoffee.com/blogs/learn/espresso-extraction-time-ratio-a-complete-guide-clive-coffee",
    steps: [
      { t: 0, title: "Pre-infusion", target: null, pressure: "2–4 bar", desc: "Mulai pompa/tuas. Puck jenuh perlahan; tetes pertama muncul ±5–7 detik." },
      { t: 6, title: "Ekstraksi utama", target: 36, pressure: "9 bar", desc: "Aliran seperti ekor tikus, warna cokelat madu. Kejar {target}g di cangkir." },
      { t: 28, title: "Stop", target: null, pressure: "—", desc: "Hentikan tepat di target berat. Aduk sebentar sebelum dicicipi." },
    ],
    total: 30,
  },
  {
    id: "espresso-ristretto", kind: "espresso", style: "Klasik",
    name: "Ristretto 1:1,5", barista: "Rasio Dasar Ristretto",
    credential: "Shot pendek untuk medium–dark roast & minuman susu", origin: "Tradisi Italia",
    coffee: 18, water: 27, temp: 92, tempNote: "±91–93°C", pressure: "9 bar",
    grind: { level: "Extra fine", scale: 1, ref: "Sedikit lebih halus dari normale" },
    shotTime: "20–25 detik",
    flavor: "Pekat, sirupi, dan manis dengan keasaman lebih rendah. Paling cocok untuk flat white, cortado, atau biji medium-dark roast.",
    tags: ["Syrupy", "Intense", "Low acid"],
    source: "https://completehomebarista.com/guides/espresso-shot-timing-how-long/",
    steps: [
      { t: 0, title: "Pre-infusion", target: null, pressure: "2–4 bar", desc: "Basahi puck perlahan hingga tetes pertama." },
      { t: 6, title: "Ekstraksi", target: 27, pressure: "9 bar", desc: "Aliran tipis dan lambat. Kejar {target}g di cangkir." },
      { t: 23, title: "Stop", target: null, pressure: "—", desc: "Hentikan lebih awal — jangan biarkan sampai blonding (pucat)." },
    ],
    total: 25,
  },
  {
    id: "turbo-shot", kind: "espresso", style: "Modern",
    name: "Turbo Shot", barista: "Hendon, Perger dkk.",
    credential: "Riset 'Systematically Improving Espresso' (2020)", origin: "Riset ilmiah",
    coffee: 15, water: 40, temp: 93, tempNote: "±92–94°C", pressure: "6 bar",
    grind: { level: "Medium-fine", scale: 2, ref: "Jauh lebih kasar dari espresso biasa" },
    shotTime: "±15 detik",
    flavor: "Gilingan lebih kasar, tekanan rendah, dan waktu cepat menghasilkan shot yang lebih konsisten dan jernih dengan ekstraksi tinggi — cocok untuk light roast dan grinder rumahan.",
    tags: ["Consistent", "Light roast", "Fast"],
    source: "https://www.brewcoffeehome.com/?p=15161",
    steps: [
      { t: 0, title: "Naik ke 6 bar", target: null, pressure: "→ 6 bar", desc: "Pada lever/Flair: tekan ringan sampai ±6 bar. Aliran akan cepat — itu normal." },
      { t: 3, title: "Ekstraksi cepat", target: 40, pressure: "6 bar", desc: "Tahan di ±6 bar, kejar {target}g di cangkir." },
      { t: 15, title: "Stop & aduk", target: null, pressure: "—", desc: "Hentikan di target. Aduk karena shot cepat cenderung berlapis." },
    ],
    total: 18,
  },
  {
    id: "rao-allonge", kind: "espresso", style: "Modern",
    name: "Allongé 1:5", barista: "Scott Rao",
    credential: "Penulis 'The Professional Barista's Handbook'", origin: "Montreal",
    coffee: 18, water: 90, temp: 95, tempNote: "±94–96°C (light roast)", pressure: "4–9 bar",
    grind: { level: "Medium-fine (kasar u/ espresso)", scale: 2, ref: "Kasar — aliran deras" },
    shotTime: "±30 detik",
    flavor: "Shot panjang, deras, dan tinggi ekstraksi. Rasanya ringan seperti teh dengan buah dan floral yang jelas — 'jembatan' antara espresso dan pour-over.",
    tags: ["Tea-like", "Fruity", "Light roast"],
    source: "https://decentespresso.com/docs/all_about_rao_allong",
    steps: [
      { t: 0, title: "Pre-infusion", target: null, pressure: "2–3 bar", desc: "Jenuhkan puck singkat." },
      { t: 5, title: "Aliran deras", target: 90, pressure: "naik bebas", desc: "Biarkan mengalir deras — tekanan akan rendah karena gilingan kasar. Kejar {target}g." },
      { t: 28, title: "Stop", target: null, pressure: "—", desc: "Hentikan di target, aduk, cicipi setelah sedikit dingin." },
    ],
    total: 30,
  },
  {
    id: "lever-profile", kind: "espresso", style: "Lever",
    name: "Profil Lever Manual", barista: "Panduan BrewCraft",
    credential: "Untuk Flair, Cafelat Robot & lever rumahan", origin: "Home barista",
    coffee: 18, water: 40, temp: 95, tempNote: "Air ±96–100°C — alat manual cepat kehilangan panas, preheat!", pressure: "9 → 6 bar",
    grind: { level: "Fine (espresso)", scale: 1, ref: "Halus, sedikit lebih kasar dari mesin pompa" },
    shotTime: "±45 detik total",
    flavor: "Profil klasik 'declining pressure' yang paling bersahabat untuk tuas: pre-infusion pelan, puncak 9 bar, lalu turun ke 6 bar. Manis, body tebal, dan minim pahit di akhir.",
    tags: ["Manual", "Pressure profile", "Sweet finish"],
    source: "https://completehomebarista.com/guides/espresso-shot-timing-how-long/",
    steps: [
      { t: 0, title: "Pre-infusion", target: null, pressure: "1–3 bar", desc: "Tekan tuas sangat ringan sampai ada perlawanan. Tahan agar puck jenuh." },
      { t: 10, title: "Naik ke puncak", target: 5, pressure: "→ 8–9 bar", desc: "Naikkan tekanan perlahan. Tetes pertama muncul — sekitar {target}g." },
      { t: 15, title: "Tahan puncak", target: 25, pressure: "8–9 bar", desc: "Tahan stabil di 8–9 bar hingga ±{target}g." },
      { t: 30, title: "Declining", target: 40, pressure: "9 → 6 bar", desc: "Kurangi tekanan perlahan ke ±6 bar, kejar {target}g di cangkir." },
      { t: 42, title: "Stop", target: null, pressure: "—", desc: "Lepas tuas, aduk, sajikan." },
    ],
    total: 45,
  },
];

const KINDS = {
  v60: { label: "V60", styles: ["Hot", "Iced"], dose: [8, 60, 1], ratio: [12, 20, 0.1], presets: [12, 15, 18, 20, 25, 30] },
  espresso: { label: "Espresso", styles: ["Klasik", "Modern", "Lever"], dose: [7, 25, 0.5], ratio: [1, 6, 0.1], presets: [14, 15, 16, 18, 20, 22] },
};
const GRINDERS = ["Comandante C40", "Timemore C2"];

/* ------------------------------ utils ------------------------------ */
const fmt = (s) => { const v = Math.max(0, Math.round(s)); return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`; };
const round1 = (x) => Math.round(x * 10) / 10;
const fmtRatio = (x) => `1:${(Math.round(x * 10) / 10).toString().replace(".", ",")}`;
const ratioOf = (r) => (r.water + (r.ice || 0)) / r.coffee;
const iceShareOf = (r) => (r.ice ? r.ice / (r.water + r.ice) : 0);
const fill = (txt, grams, ice) => txt.replace("{target}", grams ?? "").replace("{ice}", ice ?? "");
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  ok() { try { localStorage.setItem("__bc", "1"); localStorage.removeItem("__bc"); return true; } catch { return false; } },
};
const fmtNum = (v) => (typeof v === "number" ? String(round1(v)).replace(".", ",") : v);

function KindIcon({ kind, className = "w-5 h-5" }) {
  const p = { className, fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" };
  if (kind === "v60") return (<svg {...p}><path d="M4 5h16l-6 9h-4z" /><path d="M10 14v2h4v-2" /><path d="M6 19h12" /></svg>);
  return (<svg {...p}><path d="M3 8h12v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" /><path d="M15 9.5h6" /><path d="M7 15v2M11 15v2" /><path d="M6 21h6" /></svg>);
}
const StyleIcon = ({ style, className = "w-3.5 h-3.5" }) =>
  style === "Iced" ? <Snowflake className={className} /> : style === "Hot" ? <Flame className={className} /> : style === "Lever" ? <Gauge className={className} /> : <Sparkles className={className} />;

/* ================================ APP ================================ */
export default function BrewCraft() {
  const [kind, setKind] = useState("all");
  const [style, setStyle] = useState("all");
  const [query, setQuery] = useState("");
  const [favOnly, setFavOnly] = useState(false);
  const [favs, setFavs] = useState(() => store.get("brewcraft-favs", []));
  const [logs, setLogs] = useState(() => store.get("brewcraft-logs", []));
  const [active, setActive] = useState(null); // { id, tab }
  const [logOpen, setLogOpen] = useState(false);
  const storageOK = useMemo(() => store.ok(), []);
  const guideRef = useRef(null);

  useEffect(() => store.set("brewcraft-favs", favs), [favs]);
  useEffect(() => store.set("brewcraft-logs", logs), [logs]);
  const toggleFav = (id) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const addLog = (entry) => setLogs((l) => [{ ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: Date.now() }, ...l]);
  const deleteLog = (id) => setLogs((l) => l.filter((x) => x.id !== id));
  const pickKind = (k) => { setKind(k); setStyle("all"); };

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES.filter((r) => kind === "all" || r.kind === kind)
      .filter((r) => style === "all" || r.style === style)
      .filter((r) => !favOnly || favs.includes(r.id))
      .filter((r) => !q || `${r.name} ${r.barista} ${r.style} ${r.tags.join(" ")}`.toLowerCase().includes(q));
  }, [kind, style, query, favOnly, favs]);

  const activeRecipe = active && RECIPES.find((r) => r.id === active.id);
  useEffect(() => { document.body.style.overflow = activeRecipe || logOpen ? "hidden" : ""; }, [activeRecipe, logOpen]);
  const countK = (k) => RECIPES.filter((r) => k === "all" || r.kind === k).length;
  const logCount = (id) => logs.filter((l) => l.recipeId === id).length;

  return (
    <div className="min-h-screen bg-cream text-espresso font-sans selection:bg-copper/30">
      <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur border-b border-espresso/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-espresso text-gold grid place-items-center shrink-0"><Coffee className="w-5 h-5" /></div>
            <div className="leading-tight min-w-0">
              <div className="font-display text-xl font-semibold tracking-tight">BrewCraft</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-clay hidden sm:block">V60 & Manual Espresso</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={() => guideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="h-10 w-10 sm:w-auto sm:px-4 rounded-full border border-espresso/15 hover:border-copper flex items-center justify-center gap-2 text-sm" aria-label="Panduan akses via HP">
              <Smartphone className="w-4 h-4" /><span className="hidden md:inline">Akses via HP</span>
            </button>
            <button onClick={() => setLogOpen(true)}
              className="h-10 px-3 sm:px-4 rounded-full border border-espresso/15 hover:border-copper flex items-center gap-2 text-sm">
              <NotebookPen className="w-4 h-4" /><span className="hidden sm:inline">Brew Log</span><span className="text-xs opacity-70">{logs.length}</span>
            </button>
            <button onClick={() => setFavOnly((v) => !v)}
              className={`h-10 px-3 sm:px-4 rounded-full border flex items-center gap-2 text-sm transition ${favOnly ? "bg-espresso text-cream border-espresso" : "border-espresso/15 hover:border-copper"}`}>
              <Heart className={`w-4 h-4 ${favOnly ? "fill-gold text-gold" : ""}`} /><span className="hidden sm:inline">Favorit</span><span className="text-xs opacity-70">{favs.length}</span>
            </button>
          </div>
        </div>
      </header>

      {!storageOK && (
        <div className="bg-amber-100 text-amber-900 text-xs sm:text-sm px-4 py-2.5 text-center">
          Browser ini memblokir penyimpanan lokal — catatan hanya bertahan sampai tab ditutup. Gunakan "Salin backup" di Brew Log.
        </div>
      )}

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-copper mb-3"><Sparkles className="w-3.5 h-3.5" /> Dua alat, resep para juara</div>
        <h1 className="font-display text-[2.4rem] sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight max-w-3xl">
          Seduh seperti <em className="text-copper font-normal">juara</em>, di dapurmu sendiri.
        </h1>
        <p className="mt-3 text-espresso/70 max-w-xl sm:text-lg">V60 panas & es, serta shot espresso manual — dengan kalkulator presisi, timer per tahap, dan catatan seduh pribadimu.</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:max-w-xl">
          {Object.entries(KINDS).map(([k, v]) => (
            <button key={k} onClick={() => pickKind(kind === k ? "all" : k)}
              className={`relative text-left rounded-2xl p-4 border transition overflow-hidden ${kind === k ? "bg-espresso text-cream border-espresso shadow-lg shadow-espresso/20" : "bg-white/70 border-espresso/10 hover:border-copper"}`}>
              <KindIcon kind={k} className={`w-16 h-16 absolute -right-2 -bottom-3 ${kind === k ? "text-cream/15" : "text-espresso/[0.07]"}`} />
              <KindIcon kind={k} className={`w-6 h-6 ${kind === k ? "text-gold" : "text-copper"}`} />
              <div className="font-display text-xl font-semibold mt-2">{k === "v60" ? "V60" : "Manual Espresso"}</div>
              <div className={`text-xs mt-0.5 ${kind === k ? "text-cream/60" : "text-espresso/50"}`}>{countK(k)} resep · {v.styles.join(" / ")}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 no-scrollbar">
            {["all", ...(kind === "all" ? [...KINDS.v60.styles, ...KINDS.espresso.styles] : KINDS[kind].styles)].map((st) => {
              const n = RECIPES.filter((r) => (kind === "all" || r.kind === kind) && (st === "all" || r.style === st)).length;
              return (
                <button key={st} onClick={() => setStyle(st)}
                  className={`shrink-0 h-10 flex items-center gap-1.5 px-4 rounded-full text-sm border transition ${style === st ? "bg-copper text-white border-copper" : "bg-white/60 border-espresso/10 hover:border-copper text-espresso/80"}`}>
                  {st !== "all" && <StyleIcon style={st} />}
                  {st === "all" ? "Semua" : st === "Hot" ? "Hot V60" : st === "Iced" ? "Iced V60" : st}
                  <span className={`text-xs ${style === st ? "text-white/80" : "text-clay/70"}`}>{n}</span>
                </button>
              );
            })}
          </div>
          <label className="relative sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-clay" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari resep, barista, rasa…"
              className="w-full h-11 pl-10 pr-9 rounded-full bg-white/70 border border-espresso/10 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20 text-sm placeholder:text-espresso/40" />
            {query && (<button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-clay" aria-label="Hapus"><X className="w-4 h-4" /></button>)}
          </label>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {list.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-espresso/20 rounded-3xl">
            <Coffee className="w-10 h-10 mx-auto text-clay/50" />
            <p className="mt-3 text-espresso/60">Tidak ada resep yang cocok.</p>
            <button onClick={() => { pickKind("all"); setQuery(""); setFavOnly(false); }} className="mt-4 text-sm text-copper underline underline-offset-4">Reset filter</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {list.map((r) => (<RecipeCard key={r.id} r={r} fav={favs.includes(r.id)} logs={logCount(r.id)} onFav={() => toggleFav(r.id)} onOpen={() => setActive({ id: r.id, tab: "brew" })} />))}
          </div>
        )}
      </main>

      <div ref={guideRef} className="scroll-mt-20"><DeployGuide /></div>

      <footer className="border-t border-espresso/10 py-8 text-center text-xs text-espresso/50 px-4">
        Parameter disarikan dari sumber publik tiap barista · Klik grinder & waktu shot adalah titik awal — sesuaikan dengan biji dan selera.
      </footer>

      {activeRecipe && (
        <RecipeModal key={activeRecipe.id} r={activeRecipe} initialTab={active.tab} fav={favs.includes(activeRecipe.id)}
          onFav={() => toggleFav(activeRecipe.id)} onClose={() => setActive(null)}
          logs={logs.filter((l) => l.recipeId === activeRecipe.id)} onAddLog={addLog} onDeleteLog={deleteLog} />
      )}
      {logOpen && (
        <LogDrawer logs={logs} onClose={() => setLogOpen(false)} onDelete={deleteLog}
          onOpenRecipe={(id) => { setLogOpen(false); setActive({ id, tab: "log" }); }}
          onImport={(arr) => setLogs((l) => { const ids = new Set(l.map((x) => x.id)); return [...arr.filter((x) => !ids.has(x.id)), ...l].sort((a, b) => b.createdAt - a.createdAt); })} />
      )}
    </div>
  );
}

/* ------------------------------ Card ------------------------------ */
function RecipeCard({ r, fav, logs, onFav, onOpen }) {
  const esp = r.kind === "espresso";
  const iced = r.style === "Iced";
  const stats = esp
    ? [[<Scale key="a" className="w-3.5 h-3.5" />, `${r.coffee}g`, "Dosis"], [<Coffee key="b" className="w-3.5 h-3.5" />, `${r.water}g`, "Yield"], [<Gauge key="c" className="w-3.5 h-3.5" />, r.pressure.split(" ")[0], "Bar"], [<Clock key="d" className="w-3.5 h-3.5" />, `${r.total}s`, "Waktu"]]
    : [[<Scale key="a" className="w-3.5 h-3.5" />, `${r.coffee}g`, "Kopi"], [<Droplets key="b" className="w-3.5 h-3.5" />, `${r.water}g`, iced ? "Air panas" : "Air"], iced ? [<Snowflake key="c" className="w-3.5 h-3.5" />, `${r.ice}g`, "Es"] : [<Thermometer key="c" className="w-3.5 h-3.5" />, `${r.temp}°`, "Suhu"], [<Clock key="d" className="w-3.5 h-3.5" />, fmt(r.time ?? r.total), "Waktu"]];
  return (
    <article onClick={onOpen}
      className="group cursor-pointer rounded-3xl bg-white/70 border border-espresso/10 hover:border-copper/50 hover:shadow-[0_18px_40px_-20px_rgba(43,33,28,0.45)] transition-all duration-300 overflow-hidden flex flex-col">
      <div className={`relative h-32 sm:h-36 text-cream p-5 flex flex-col justify-between overflow-hidden ${iced ? "bg-gradient-to-br from-[#243340] via-[#2f3a40] to-[#4b4136]" : "bg-gradient-to-br from-espresso via-[#3a2a21] to-[#5a3b28]"}`}>
        <KindIcon kind={r.kind} className="w-40 h-40 absolute -right-6 -bottom-8 opacity-[0.12] group-hover:opacity-20 group-hover:scale-110 transition duration-500" />
        <div className="flex items-center justify-between relative">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] bg-cream/10 border border-cream/15 rounded-full px-2.5 py-1">
            <StyleIcon style={r.style} /> {esp ? `Espresso · ${r.style}` : `${r.style} V60`}
          </span>
          <button onClick={(e) => { e.stopPropagation(); onFav(); }} className="w-9 h-9 rounded-full grid place-items-center bg-cream/10 hover:bg-cream/20" aria-label="Favorit">
            <Heart className={`w-4 h-4 ${fav ? "fill-gold text-gold" : ""}`} />
          </button>
        </div>
        <div className="relative">
          <div className="text-gold text-xs flex items-center gap-1.5"><Award className="w-3.5 h-3.5" />{r.barista}</div>
          <h3 className="font-display text-xl font-semibold leading-tight mt-1">{r.name}</h3>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="grid grid-cols-4 gap-2 text-center">
          {stats.map(([ic, v, l]) => (
            <div key={l} className="rounded-xl bg-cream/80 py-2">
              <div className="flex justify-center text-clay">{ic}</div>
              <div className="text-sm font-semibold mt-0.5 tabular-nums">{v}</div>
              <div className="text-[10px] uppercase tracking-wider text-espresso/50">{l}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-espresso/70 line-clamp-2">{r.flavor}</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">{r.tags.slice(0, 2).map((t) => (<span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-copper/10 text-copper">{t}</span>))}</div>
          <span className="text-xs font-medium text-espresso/60 group-hover:text-copper flex items-center gap-0.5">{logs > 0 && <span className="mr-2 inline-flex items-center gap-1 text-clay"><NotebookPen className="w-3.5 h-3.5" />{logs}</span>}{fmtRatio(ratioOf(r))}<ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" /></span>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------ Modal ------------------------------ */
const TARGET_PRESETS = { Hot: [200, 250, 300, 400, 500], Iced: [250, 300, 400, 500], espresso: [30, 36, 40, 45, 60, 90] };

function RecipeModal({ r, initialTab, fav, onFav, onClose, logs, onAddLog, onDeleteLog }) {
  const K = KINDS[r.kind];
  const esp = r.kind === "espresso";
  const iced = !!r.ice;
  const baseRatio = ratioOf(r);
  const baseIce = iceShareOf(r);
  const baseTotal = r.water + (r.ice || 0);
  const [dMin, dMax, dStep] = K.dose;
  const tRange = esp ? [10, 150] : [100, 1000];

  const [mode, setMode] = useState("dose"); // dose | target
  const [dose, setDose] = useState(r.coffee);
  const [target, setTarget] = useState(baseTotal);
  const [ratio, setRatio] = useState(baseRatio);
  const [iceShare, setIceShare] = useState(baseIce);
  const [grinder, setGrinder] = useState(GRINDERS[0]);
  const [tab, setTab] = useState(initialTab || "brew"); // mobile: info|brew|log · desktop: brew|log

  const clampDose = (v) => Math.min(dMax, Math.max(dMin, round1(isNaN(v) ? dMin : v)));
  const clampTarget = (v) => Math.min(tRange[1], Math.max(tRange[0], Math.round(isNaN(v) ? tRange[0] : v)));

  // ---- kalkulasi presisi ----
  const effDose = mode === "dose" ? dose : clampDose(target / ratio);
  const totalLiquid = Math.round(mode === "dose" ? dose * ratio : target);
  const ice = iced ? Math.round(totalLiquid * iceShare) : 0;
  const water = totalLiquid - ice; // air panas (iced) / total air (hot) / yield (espresso) — selalu water + ice = total
  const realRatio = totalLiquid / effDose;
  const scale = water / r.water;
  const steps = useMemo(() => r.steps.map((s, i) => ({
    ...s, grams: s.target == null ? null : Math.round(s.target * scale),
    end: i < r.steps.length - 1 ? r.steps[i + 1].t : r.total,
  })), [r, scale]);

  const switchMode = (m) => {
    if (m === mode) return;
    if (m === "target") setTarget(totalLiquid); else setDose(clampDose(effDose));
    setMode(m);
  };
  const modified = Math.abs(effDose - r.coffee) > 0.05 || Math.abs(ratio - baseRatio) > 0.01 || Math.abs(iceShare - baseIce) > 0.005;
  const reset = () => { setDose(r.coffee); setTarget(baseTotal); setRatio(baseRatio); setIceShare(baseIce); };
  const useLog = (l) => { setMode("dose"); setDose(clampDose(l.dose)); setRatio(l.ratio); if (iced && l.iceShare) setIceShare(l.iceShare); setTab("brew"); };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const header = r.style === "Iced" ? "from-[#243340] via-[#2f3a40] to-[#4b4136]" : "from-espresso via-[#3a2a21] to-[#5a3b28]";
  const snapshot = { dose: effDose, water, ice, ratio: round1(realRatio), iceShare };
  const bigVal = mode === "dose" ? effDose : target;
  const tPresets = esp ? TARGET_PRESETS.espresso : TARGET_PRESETS[r.style];
  const targetLabel = esp ? "Target yield" : iced ? "Target minuman (air + es)" : "Target total air";

  const tabsMobile = [["info", "Resep"], ["brew", "Timer"], ["log", `Log${logs.length ? ` (${logs.length})` : ""}`]];
  const tabsDesktop = [["brew", "Resep & Timer"], ["log", `Brew Log${logs.length ? ` (${logs.length})` : ""}`]];
  const isLog = tab === "log";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm animate-fade" onClick={onClose} />
      <div className="relative w-full sm:max-w-5xl h-[100dvh] sm:h-[92vh] bg-cream sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-rise">
        <div className={`bg-gradient-to-br ${header} text-cream px-5 sm:px-8 pt-5 pb-4 sm:py-6 relative shrink-0`}>
          <div className="absolute right-4 top-4 flex gap-2">
            <button onClick={onFav} className="w-10 h-10 rounded-full bg-cream/10 hover:bg-cream/20 grid place-items-center" aria-label="Favorit"><Heart className={`w-4 h-4 ${fav ? "fill-gold text-gold" : ""}`} /></button>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-cream/10 hover:bg-cream/20 grid place-items-center" aria-label="Tutup"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-cream/70 pr-24">
            <StyleIcon style={r.style} /> {esp ? `Espresso · ${r.style}` : `${r.style} V60`} · {r.origin}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mt-1.5 pr-24 leading-tight">{r.name}</h2>
          <div className="mt-1 text-sm text-gold flex items-center gap-1.5 flex-wrap"><Award className="w-4 h-4" /> {r.barista}<span className="text-cream/50 text-xs sm:text-sm">· {r.credential}</span></div>
        </div>

        {/* Tabs */}
        <div className="flex lg:hidden border-b border-espresso/10 bg-cream shrink-0">
          {tabsMobile.map(([k, l]) => (<button key={k} onClick={() => setTab(k)} className={`flex-1 py-3.5 text-sm font-medium border-b-2 transition ${tab === k ? "border-copper text-espresso" : "border-transparent text-espresso/50"}`}>{l}</button>))}
        </div>
        <div className="hidden lg:flex gap-6 border-b border-espresso/10 bg-cream shrink-0 px-8">
          {tabsDesktop.map(([k, l]) => {
            const on = k === "log" ? isLog : !isLog;
            return (<button key={k} onClick={() => setTab(k)} className={`py-3 text-sm font-medium border-b-2 transition ${on ? "border-copper text-espresso" : "border-transparent text-espresso/50 hover:text-espresso"}`}>{l}</button>);
          })}
        </div>

        <div className="overflow-y-auto flex-1 overscroll-contain">
          {isLog ? (
            <div className="p-5 sm:p-7 max-w-3xl mx-auto">
              <BrewLogPanel r={r} logs={logs} snapshot={snapshot} onAdd={onAddLog} onDelete={onDeleteLog} onUse={useLog} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_1.1fr]">
              {/* LEFT */}
              <div className={`p-5 sm:p-7 space-y-5 lg:border-r border-espresso/10 ${tab === "info" ? "" : "hidden lg:block"}`}>
                <div>
                  <SectionTitle icon={<Coffee className="w-4 h-4" />}>Profil Rasa</SectionTitle>
                  <p className="text-sm text-espresso/75 leading-relaxed">{r.flavor}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">{r.tags.map((t) => (<span key={t} className="text-xs px-2.5 py-1 rounded-full bg-copper/10 text-copper">{t}</span>))}</div>
                </div>

                {/* Calculator */}
                <div className="rounded-2xl bg-white/80 border border-espresso/10 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <SectionTitle icon={<Scale className="w-4 h-4" />} noMargin>{esp ? "Kalkulator Shot" : iced ? "Kalkulator Ice Japanese" : "Kalkulator Hot V60"}</SectionTitle>
                    {modified && (<button onClick={reset} className="text-xs text-copper hover:underline flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Resep asli</button>)}
                  </div>

                  <div className="flex gap-1 p-1 rounded-full bg-cream mb-4">
                    {[["dose", "Dari dosis kopi"], ["target", esp ? "Dari target yield" : "Dari target hasil"]].map(([m, l]) => (
                      <button key={m} onClick={() => switchMode(m)} className={`flex-1 text-xs h-8 rounded-full transition ${mode === m ? "bg-espresso text-cream" : "text-espresso/60"}`}>{l}</button>
                    ))}
                  </div>

                  <div className="text-xs uppercase tracking-wider text-espresso/50 mb-2">{mode === "dose" ? (esp ? "Dosis di basket" : "Dosis kopi") : targetLabel}</div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => mode === "dose" ? setDose((d) => clampDose(d - dStep)) : setTarget((t) => clampTarget(t - (esp ? 1 : 10)))}
                      className="w-12 h-12 rounded-full border border-espresso/15 grid place-items-center hover:border-copper hover:text-copper active:scale-95" aria-label="Kurangi"><Minus className="w-5 h-5" /></button>
                    <div className="flex-1 text-center">
                      <NumberInput value={bigVal} onCommit={(v) => mode === "dose" ? setDose(clampDose(v)) : setTarget(clampTarget(v))} />
                      <div className="text-[11px] text-espresso/50 -mt-1">gram</div>
                    </div>
                    <button onClick={() => mode === "dose" ? setDose((d) => clampDose(d + dStep)) : setTarget((t) => clampTarget(t + (esp ? 1 : 10)))}
                      className="w-12 h-12 rounded-full border border-espresso/15 grid place-items-center hover:border-copper hover:text-copper active:scale-95" aria-label="Tambah"><Plus className="w-5 h-5" /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                    {(mode === "dose" ? K.presets : tPresets).map((g) => (
                      <button key={g} onClick={() => mode === "dose" ? setDose(g) : setTarget(g)}
                        className={`text-xs h-8 px-3 rounded-full border transition ${bigVal === g ? "bg-copper text-white border-copper" : "border-espresso/15 hover:border-copper"}`}>{g}g</button>
                    ))}
                  </div>

                  {/* Outputs */}
                  <div className={`grid gap-2 mt-4 ${iced ? "grid-cols-3" : "grid-cols-2"}`}>
                    {esp ? (
                      <>
                        <Out label="Dosis kopi" value={effDose} unit="g" sub="di basket" icon={<Scale className="w-3 h-3" />} />
                        <Out dark label="Target yield" value={water} unit="g" sub={`shot ${r.shotTime}`} />
                      </>
                    ) : iced ? (
                      <>
                        <Out label="Kopi" value={effDose} unit="g" sub="digiling" icon={<Scale className="w-3 h-3" />} />
                        <Out dark label="Air panas" value={water} unit="g" sub={`${Math.round((1 - iceShare) * 100)}% · dituang`} icon={<Flame className="w-3 h-3" />} />
                        <Out ice label="Es batu" value={ice} unit="g" sub={`${Math.round(iceShare * 100)}% · di server`} icon={<Snowflake className="w-3 h-3" />} />
                      </>
                    ) : (
                      <>
                        <Out label="Kopi" value={effDose} unit="g" sub="digiling" icon={<Scale className="w-3 h-3" />} />
                        <Out dark label="Total air" value={water} unit="g" sub={`≈ ${Math.max(0, Math.round(water - effDose * 2))} ml di cangkir`} />
                      </>
                    )}
                  </div>
                  {iced && (
                    <div className="mt-2 rounded-xl bg-[#e6eef2] text-[#243340] text-xs px-3 py-2 flex items-center justify-between gap-2">
                      <span>Setelah es mencair: <b className="tabular-nums">{water + ice}g</b> minuman</span>
                      <span className="tabular-nums font-semibold">rasio akhir {fmtRatio(realRatio)}</span>
                    </div>
                  )}

                  <Slider label={esp ? "Rasio (dosis : yield)" : iced ? "Rasio total (kopi : air+es)" : "Rasio"} value={ratio} base={baseRatio}
                    min={K.ratio[0]} max={K.ratio[1]} step={K.ratio[2]} onChange={setRatio} display={fmtRatio}
                    left={esp ? "Ristretto" : "Lebih pekat"} right={esp ? "Allongé" : "Lebih ringan"} />
                  {esp && (
                    <div className="flex gap-1.5 mt-2">
                      {[["Ristretto", 1.5], ["Normale", 2], ["Lungo", 3], ["Allongé", 5]].map(([n, v]) => (
                        <button key={n} onClick={() => setRatio(v)} className={`flex-1 text-[11px] h-8 rounded-full border ${Math.abs(ratio - v) < 0.05 ? "bg-espresso text-cream border-espresso" : "border-espresso/15 hover:border-copper"}`}>{n}</button>
                      ))}
                    </div>
                  )}
                  {iced && (
                    <Slider label="Porsi es" value={iceShare} base={baseIce} min={0.3} max={0.5} step={0.01} onChange={setIceShare}
                      display={(v) => `${Math.round(v * 100)}% es`} left="30% · lebih kuat panasnya" right="50% · lebih dingin" />
                  )}
                  {mode === "target" && effDose !== round1(target / ratio) && (
                    <div className="mt-3 text-[11px] text-amber-700">Dosis dibatasi {dMin}–{dMax} g untuk alat ini.</div>
                  )}

                  <div className="mt-5 border-t border-espresso/10 pt-4">
                    <div className="text-xs uppercase tracking-wider text-espresso/50 mb-2">{esp ? "Target berat di cangkir" : iced ? "Target timbangan (setelah es di-tare)" : "Target timbangan per tahap"}</div>
                    <div className="space-y-1.5">
                      {steps.filter((s) => s.grams != null).map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-espresso/70"><span className="tabular-nums text-clay mr-2 inline-block w-9">{esp ? `${s.end}s` : fmt(s.t)}</span>{s.title}</span>
                          <span className="font-semibold tabular-nums">{s.grams}g</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <ParamCard icon={<Thermometer className="w-4 h-4" />} label="Suhu air" value={`${r.temp}°C`} note={r.tempNote} />
                  {esp ? <ParamCard icon={<Gauge className="w-4 h-4" />} label="Tekanan" value={r.pressure} note={`Waktu ${r.shotTime}`} />
                    : <ParamCard icon={<Clock className="w-4 h-4" />} label="Total waktu" value={fmt(r.time ?? r.total)} note={`${r.steps.length} tahap`} />}
                </div>

                <div className="rounded-2xl bg-white/80 border border-espresso/10 p-4 sm:p-5">
                  <SectionTitle icon={<Settings2 className="w-4 h-4" />}>Ukuran Gilingan</SectionTitle>
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-display text-xl font-semibold">{r.grind.level}</div>
                    <div className="text-xs text-espresso/50 text-right">{r.grind.ref}</div>
                  </div>
                  <div className="mt-3">
                    <div className="flex gap-1">{Array.from({ length: 8 }).map((_, i) => (<div key={i} className={`h-2 flex-1 rounded-full ${i < r.grind.scale ? "bg-copper" : "bg-espresso/10"}`} />))}</div>
                    <div className="flex justify-between text-[10px] text-espresso/40 mt-1"><span>Espresso</span><span>Kasar</span></div>
                  </div>
                  {r.grind.clicks ? (
                    <>
                      <div className="mt-4 flex gap-1 p-1 rounded-full bg-cream">
                        {GRINDERS.map((g) => (<button key={g} onClick={() => setGrinder(g)} className={`flex-1 text-xs h-8 rounded-full transition ${grinder === g ? "bg-espresso text-cream" : "text-espresso/60"}`}>{g}</button>))}
                      </div>
                      <div className="mt-3 text-center">
                        <span className="font-display text-2xl font-semibold text-copper">{r.grind.clicks[grinder]}</span>
                        <div className="text-[11px] text-espresso/50 mt-0.5">titik awal pada {grinder}</div>
                      </div>
                    </>
                  ) : (
                    <div className="mt-4 space-y-2">
                      <div className="text-xs uppercase tracking-wider text-espresso/50">Panduan dial-in (target {r.shotTime})</div>
                      {[["Terlalu cepat / asam / encer", "Giling lebih halus"], ["Terlalu lambat / pahit / kering", "Giling lebih kasar"], ["Pas tapi kurang manis", "Coba rasio lebih panjang"], ["Pas tapi terlalu tajam", "Turunkan suhu 1–2°C"]].map(([a, b]) => (
                        <div key={a} className="flex items-center justify-between gap-3 text-sm rounded-xl bg-cream/80 px-3 py-2">
                          <span className="text-espresso/70">{a}</span><span className="font-medium text-copper text-right shrink-0">{b}</span>
                        </div>
                      ))}
                      <p className="text-[11px] text-espresso/50 pt-1">Butuh grinder khusus espresso. Ubah satu variabel per shot, lalu catat di Brew Log.</p>
                    </div>
                  )}
                </div>

                <a href={r.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-clay hover:text-copper"><ExternalLink className="w-3.5 h-3.5" /> Sumber resep</a>
              </div>

              {/* RIGHT */}
              <div className={`p-5 sm:p-7 bg-sand/40 ${tab === "brew" ? "" : "hidden lg:block"}`}>
                <BrewTimer steps={steps} total={r.total} water={water} ice={ice} esp={esp} onLog={() => setTab("log")} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Input angka yang tidak "melompat" saat diketik; commit saat blur/Enter */
function NumberInput({ value, onCommit }) {
  const [draft, setDraft] = useState(null);
  return (
    <input type="text" inputMode="decimal" value={draft ?? String(value).replace(".", ",")}
      onFocus={(e) => { setDraft(String(value).replace(".", ",")); setTimeout(() => e.target.select(), 0); }}
      onChange={(e) => setDraft(e.target.value.replace(/[^0-9.,]/g, ""))}
      onBlur={() => { if (draft != null) onCommit(parseFloat(draft.replace(",", "."))); setDraft(null); }}
      onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
      className="w-full text-center font-display text-4xl font-semibold bg-transparent focus:outline-none tabular-nums" aria-label="Nilai gram" />
  );
}

function Out({ label, value, unit, sub, dark, ice, icon, small }) {
  const tone = dark ? "bg-espresso text-cream" : ice ? "bg-[#e6eef2] text-[#243340]" : "bg-cream/90";
  const muted = dark ? "text-cream/60" : ice ? "text-[#243340]/60" : "text-espresso/50";
  return (
    <div className={`rounded-xl p-3 text-center flex flex-col justify-center ${tone}`}>
      <div className={`text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 ${muted}`}>{icon}{label}</div>
      <div className={`font-display font-semibold tabular-nums ${small ? "text-xl" : "text-[1.7rem]"} ${dark ? "text-gold" : ""}`}>{fmtNum(value)}{unit && <span className="text-sm ml-0.5">{unit}</span>}</div>
      <div className={`text-[10px] leading-tight ${muted}`}>{sub}</div>
    </div>
  );
}

function Slider({ label, value, base, min, max, step, onChange, display, left, right }) {
  return (
    <div className="mt-5">
      <div className="flex justify-between text-xs mb-2 gap-2">
        <span className="uppercase tracking-wider text-espresso/50">{label}</span>
        <span className="font-semibold tabular-nums text-right">{display(value)}{Math.abs(value - base) > step / 2 && <span className="text-espresso/40 font-normal ml-1">(asli {display(base).split(" ")[0]})</span>}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-copper h-6" />
      <div className="flex justify-between text-[10px] text-espresso/40"><span>{left}</span><span>{right}</span></div>
    </div>
  );
}

function SectionTitle({ icon, children, noMargin }) {
  return (<div className={`flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-clay font-medium ${noMargin ? "" : "mb-3"}`}>{icon}{children}</div>);
}

function ParamCard({ icon, label, value, note }) {
  return (
    <div className="rounded-2xl bg-white/80 border border-espresso/10 p-4">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-espresso/50">{icon}{label}</div>
      <div className="font-display text-2xl font-semibold mt-1">{value}</div>
      <div className="text-[11px] text-espresso/50 mt-0.5 leading-snug">{note}</div>
    </div>
  );
}

/* ------------------------------ Timer ------------------------------ */
function useBeep() {
  const ctxRef = useRef(null);
  const ensure = useCallback(() => {
    try {
      if (!ctxRef.current) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) ctxRef.current = new AC(); }
      if (ctxRef.current?.state === "suspended") ctxRef.current.resume();
    } catch { /* no audio */ }
  }, []);
  const beep = useCallback((freq = 880, dur = 0.18, times = 1) => {
    const ctx = ctxRef.current; if (!ctx) return;
    try {
      for (let i = 0; i < times; i++) {
        const st = ctx.currentTime + i * (dur + 0.08);
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = "sine"; o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, st); g.gain.exponentialRampToValueAtTime(0.25, st + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, st + dur);
        o.connect(g).connect(ctx.destination); o.start(st); o.stop(st + dur + 0.02);
      }
    } catch { /* ignore */ }
  }, []);
  return { ensure, beep };
}

function useWakeLock(active) {
  const [supported] = useState(() => typeof navigator !== "undefined" && "wakeLock" in navigator);
  const [on, setOn] = useState(false);
  const lockRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    const acquire = async () => {
      try { const l = await navigator.wakeLock.request("screen"); if (cancelled) { l.release(); return; } lockRef.current = l; setOn(true); l.addEventListener?.("release", () => setOn(false)); }
      catch { setOn(false); }
    };
    if (active && supported) acquire();
    return () => { cancelled = true; try { lockRef.current?.release(); } catch { /* ignore */ } lockRef.current = null; setOn(false); };
  }, [active, supported]);
  return on;
}

function BrewTimer({ steps, total, water, ice, esp, onLog }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState(true);
  const startRef = useRef(0);
  const baseRef = useRef(0);
  const lastIdx = useRef(-1);
  const { ensure, beep } = useBeep();
  const awake = useWakeLock(running);

  const done = elapsed >= total;
  const idx = done ? steps.length - 1 : steps.reduce((acc, s, i) => (elapsed >= s.t ? i : acc), 0);
  const cur = steps[idx];
  const next = steps[idx + 1];
  const stepLen = Math.max(1, cur.end - cur.t);
  const stepProg = done ? 1 : Math.min(1, (elapsed - cur.t) / stepLen);
  const totalProg = Math.min(1, elapsed / total);
  const started = elapsed > 0;

  // perkiraan berat live: V60 = tuangan selesai ±30 dtk; espresso = aliran kontinu sepanjang tahap
  const prevGrams = steps.slice(0, idx).reduce((a, s) => (s.grams != null ? s.grams : a), 0);
  const win = esp ? stepLen : Math.min(stepLen, 30);
  const liveGrams = cur.grams != null ? Math.round(prevGrams + (cur.grams - prevGrams) * Math.min(1, (elapsed - cur.t) / win)) : prevGrams;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const e = baseRef.current + (performance.now() - startRef.current) / 1000;
      if (e >= total) { baseRef.current = total; setElapsed(total); setRunning(false); } else setElapsed(e);
    }, 100);
    return () => clearInterval(id);
  }, [running, total]);

  useEffect(() => {
    if (elapsed === 0 && !running) { lastIdx.current = -1; return; }
    if (idx !== lastIdx.current) { if (lastIdx.current !== -1 && sound) beep(988, 0.16, 2); lastIdx.current = idx; }
  }, [idx, elapsed, running, sound, beep]);

  useEffect(() => { if (done && sound) beep(660, 0.35, 3); /* eslint-disable-next-line */ }, [done]);

  const now = () => baseRef.current + (performance.now() - startRef.current) / 1000;
  const reset = () => { setRunning(false); baseRef.current = 0; setElapsed(0); lastIdx.current = -1; };
  const toggle = () => {
    ensure();
    if (done) { reset(); return; }
    if (running) { baseRef.current = Math.min(total, now()); setElapsed(baseRef.current); setRunning(false); }
    else { if (elapsed === 0 && sound) beep(784, 0.12, 1); startRef.current = performance.now(); setRunning(true); }
  };
  const skip = () => {
    if (!next) { baseRef.current = total; setElapsed(total); setRunning(false); return; }
    baseRef.current = next.t; startRef.current = performance.now(); setElapsed(next.t);
  };

  // keyboard: spasi = start/pause
  useEffect(() => {
    const onKey = (e) => { if (e.code === "Space" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) { e.preventDefault(); toggle(); } };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  });

  const R = 92, C = 2 * Math.PI * R;
  const timeLabel = esp ? `${Math.floor(elapsed)}` : fmt(elapsed);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <SectionTitle icon={<Timer className="w-4 h-4" />} noMargin>{esp ? "Shot Timer" : "Brew Timer"}</SectionTitle>
        <div className="flex items-center gap-3 text-xs text-espresso/50">
          {awake && <span className="flex items-center gap-1 text-copper"><Sun className="w-3.5 h-3.5" /> Layar menyala</span>}
          <button onClick={() => setSound((s) => !s)} className="hover:text-copper flex items-center gap-1 h-8" aria-label="Suara">
            {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}<span className="hidden sm:inline">{sound ? "Suara on" : "Suara off"}</span>
          </button>
        </div>
      </div>

      {(ice > 0) && !started && (
        <div className="mb-4 rounded-xl bg-[#e6eef2] text-[#243340] px-4 py-3 text-sm flex items-center gap-2">
          <Snowflake className="w-4 h-4 shrink-0" /><span>Sebelum mulai: masukkan <b className="tabular-nums">{ice}g es batu</b> ke server, lalu tare timbangan.</span>
        </div>
      )}
      {esp && !started && (
        <div className="mb-4 rounded-xl bg-white/70 border border-espresso/10 px-4 py-3 text-sm flex items-start gap-2 text-espresso/70">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-copper" /> Tekan mulai tepat saat pompa/tuas mulai ditekan. Timbangan di bawah cangkir sudah di-tare.
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="relative w-60 h-60 sm:w-64 sm:h-64">
          <svg viewBox="0 0 220 220" className="w-full h-full -rotate-90">
            <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(43,33,28,0.08)" strokeWidth="10" />
            <circle cx="110" cy="110" r={R} fill="none" stroke="url(#gc)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - totalProg)} style={{ transition: "stroke-dashoffset 0.15s linear" }} />
            {steps.map((s, i) => { const a = (s.t / total) * 2 * Math.PI; return (<circle key={i} cx={110 + R * Math.cos(a)} cy={110 + R * Math.sin(a)} r="4.5" fill={started && elapsed >= s.t ? "#B87333" : "#E8DCCB"} stroke="#FBF7F1" strokeWidth="2" />); })}
            <defs><linearGradient id="gc" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#C9A227" /><stop offset="100%" stopColor="#B87333" /></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-[11px] uppercase tracking-[0.18em] text-espresso/50">{done ? "Selesai" : running ? "Berjalan" : started ? "Jeda" : "Siap"}</div>
            <div className="font-display text-6xl font-semibold tabular-nums mt-1 leading-none">{timeLabel}{esp && <span className="text-2xl ml-0.5">s</span>}</div>
            <div className="text-xs text-espresso/50 tabular-nums mt-1">dari {esp ? `${total}s` : fmt(total)}</div>
            {started && !done && (
              <div className="mt-2 text-base font-semibold text-copper tabular-nums flex items-center gap-1">
                {esp ? <Coffee className="w-4 h-4" /> : <Droplets className="w-4 h-4" />} ~{liveGrams}g
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button onClick={reset} disabled={!started} className="w-12 h-12 rounded-full border border-espresso/15 grid place-items-center hover:border-copper hover:text-copper disabled:opacity-30" aria-label="Reset"><RotateCcw className="w-5 h-5" /></button>
          <button onClick={toggle} className="h-16 min-w-[11rem] px-8 rounded-full bg-espresso text-cream flex items-center justify-center gap-2 text-lg font-medium shadow-lg shadow-espresso/25 hover:bg-charcoal active:scale-[0.97] transition">
            {done ? <><RotateCcw className="w-5 h-5" /> Ulangi</> : running ? <><Pause className="w-5 h-5" /> Jeda</> : <><Play className="w-5 h-5 fill-current" /> {started ? "Lanjut" : esp ? "Mulai shot" : "Mulai seduh"}</>}
          </button>
          <button onClick={skip} disabled={done} className="w-12 h-12 rounded-full border border-espresso/15 grid place-items-center hover:border-copper hover:text-copper disabled:opacity-30" aria-label="Tahap berikutnya"><SkipForward className="w-5 h-5" /></button>
        </div>
        <div className="hidden lg:block text-[11px] text-espresso/40 mt-2">Tekan <kbd className="px-1.5 py-0.5 rounded bg-white border border-espresso/10">Spasi</kbd> untuk mulai/jeda</div>
      </div>

      {/* Current step */}
      <div className={`mt-6 rounded-2xl p-5 ${done ? "bg-emerald-900" : "bg-espresso"} text-cream`}>
        {done ? (
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-gold shrink-0" />
            <div>
              <div className="font-display text-xl font-semibold">{esp ? "Shot selesai ☕" : "Kopimu siap dinikmati ☕"}</div>
              <p className="text-sm text-cream/70 mt-1">
                {esp ? `Target ${water}g di cangkir. Cicipi: asam → giling lebih halus, pahit → lebih kasar.` : ice > 0 ? `${water}g air panas + ${ice}g es. Aduk rata dan sajikan di atas es baru.` : `Total ${water}g air. Cicipi saat suhu turun sedikit — manis & keasaman lebih terasa.`}
              </p>
              {onLog && (
                <button onClick={onLog} className="mt-3 h-11 px-5 rounded-full bg-gold text-espresso font-medium text-sm flex items-center gap-2 hover:brightness-105 active:scale-[0.98]">
                  <NotebookPen className="w-4 h-4" /> Catat seduhan ini
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-cream/60 gap-2">
              <span>Tahap {idx + 1}/{steps.length} · {esp ? `${cur.t}–${cur.end}s` : `${fmt(cur.t)}–${fmt(cur.end)}`}</span>
              {started && <span className="text-gold tabular-nums normal-case tracking-normal text-sm font-semibold">sisa {esp ? `${Math.ceil(cur.end - elapsed)}s` : fmt(cur.end - elapsed)}</span>}
            </div>
            <div className="flex items-baseline justify-between gap-3 mt-2">
              <div className="font-display text-2xl font-semibold leading-tight">{cur.title}</div>
              {cur.grams != null && <div className="font-display text-3xl font-semibold text-gold tabular-nums shrink-0">→ {cur.grams}g</div>}
            </div>
            {cur.pressure && cur.pressure !== "—" && (
              <div className="inline-flex items-center gap-1.5 mt-2 text-xs bg-cream/10 rounded-full px-2.5 py-1"><Gauge className="w-3.5 h-3.5 text-gold" /> {cur.pressure}</div>
            )}
            <p className="text-[15px] text-cream/85 mt-2 leading-relaxed">{fill(cur.desc, cur.grams, ice)}</p>
            <div className="h-2 rounded-full bg-cream/15 mt-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold to-copper rounded-full" style={{ width: `${(started ? stepProg : 0) * 100}%`, transition: "width 0.15s linear" }} />
            </div>
            {next && (
              <div className="mt-3 text-xs text-cream/60 flex items-start gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-px" />
                <span>Berikutnya pada <span className="text-cream tabular-nums">{esp ? `${next.t}s` : fmt(next.t)}</span> — {next.title}{next.grams != null ? ` (hingga ${next.grams}g)` : ""}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Steps */}
      <div className="mt-6">
        <div className="text-xs uppercase tracking-[0.16em] text-clay font-medium mb-3">{esp ? "Profil Ekstraksi" : "Panduan Penuangan"}</div>
        <ol className="space-y-2">
          {steps.map((s, i) => {
            const state = !started ? "todo" : i < idx || done ? "done" : i === idx ? "now" : "todo";
            return (
              <li key={i} className={`flex gap-3 rounded-xl p-3 border transition ${state === "now" ? "bg-white border-copper/50 shadow-sm" : state === "done" ? "bg-white/40 border-transparent opacity-60" : "bg-white/60 border-espresso/5"}`}>
                <div className={`w-7 h-7 rounded-full shrink-0 grid place-items-center text-xs font-semibold ${state === "now" ? "bg-copper text-white" : state === "done" ? "bg-espresso/80 text-cream" : "bg-espresso/10 text-espresso/60"}`}>
                  {state === "done" ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-sm font-semibold"><span className="tabular-nums text-copper mr-2">{esp ? `${s.t}–${s.end}s` : `${fmt(s.t)}–${fmt(s.end)}`}</span>{s.title}</div>
                    {s.grams != null && <span className="text-sm font-semibold tabular-nums shrink-0">{s.grams}g</span>}
                  </div>
                  {s.pressure && s.pressure !== "—" && <div className="text-[11px] text-clay mt-0.5 flex items-center gap-1"><Gauge className="w-3 h-3" />{s.pressure}</div>}
                  <p className="text-xs text-espresso/65 mt-0.5 leading-relaxed">{fill(s.desc, s.grams, ice)}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-4 flex items-start gap-2 text-[11px] text-espresso/50">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {esp ? "Angka gram = berat espresso di cangkir. Hentikan shot berdasarkan berat, bukan hanya waktu." : "Angka gram = berat air kumulatif di timbangan (tare setelah kopi" + (ice > 0 ? " & es" : "") + " masuk). Jadwal waktu tetap mengikuti resep asli meski dosis diubah."}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Brew Log ------------------------------ */
const todayISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const fmtDate = (iso) => { try { return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }); } catch { return iso; } };
const GRINDER_SUGGEST = ["Comandante C40", "Timemore C2", "Timemore C3", "1Zpresso K-Ultra", "1Zpresso J-Max", "Kingrinder K6", "Fellow Ode", "Baratza Encore"];

function Stars({ value, onChange, size = "w-6 h-6" }) {
  return (
    <div className="flex gap-1" role={onChange ? "radiogroup" : undefined}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n === value ? 0 : n)}
          className={`${onChange ? "p-1 -m-0.5 active:scale-90" : "cursor-default"} transition`} aria-label={`${n} bintang`}>
          <Star className={`${size} ${n <= value ? "fill-gold text-gold" : "text-espresso/20"}`} />
        </button>
      ))}
    </div>
  );
}

function BrewLogPanel({ r, logs, snapshot, onAdd, onDelete, onUse }) {
  const esp = r.kind === "espresso";
  const lastLog = logs[0];
  const blank = () => ({
    date: todayISO(), beans: lastLog?.beans || "", grinder: lastLog?.grinder || (esp ? "" : GRINDERS[0]),
    clicks: lastLog?.clicks || "", temp: String(r.temp), shotTime: "", rating: 0, notes: "",
  });
  const [f, setF] = useState(blank);
  const [saved, setSaved] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e?.target ? e.target.value : e }));

  const submit = (e) => {
    e.preventDefault();
    if (!f.beans.trim() && !f.notes.trim()) return;
    onAdd({
      ...f, beans: f.beans.trim(), notes: f.notes.trim(), recipeId: r.id, recipeName: r.name, kind: r.kind, style: r.style,
      dose: snapshot.dose, water: snapshot.water, ice: snapshot.ice, ratio: snapshot.ratio, iceShare: snapshot.iceShare,
    });
    setF((s) => ({ ...blank(), beans: s.beans, grinder: s.grinder, clicks: s.clicks }));
    setSaved(true); setTimeout(() => setSaved(false), 2200);
  };
  const canSave = f.beans.trim() || f.notes.trim();
  const inputCls = "w-full h-11 px-3.5 rounded-xl bg-white border border-espresso/10 focus:border-copper focus:outline-none focus:ring-2 focus:ring-copper/20 text-sm";

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="rounded-2xl bg-white/80 border border-espresso/10 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <SectionTitle icon={<NotebookPen className="w-4 h-4" />} noMargin>Catatan Seduh Baru</SectionTitle>
          <span className="text-[11px] text-espresso/50 tabular-nums">
            {snapshot.dose}g → {snapshot.water}g{snapshot.ice ? ` + ${snapshot.ice}g es` : ""} · {fmtRatio(snapshot.ratio)}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Coffee beans">
            <input className={inputCls} value={f.beans} onChange={set("beans")} placeholder="mis. Gayo Wine Natural – Roaster X" />
          </Field>
          <Field label="Tanggal seduh">
            <input type="date" className={inputCls} value={f.date} onChange={set("date")} />
          </Field>
          <Field label="Grinder">
            <input className={inputCls} list="grinder-list" value={f.grinder} onChange={set("grinder")} placeholder="Nama grinder" />
            <datalist id="grinder-list">{GRINDER_SUGGEST.map((g) => <option key={g} value={g} />)}</datalist>
          </Field>
          <Field label="Klik / setelan gilingan">
            <input className={inputCls} inputMode="decimal" value={f.clicks} onChange={set("clicks")} placeholder={r.grind.clicks ? r.grind.clicks[GRINDERS[0]] : "mis. 12 klik / 2.4"} />
          </Field>
          <Field label="Suhu air aktual (°C)">
            <input className={inputCls} inputMode="numeric" value={f.temp} onChange={set("temp")} />
          </Field>
          <Field label={esp ? "Waktu shot aktual" : "Waktu selesai aktual"}>
            <input className={inputCls} value={f.shotTime} onChange={set("shotTime")} placeholder={esp ? "mis. 28 detik" : "mis. 3:25"} />
          </Field>
        </div>

        <Field label="Penilaian">
          <Stars value={f.rating} onChange={set("rating")} />
        </Field>
        <Field label="Catatan rasa & evaluasi">
          <textarea rows={3} className={`${inputCls} h-auto py-2.5 resize-y`} value={f.notes} onChange={set("notes")}
            placeholder="mis. Manis karamel, acidity jeruk. Sedikit pahit di akhir → coba 2 klik lebih kasar." />
        </Field>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={!canSave}
            className="h-12 px-6 rounded-full bg-espresso text-cream font-medium flex items-center gap-2 disabled:opacity-40 hover:bg-charcoal active:scale-[0.98] transition">
            <Save className="w-4 h-4" /> Simpan catatan
          </button>
          {saved && <span className="text-sm text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Tersimpan</span>}
          {!canSave && <span className="text-xs text-espresso/40">Isi beans atau catatan dulu</span>}
        </div>
      </form>

      <div>
        <SectionTitle icon={<History className="w-4 h-4" />}>Riwayat untuk resep ini ({logs.length})</SectionTitle>
        {logs.length === 0 ? (
          <div className="text-sm text-espresso/50 border border-dashed border-espresso/20 rounded-2xl p-6 text-center">Belum ada catatan. Seduh dulu, lalu simpan hasilnya di atas.</div>
        ) : (
          <ul className="space-y-3">
            {logs.map((l) => (
              <LogItem key={l.id} l={l} confirm={confirmId === l.id} onAskDelete={() => setConfirmId(l.id)} onCancel={() => setConfirmId(null)}
                onDelete={() => { onDelete(l.id); setConfirmId(null); }} onUse={() => onUse(l)} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (<label className="block"><span className="block text-[11px] uppercase tracking-wider text-espresso/50 mb-1.5">{label}</span>{children}</label>);
}

function LogItem({ l, confirm, onAskDelete, onCancel, onDelete, onUse, onOpen, showRecipe }) {
  return (
    <li className="rounded-2xl bg-white/80 border border-espresso/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {showRecipe && (
            <button onClick={onOpen} className="text-[11px] uppercase tracking-wider text-copper hover:underline flex items-center gap-1 mb-0.5">
              <StyleIcon style={l.style} className="w-3 h-3" /> {l.recipeName}
            </button>
          )}
          <div className="font-semibold truncate">{l.beans || "Tanpa nama beans"}</div>
          <div className="text-xs text-espresso/50 mt-0.5">{fmtDate(l.date)}</div>
        </div>
        <Stars value={l.rating || 0} size="w-4 h-4" />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3 text-[11px]">
        <Chip>{l.dose}g → {l.water}g{l.ice ? ` + ${l.ice}g es` : ""}</Chip>
        <Chip>{fmtRatio(l.ratio)}</Chip>
        {(l.grinder || l.clicks) && <Chip>{[l.grinder, l.clicks].filter(Boolean).join(" · ")}</Chip>}
        {l.temp && <Chip>{l.temp}°C</Chip>}
        {l.shotTime && <Chip>{l.shotTime}</Chip>}
      </div>
      {l.notes && <p className="text-sm text-espresso/75 mt-3 whitespace-pre-line leading-relaxed">{l.notes}</p>}
      <div className="flex items-center justify-end gap-2 mt-3">
        {confirm ? (
          <>
            <span className="text-xs text-espresso/60 mr-auto">Hapus catatan ini?</span>
            <button onClick={onCancel} className="h-9 px-3 rounded-full text-xs border border-espresso/15">Batal</button>
            <button onClick={onDelete} className="h-9 px-3 rounded-full text-xs bg-red-700 text-white">Hapus</button>
          </>
        ) : (
          <>
            {onUse && <button onClick={onUse} className="h-9 px-3 rounded-full text-xs border border-espresso/15 hover:border-copper flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Pakai takaran ini</button>}
            <button onClick={onAskDelete} className="h-9 w-9 rounded-full grid place-items-center text-espresso/40 hover:text-red-700 hover:bg-red-50" aria-label="Hapus"><Trash2 className="w-4 h-4" /></button>
          </>
        )}
      </div>
    </li>
  );
}
const Chip = ({ children }) => <span className="px-2 py-1 rounded-full bg-cream text-espresso/70 tabular-nums">{children}</span>;

function useCopy() {
  const [copied, setCopied] = useState(null);
  const copy = async (text, key) => {
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch {
      try { const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); ok = document.execCommand("copy"); ta.remove(); } catch { ok = false; }
    }
    setCopied(ok ? key : `fail-${key}`); setTimeout(() => setCopied(null), 1800);
  };
  return [copied, copy];
}

function LogDrawer({ logs, onClose, onDelete, onOpenRecipe, onImport }) {
  const [filter, setFilter] = useState("all");
  const [confirmId, setConfirmId] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState("");
  const [copied, copy] = useCopy();
  const shown = logs.filter((l) => filter === "all" || l.kind === filter);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const doImport = () => {
    try {
      const arr = JSON.parse(importText);
      if (!Array.isArray(arr)) throw new Error();
      const valid = arr.filter((x) => x && x.id && x.recipeId && RECIPES.some((r) => r.id === x.recipeId));
      onImport(valid); setImportMsg(`${valid.length} catatan diimpor.`); setImportText("");
    } catch { setImportMsg("Format tidak valid — tempel teks backup dari tombol 'Salin backup'."); }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm animate-fade" onClick={onClose} />
      <aside className="relative w-full sm:max-w-md h-[100dvh] bg-cream shadow-2xl flex flex-col animate-slide">
        <div className="px-5 py-4 border-b border-espresso/10 flex items-center justify-between shrink-0">
          <div>
            <div className="font-display text-2xl font-semibold">Brew Log</div>
            <div className="text-xs text-espresso/50">{logs.length} catatan · tersimpan di browser ini</div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-espresso/5 grid place-items-center" aria-label="Tutup"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 py-3 flex gap-2 border-b border-espresso/10 shrink-0 overflow-x-auto no-scrollbar">
          {[["all", "Semua"], ["v60", "V60"], ["espresso", "Espresso"]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`shrink-0 h-9 px-4 rounded-full text-sm border ${filter === k ? "bg-espresso text-cream border-espresso" : "border-espresso/15"}`}>{l}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3 overscroll-contain">
          {shown.length === 0 ? (
            <div className="text-center text-sm text-espresso/50 py-16">
              <NotebookPen className="w-8 h-8 mx-auto mb-3 text-clay/50" />
              Belum ada catatan. Buka resep → tab <b>Log</b> untuk mencatat seduhan pertamamu.
            </div>
          ) : (
            <ul className="space-y-3">
              {shown.map((l) => (
                <LogItem key={l.id} l={l} showRecipe onOpen={() => onOpenRecipe(l.recipeId)} confirm={confirmId === l.id}
                  onAskDelete={() => setConfirmId(l.id)} onCancel={() => setConfirmId(null)} onDelete={() => { onDelete(l.id); setConfirmId(null); }} />
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-espresso/10 p-4 space-y-3 shrink-0 bg-white/50">
          <div className="flex gap-2">
            <button onClick={() => copy(JSON.stringify(logs), "backup")} disabled={!logs.length}
              className="flex-1 h-11 rounded-full border border-espresso/15 hover:border-copper text-sm flex items-center justify-center gap-2 disabled:opacity-40">
              {copied === "backup" ? <><Check className="w-4 h-4 text-emerald-700" /> Tersalin</> : copied === "fail-backup" ? "Gagal menyalin" : <><Copy className="w-4 h-4" /> Salin backup</>}
            </button>
            <button onClick={() => { setShowImport((v) => !v); setImportMsg(""); }} className="flex-1 h-11 rounded-full border border-espresso/15 hover:border-copper text-sm flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> Impor
            </button>
          </div>
          {showImport && (
            <div className="space-y-2">
              <textarea rows={3} value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Tempel teks backup di sini…"
                className="w-full rounded-xl bg-white border border-espresso/10 p-3 text-xs font-mono focus:outline-none focus:border-copper" />
              <button onClick={doImport} disabled={!importText.trim()} className="w-full h-10 rounded-full bg-espresso text-cream text-sm disabled:opacity-40">Gabungkan catatan</button>
            </div>
          )}
          {importMsg && <div className="text-xs text-espresso/60">{importMsg}</div>}
          <p className="text-[11px] text-espresso/45 leading-snug">Catatan disimpan di browser perangkat ini. Untuk pindah ke HP: Salin backup → kirim ke diri sendiri → Impor di HP.</p>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------ Deploy Guide ------------------------------ */
const CODE = {
  create: `npm create vite@latest brewcraft -- --template react
cd brewcraft
npm install
npm install lucide-react
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p`,
  tailwind: `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF7F1", sand: "#EFE5D6", espresso: "#2B211C", charcoal: "#1C1815",
        copper: "#B87333", gold: "#C9A227", clay: "#8B5E3C",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      keyframes: {
        fade: { from: { opacity: 0 }, to: { opacity: 1 } },
        rise: { from: { opacity: 0, transform: "translateY(24px)" }, to: { opacity: 1, transform: "none" } },
        slide: { from: { transform: "translateX(100%)" }, to: { transform: "none" } },
      },
      animation: {
        fade: "fade .2s ease-out",
        rise: "rise .3s cubic-bezier(.2,.8,.2,1)",
        slide: "slide .3s cubic-bezier(.2,.8,.2,1)",
      },
    },
  },
  plugins: [],
};`,
  css: `@tailwind base;
@tailwind components;
@tailwind utilities;

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }
.guide-body p > code, .guide-body li > code {
  font-family: ui-monospace, monospace; font-size: .85em;
  background: rgba(43, 33, 28, .07); padding: .1em .4em; border-radius: .35em;
}`,
  fonts: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<meta name="theme-color" content="#2B211C">`,
  app: `import BrewCraft from "./BrewCraft";

export default function App() {
  return <BrewCraft />;
}`,
  git: `git init
git add .
git commit -m "BrewCraft: V60 & manual espresso"
git branch -M main
git remote add origin https://github.com/USERNAME/brewcraft.git
git push -u origin main`,
  update: `git add .
git commit -m "Update resep"
git push`,
};

const GUIDE = [
  {
    title: "Siapkan alat", icon: Settings2,
    body: (<><p>Install <b>Node.js versi LTS</b> (nodejs.org) dan <b>Git</b> (git-scm.com) di laptop, lalu buat akun gratis di <b>GitHub</b> dan <b>Vercel</b> (daftar Vercel memakai akun GitHub agar langsung terhubung).</p><p className="mt-2">Cek di terminal: <code>node -v</code> dan <code>git --version</code>.</p></>),
  },
  {
    title: "Buat proyek React + Tailwind", icon: Coffee,
    body: (<><p>Jalankan perintah ini di terminal (folder bebas):</p><CodeBlock id="create" code={CODE.create} /><p className="mt-3">Ganti isi <code>tailwind.config.js</code> dengan tema BrewCraft:</p><CodeBlock id="tailwind" code={CODE.tailwind} /><p className="mt-3">Ganti seluruh isi <code>src/index.css</code>:</p><CodeBlock id="css" code={CODE.css} /><p className="mt-3">Tempel font ini di dalam <code>&lt;head&gt;</code> pada <code>index.html</code>, dan ganti <code>&lt;title&gt;</code> menjadi BrewCraft:</p><CodeBlock id="fonts" code={CODE.fonts} /></>),
  },
  {
    title: "Masukkan kode BrewCraft", icon: FileCode2,
    body: (<><p>Simpan file <b>BrewCraft.jsx</b> (kode komponen ini) ke folder <code>src/</code>. Lalu ganti seluruh isi <code>src/App.jsx</code>:</p><CodeBlock id="app" code={CODE.app} /><p className="mt-3">Hapus <code>src/App.css</code> bila ada. Uji di laptop dengan <code>npm run dev</code> lalu buka alamat yang muncul (biasanya <code>localhost:5173</code>).</p></>),
  },
  {
    title: "Unggah ke GitHub", icon: GitBranch,
    body: (<><p>Di github.com klik <b>New repository</b> → beri nama <code>brewcraft</code> → <b>Create</b> (jangan centang README). Lalu di folder proyek:</p><CodeBlock id="git" code={CODE.git} /><p className="mt-3">Ganti <code>USERNAME</code> dengan username GitHub-mu. Folder <code>node_modules</code> otomatis tidak ikut karena sudah ada di <code>.gitignore</code> bawaan Vite.</p></>),
  },
  {
    title: "Deploy gratis di Vercel", icon: Rocket,
    body: (<ol className="list-decimal pl-5 space-y-1.5"><li>Masuk ke vercel.com → <b>Add New… → Project</b>.</li><li>Pilih repo <code>brewcraft</code> → <b>Import</b>.</li><li>Framework Preset terdeteksi <b>Vite</b> otomatis (Build: <code>npm run build</code>, Output: <code>dist</code>). Tidak perlu diubah.</li><li>Klik <b>Deploy</b>, tunggu ±1 menit.</li><li>Kamu mendapat alamat seperti <code>brewcraft-xxxx.vercel.app</code>. Nama domain bisa diganti di <b>Settings → Domains</b>.</li></ol>),
  },
  {
    title: "Buka & pasang di HP", icon: Smartphone,
    body: (<><ul className="list-disc pl-5 space-y-1.5"><li><b>Android (Chrome):</b> buka alamat Vercel → menu ⋮ → <b>Tambahkan ke layar utama</b> / <b>Instal aplikasi</b>.</li><li><b>iPhone (Safari):</b> buka alamat → tombol Bagikan → <b>Add to Home Screen</b>.</li></ul><p className="mt-2">BrewCraft akan muncul seperti aplikasi. Catatan Brew Log tersimpan per perangkat — pindahkan dengan <b>Salin backup → Impor</b>.</p></>),
  },
  {
    title: "Update resep kapan saja", icon: RotateCcw,
    body: (<><p>Setiap kali kamu mengubah kode, cukup push ulang — Vercel otomatis build & deploy versi baru dalam ±1 menit:</p><CodeBlock id="update" code={CODE.update} /></>),
  },
];

function CodeBlock({ id, code }) {
  const [copied, copy] = useCopy();
  return (
    <div className="relative mt-2 group">
      <pre className="bg-charcoal text-cream/90 text-[12px] leading-relaxed rounded-xl p-4 pr-12 overflow-x-auto font-mono"><code>{code}</code></pre>
      <button onClick={() => copy(code, id)} className="absolute top-2 right-2 h-8 px-2.5 rounded-lg bg-cream/10 hover:bg-cream/20 text-cream text-xs flex items-center gap-1" aria-label="Salin kode">
        {copied === id ? <><Check className="w-3.5 h-3.5" /> Tersalin</> : copied === `fail-${id}` ? "Gagal" : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function DeployGuide() {
  const [open, setOpen] = useState(0);
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <div className="rounded-3xl bg-white/70 border border-espresso/10 overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-br from-espresso via-[#3a2a21] to-[#5a3b28] text-cream">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold"><Smartphone className="w-3.5 h-3.5" /> Panduan deployment</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mt-2">Bawa BrewCraft ke HP-mu</h2>
          <p className="text-cream/70 mt-2 max-w-2xl text-sm sm:text-base">Ekspor kode ke GitHub lalu hosting gratis di Vercel — 7 langkah, ±15 menit. Setelah itu BrewCraft bisa dibuka dari browser HP kapan saja, bahkan dipasang di layar utama.</p>
          <div className="flex flex-wrap gap-2 mt-4 text-xs">
            {["React + Vite", "Tailwind CSS", "GitHub", "Vercel (gratis)"].map((t) => (<span key={t} className="px-2.5 py-1 rounded-full bg-cream/10 border border-cream/15">{t}</span>))}
          </div>
        </div>
        <ol className="divide-y divide-espresso/10">
          {GUIDE.map((g, i) => {
            const Icon = g.icon; const isOpen = open === i;
            return (
              <li key={g.title}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 px-5 sm:px-8 py-4 text-left hover:bg-cream/60 transition">
                  <span className={`w-9 h-9 rounded-full grid place-items-center shrink-0 text-sm font-semibold ${isOpen ? "bg-copper text-white" : "bg-espresso/5 text-espresso/70"}`}>{i + 1}</span>
                  <Icon className="w-4 h-4 text-clay shrink-0 hidden sm:block" />
                  <span className="flex-1 font-medium">{g.title}</span>
                  <ChevronDown className={`w-5 h-5 text-espresso/40 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-8 pb-5 sm:pl-[5.5rem] text-sm text-espresso/75 leading-relaxed guide-body">{g.body}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
