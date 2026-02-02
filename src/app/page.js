'use client';

import { useState, useEffect } from 'react';
import { Search, Shield, Globe, DollarSign, Lock, Star, X, Zap, Target, Users, TrendingUp } from 'lucide-react';

// --- INITIAL DATA ---
const INITIAL_NEWS = [
  { 
    id: 1, 
    date: "MA", 
    title: "Piaci Elemzés: A 'Faceless' modellek térnyerése Magyarországon", 
    summary: "Az arc nélküli tartalomgyártás nem csak trend, hanem a legbiztonságosabb üzleti modell 2026-ban.",
    content: "Az adataink szerint a magyar top 10% bevételeinek 40%-a már olyan tartalmakból származik, ahol nem látszik az arc. Ez a 'Mystery Brand' stratégia lehetővé teszi, hogy a modellek civil munkát vállaljanak, miközben dollárban keresnek. A Prime Global ügynökség most indította el a 'Ghost' programot, kifejezetten erre a célcsoportra.",
    tag: "BUSINESS", 
    views: "8.2K", 
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80" 
  },
  { 
    id: 2, 
    date: "TEGNAP", 
    title: "Botrány helyett Üzlet: Így profitáltak a lányok a Dubaji szivárogtatásból", 
    summary: "A negatív reklám is reklám? A számok magukért beszélnek.",
    content: "A múlt heti szivárogtatási botrány után a legtöbb érintett modell nem törölte magát, hanem árat emelt. Az átlagos feliratkozószám 250%-kal nőtt 48 óra alatt. Ez is bizonyítja: a nemzetközi piacon (főleg az USA-ban) a 'hungarian model' kifejezésre óriási a kereslet.",
    tag: "TREND", 
    views: "12.5K", 
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80" 
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('news');
  const [roster, setRoster] = useState([]);
  const [news, setNews] = useState(INITIAL_NEWS);
  const [selectedNews, setSelectedNews] = useState(null);
  
  // ADMIN & API STATE
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  
  // ITT A VÁLTOZÁS: Automatikusan betölti a kulcsot a Vercelről
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_OPENAI_KEY || ''); 
  
  const [aiPrompt, setAiPrompt] = useState('Írj egy rövid, figyelemfelkeltő hírt a magyar OnlyFans piacról, legyen benne üzleti elemzés.');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // ACTIVITY TICKER STATE
  const [activity, setActivity] = useState("🔥 140 látogató jelenleg az oldalon");

  // --- ÉLŐ AKTIVITÁS SZIMULÁTOR ---
  useEffect(() => {
    const activities = [
      "Valaki Budapestről most jelentkezett Auditra",
      "Új látogató Londonból a Model listát nézi",
      "Egy modell profilját 12-en nézik jelenleg",
      "Kitti_Official adatlapja frissült",
      "Új partner jelentkezett Miamiból"
    ];
    const interval = setInterval(() => {
      setActivity("● " + activities[Math.floor(Math.random() * activities.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- VALÓDI OPENAI HÍR GENERÁLÁS ---
  const generateRealAiNews = async () => {
    // Ellenőrzés: Vagy a környezeti változó, vagy a kézzel beírt mező kell
    const keyToUse = apiKey || process.env.NEXT_PUBLIC_OPENAI_KEY;

    if (!keyToUse) {
      alert("Nincs API kulcs! Állítsd be a Vercelen vagy írd be a mezőbe.");
      return;
    }
    setIsGenerating(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${keyToUse}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Te egy profi bulvár és üzleti újságíró vagy, aki az OnlyFans piacról ír. A stílusod: Forbes keverve a Cosmopolitannal. Rövid, ütős, clickbait címek." },
            { role: "user", content: `Generálj egy JSON objektumot (title, summary, content, tag) erről a témáról: ${aiPrompt}` }
          ]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const contentText = data.choices[0].message.content;
      
      const newStory = {
        id: Date.now(),
        date: "MOST ÉRKEZETT",
        title: "AI Által Generált Exkluzív Hír", 
        summary: "A mesterséges intelligencia szerint ez a következő nagy trend.",
        content: contentText, 
        tag: "AI INSIGHT",
        views: "1.2K",
        img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800"
      };
      
      setNews([newStory, ...news]);
      alert("Cikk sikeresen legenerálva és posztolva!");
      
    } catch (error) {
      console.error(error);
      alert(`Hiba: ${error.message}. Ellenőrizd a kulcsodat!`);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- LEAD HUNTER (SMART DORKING) ---
  const openHunterSearch = (type) => {
    let query = "";
    if (type === 'twitter_new') {
      query = `https://twitter.com/search?q=onlyfans%20hungary%20filter%3Alinks&src=typed_query&f=live`;
    } else if (type === 'twitter_email') {
      query = `https://www.google.com/search?q=site:twitter.com "onlyfans" "hungary" "gmail.com"`;
    } else if (type === 'instagram') {
      query = `https://www.google.com/search?q=site:instagram.com "hungary" "onlyfans"`;
    }
    window.open(query, '_blank');
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden font-sans text-gray-200 selection:bg-[#C5A059] selection:text-black">
      
      {/* 1. ÉLŐ ACTIVITY BAR */}
      <div className="bg-[#C5A059] text-black text-xs font-bold py-1 px-4 text-center tracking-widest uppercase relative z-50">
        {activity}
      </div>

      {/* 2. HEADER */}
      <header className="sticky top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#C5A059] to-[#8A6E36] rounded-sm flex items-center justify-center font-bold text-black text-lg">P</div>
            <h1 className="text-xl font-display font-bold tracking-widest text-white">
              PRIME <span className="text-[#C5A059]">GLOBAL</span>
            </h1>
          </div>
          <button className="hidden md:block px-5 py-2 border border-[#C5A059] text-[#C5A059] text-xs font-bold tracking-widest hover:bg-[#C5A059] hover:text-black transition duration-300">
            PARTNER ACCESS
          </button>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <div className="relative pt-20 pb-16 px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#C5A059] opacity-[0.08] blur-[120px] rounded-full pointer-events-none"></div>
        
        <h2 className="text-4xl md:text-6xl font-display font-medium text-white mb-4 leading-tight">
          Elite Management <br/> for <span className="text-[#C5A059] italic">Elite Talent</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-10">
          Budapest • Dubai • Miami. A hidat építjük a tehetséged és a nemzetközi tőke között.
        </p>
        
        {/* NAVIGÁCIÓ */}
        <div className="flex flex-wrap justify-center gap-3 relative z-10">
          {[
            { id: 'news', label: 'News Feed', icon: Zap },
            { id: 'roster', label: 'Talent List', icon: Users },
            { id: 'agency', label: 'Career', icon: Target },
            { id: 'admin', label: 'Admin', icon: Lock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 border rounded-sm ${
                activeTab === tab.id 
                ? 'bg-[#C5A059] text-black border-[#C5A059]' 
                : 'bg-white/5 text-gray-400 border-white/10 hover:border-[#C5A059] hover:text-white'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6">

        {/* --- TAB: NEWS FEED --- */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {news.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedNews(item)}
                className="group cursor-pointer bg-white/5 border border-white/5 hover:border-[#C5A059]/50 transition duration-500 overflow-hidden"
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-80 group-hover:opacity-100" />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-[#C5A059] border border-[#C5A059]/30">
                    {item.tag}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <span>{item.date}</span>
                    <span className="flex items-center gap-1"><TrendingUp size={12}/> {item.views}</span>
                  </div>
                  <h3 className="text-xl font-display text-white mb-3 group-hover:text-[#C5A059] transition">{item.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- TAB: ROSTER (LISTA) --- */}
        {activeTab === 'roster' && (
          <div className="bg-white/5 border border-white/5 p-8 min-h-[400px]">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-display text-white">Official Database</h2>
                <p className="text-xs text-gray-400 mt-1">Verified Hungarian Profiles</p>
              </div>
              <div className="text-[#C5A059] text-xs font-bold bg-[#C5A059]/10 px-3 py-1 rounded-full border border-[#C5A059]/20">
                LIVE UPDATED
              </div>
            </div>

            {/* MANUÁLIS LISTA (DEMO) */}
            <div className="space-y-3">
              {[
                { name: "Kitti_Official", cat: "Elite", status: "Online" },
                { name: "Szandra_Queen", cat: "New Face", status: "Online" },
                { name: "Vivi_Baby", cat: "Teen", status: "Away" },
                { name: "Masked_Goddess", cat: "Faceless", status: "Online" }
              ].map((model, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 hover:border-[#C5A059]/50 transition group">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${model.status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-600'}`}></div>
                    <span className="font-bold text-white">{model.name}</span>
                    <span className="text-xs text-gray-500 px-2 py-0.5 bg-white/5 rounded">{model.cat}</span>
                  </div>
                  <button className="text-[10px] font-bold text-[#C5A059] tracking-widest opacity-60 group-hover:opacity-100 transition">
                    VIEW PROFILE
                  </button>
                </div>
              ))}
              
              <div className="mt-8 p-4 bg-[#C5A059]/10 border border-[#C5A059]/20 text-center">
                <p className="text-sm text-gray-300 mb-2">Nem találod magad a listán?</p>
                <button className="text-[#C5A059] font-bold text-xs hover:underline">JELENTKEZÉS ADATBÁZISBA</button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: AGENCY (KARRIER) --- */}
        {activeTab === 'agency' && (
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display text-white mb-8">
              Csatlakozz a <span className="text-[#C5A059]">Top 1%</span>-hoz
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition">
                <Shield className="mx-auto text-[#C5A059] mb-4" />
                <h3 className="font-bold text-white mb-2">Faceless</h3>
                <p className="text-xs text-gray-400">Maradj anonim. A maszk a védjegyed, a bevételed dollár.</p>
              </div>
              <div className="p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition">
                <Globe className="mx-auto text-[#C5A059] mb-4" />
                <h3 className="font-bold text-white mb-2">Travel</h3>
                <p className="text-xs text-gray-400">Ingyenes fotózások és networking Dubajban és Londonban.</p>
              </div>
              <div className="p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition">
                <DollarSign className="mx-auto text-[#C5A059] mb-4" />
                <h3 className="font-bold text-white mb-2">Sales</h3>
                <p className="text-xs text-gray-400">Profi Chat csapat 0-24. Te alszol, mi eladunk.</p>
              </div>
            </div>

            {/* Email Gyűjtő Form */}
            <div className="bg-[#111] border border-[#C5A059] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#C5A059] blur-[60px] opacity-20"></div>
              <h3 className="text-xl font-bold text-white mb-6">Jelentkezés Auditra</h3>
              <div className="space-y-4 max-w-sm mx-auto">
                <input type="text" placeholder="Neved / Művészneved" className="w-full bg-black border border-white/10 p-3 text-white text-sm focus:border-[#C5A059] outline-none transition" />
                <input type="email" placeholder="Email címed (Kapcsolattartáshoz)" className="w-full bg-black border border-white/10 p-3 text-white text-sm focus:border-[#C5A059] outline-none transition" />
                <input type="text" placeholder="Instagram / OF Link" className="w-full bg-black border border-white/10 p-3 text-white text-sm focus:border-[#C5A059] outline-none transition" />
                
                <button className="w-full bg-[#C5A059] text-black font-bold py-3 text-sm tracking-widest hover:bg-white transition duration-300">
                  KÜLDÉS
                </button>
                <p className="text-[10px] text-gray-500">Adataidat 100% bizalmasan kezeljük. Nincs spam.</p>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: ADMIN (REAL TOOLS) --- */}
        {activeTab === 'admin' && (
          <div className="max-w-xl mx-auto">
            {!isAdmin ? (
              <div className="bg-white/5 border border-white/10 p-8 text-center">
                <h2 className="text-lg font-bold text-white mb-4">Admin Hozzáférés</h2>
                <input 
                  type="password" 
                  placeholder="Jelszó" 
                  className="w-full bg-black border border-white/10 p-3 mb-4 text-center text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin} className="w-full bg-white text-black font-bold py-2 text-sm hover:bg-gray-200">BELÉPÉS</button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-center items-center gap-2 text-green-500 text-xs font-bold uppercase tracking-widest">
                  <Lock size={12} /> Secure Connection Active
                </div>

                {/* 1. REAL OPENAI NEWS GENERATOR */}
                <div className="bg-black border border-white/10 p-6">
                  <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                    <Star size={16} className="text-[#C5A059]"/> AI News Writer (Real)
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">A rendszer automatikusan betölti a Vercelen megadott kulcsot.</p>
                  
                  {/* Ha van környezeti változó, nem kell input, de meghagyjuk felülírásra */}
                  <input 
                    type="password" 
                    placeholder="API Kulcs (Ha nincs beállítva Vercelen)" 
                    className="w-full bg-[#111] border border-white/10 p-2 text-xs text-white mb-2"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <textarea 
                    className="w-full bg-[#111] border border-white/10 p-2 text-xs text-white mb-4 h-20"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  
                  <button 
                    onClick={generateRealAiNews} 
                    disabled={isGenerating}
                    className="w-full bg-[#C5A059] text-black font-bold py-2 text-xs hover:bg-white transition"
                  >
                    {isGenerating ? 'GENERÁLÁS FOLYAMATBAN...' : '✨ CIKK GENERÁLÁSA & POSZTOLÁS'}
                  </button>
                </div>

                {/* 2. REAL LEAD HUNTER (SMART DORKING) */}
                <div className="bg-black border border-white/10 p-6">
                  <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                    <Target size={16} className="text-[#C5A059]"/> Lead Hunter (Smart Search)
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Ezek a gombok speciális kereséseket nyitnak meg, amik <span className="text-white">azonnal listázzák a valós profilokat</span>.
                  </p>
                  
                  <div className="space-y-3">
                    <button onClick={() => openHunterSearch('twitter_new')} className="w-full border border-white/20 text-white py-2 text-xs hover:border-[#C5A059] hover:text-[#C5A059] flex justify-between px-4">
                      <span>🐦 Twitter: Friss Magyar OF Profilok</span> <span>OPEN ➜</span>
                    </button>
                    <button onClick={() => openHunterSearch('twitter_email')} className="w-full border border-white/20 text-white py-2 text-xs hover:border-[#C5A059] hover:text-[#C5A059] flex justify-between px-4">
                      <span>📧 Gmail Címek Gyűjtése (Twitter Bio)</span> <span>OPEN ➜</span>
                    </button>
                    <button onClick={() => openHunterSearch('instagram')} className="w-full border border-white/20 text-white py-2 text-xs hover:border-[#C5A059] hover:text-[#C5A059] flex justify-between px-4">
                      <span>📸 Instagram: Rejtett Magyar Fiókok</span> <span>OPEN ➜</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* --- MODAL (HÍR OLVASÁSA) --- */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0f1115] border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button 
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 bg-black/50