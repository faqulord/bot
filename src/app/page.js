'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Animációkhoz
import { Search, Globe, Shield, DollarSign, Lock, Star } from 'lucide-react'; // Ikonok

// --- ADATBÁZIS (SZIMULÁLT) ---

// 1. HÍREK (1 Évre visszamenőleg + Mai friss)
const INITIAL_NEWS = [
  { id: 1, date: "2026. Febr. 02. (MA)", title: "BREAKING: Kitti_Official bevétele átlépte a havi 15 milliót", tag: "RECORD", views: "14.2K", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600" },
  { id: 2, date: "2026. Jan. 28.", title: "LEAKED: Magyar lányok privát yacht bulija Dubajban", tag: "LIFESTYLE", views: "28.5K", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600" },
  { id: 3, date: "2025. Dec. 15.", title: "Új trend: Az arc nélküli (Faceless) profilok térnyerése", tag: "STRATEGY", views: "9.1K", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600" },
  { id: 4, date: "2025. Nov. 02.", title: "Hogyan szerezz amerikai 'Bálna' ügyfeleket?", tag: "TUTORIAL", views: "11.2K", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600" },
  { id: 5, date: "2025. Szept. 20.", title: "Botrány a Balaton Soundon: Felismerték a modellt", tag: "GOSSIP", views: "45.0K", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600" },
  { id: 6, date: "2025. Júl. 10.", title: "Interjú: Így vettem lakást 3 hónap alatt OnlyFansből", tag: "SUCCESS", views: "18.4K", img: "https://images.unsplash.com/photo-1506956191951-7a88da4435e5?w=600" },
  { id: 7, date: "2025. Máj. 05.", title: "Az algoritmus változásai: Mit kell tudnod idén?", tag: "TECH", views: "6.5K", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600" },
];

// 2. MODELLEK LISTÁJA (OnlyFans link publikus, Twitter privát)
const INITIAL_ROSTER = [
  { id: 1, name: "Kitti_Official", category: "Elite", of_link: "https://onlyfans.com/kitti", twitter: "@kitti_priv", active: true },
  { id: 2, name: "Szandra_Queen", category: "New Face", of_link: "https://onlyfans.com/szandra", twitter: "@szandra_x", active: true },
  { id: 3, name: "Vivi_Baby", category: "Teen", of_link: "https://onlyfans.com/vivi", twitter: "@vivi_hun", active: false },
  { id: 4, name: "Masked_Goddess", category: "Faceless", of_link: "https://onlyfans.com/masked", twitter: "@masked_of", active: true },
];

// 3. BANNER KÉPEK
const INITIAL_BANNERS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1506956191951-7a88da4435e5?w=300&h=300&fit=crop"
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('news');
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [news, setNews] = useState(INITIAL_NEWS);
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  
  // ADMIN STATE
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // --- FUNKCIÓK ---

  // Admin bejelentkezés
  const handleLogin = () => {
    if (password === 'admin123') setIsAdmin(true);
    else alert('Hibás jelszó!');
  };

  // "Hunter Bot" szimuláció (Google Keresés)
  const runHunterBot = () => {
    setIsSearching(true);
    setTimeout(() => {
      // Szimulált új találatok
      const newModels = [
        { id: Date.now(), name: "Barbi_Found_1", category: "Hunter Result", of_link: "https://onlyfans.com/barbi", twitter: "@barbi_real", active: true },
        { id: Date.now() + 1, name: "Niki_Found_2", category: "Hunter Result", of_link: "https://onlyfans.com/niki", twitter: "@niki_x", active: true },
      ];
      setRoster([...roster, ...newModels]);
      setIsSearching(false);
      alert(`Siker! 2 új Valódi Magyar Profilt találtam a Twitteren!`);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* 1. BREAKING NEWS TICKER */}
      <div className="ticker-wrap">
        <div className="ticker">
          +++ BREAKING: REKORD BEVÉTEL A MAGYAR PIACON +++ ÚJ EXKLUZÍV LÁNYOK A LISTÁN +++ PRIME GLOBAL AGENCY: A SIKER KULCSA +++ JELENTKEZZ AUDITRA MÉG MA +++
        </div>
      </div>

      {/* 2. HEADER */}
      <header className="border-b border-gray-800 bg-black p-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-3xl font-cinzel text-gold font-bold tracking-widest">PRIME <span className="text-white">GLOBAL</span></h1>
          <p className="text-xs text-gray-500 tracking-[0.3em]">OFFICIAL HUNGARIAN DATABASE</p>
        </div>
        <div className="flex gap-4 text-2xl">
          <span>🇭🇺</span><span>🇬🇧</span>
        </div>
      </header>

      {/* 3. MARQUEE (MOZGÓ SZALAG) - Adminból szerkeszthető képek */}
      <div className="marquee-container py-4 bg-gray-900 border-y border-gray-800">
        <div className="marquee-content">
          {[...banners, ...banners, ...banners].map((src, i) => (
            <img key={i} src={src} className="inline-block h-24 w-24 rounded-full border-2 border-gray-700 mx-4 object-cover hover:scale-110 hover:border-yellow-500 transition duration-300" />
          ))}
        </div>
      </div>

      {/* 4. NAVIGÁCIÓ (TABOK) */}
      <nav className="flex justify-center gap-2 p-4 bg-black sticky top-20 z-40">
        {['news', 'roster', 'agency', 'admin'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 text-sm font-bold uppercase tracking-wider border transition-all ${
              activeTab === tab 
              ? 'bg-[#D4AF37] text-black border-[#D4AF37]' 
              : 'bg-black text-gray-500 border-gray-800 hover:text-white'
            }`}
          >
            {tab === 'news' ? '🔥 Hírek' : tab === 'roster' ? '📋 Lista' : tab === 'agency' ? '💎 Agency' : '🛠️ Admin'}
          </button>
        ))}
      </nav>

      {/* 5. TARTALOM MEGJELENÍTÉSE */}
      <main className="max-w-6xl mx-auto p-4">

        {/* --- NEWS TAB --- */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* HERO CIKK */}
            <div className="md:col-span-2 relative h-[400px] border border-gray-800 group overflow-hidden">
              <img src={news[0].img} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition duration-500" />
              <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent w-full">
                <span className="bg-[#D4AF37] text-black text-xs font-bold px-2 py-1 mb-2 inline-block">{news[0].tag}</span>
                <h2 className="text-3xl font-bold mb-2">{news[0].title}</h2>
                <div className="flex gap-4 text-sm text-yellow-500">
                  <span>📅 {news[0].date}</span>
                  <span>👁️ {news[0].views} olvasó</span>
                </div>
              </div>
            </div>

            {/* SIDEBAR HÍREK (VISSZAMENŐLEG) */}
            <div className="flex flex-col gap-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-gray-400 font-bold text-xs uppercase">Korábbi Hírek Archívuma</h3>
              {news.slice(1).map((item) => (
                <div key={item.id} className="bg-[#111] p-3 border-l-2 border-[#D4AF37] hover:bg-[#1a1a1a] transition cursor-pointer">
                  <div className="text-[10px] text-gray-500">{item.date}</div>
                  <h4 className="font-bold text-sm text-gray-200">{item.title}</h4>
                  <div className="text-yellow-600 text-xs mt-1">🔥 {item.views}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ROSTER TAB (LISTA) --- */}
        {activeTab === 'roster' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-cinzel text-gold">OFFICIAL HUNGARIAN DATABASE</h2>
              <div className="text-gray-500 text-sm">Aktív profilok: {roster.length}</div>
            </div>

            {/* KERESŐ */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-3 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Keresés név vagy kategória alapján..." 
                className="w-full bg-[#111] border border-gray-800 p-3 pl-10 text-white focus:border-[#D4AF37] outline-none"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* TÁBLÁZAT */}
            <div className="border-t border-gray-800">
              {roster.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map((model) => (
                <div key={model.id} className="flex justify-between items-center p-4 border-b border-gray-800 hover:bg-[#111] transition">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${model.active ? 'bg-green-500 shadow-[0_0_10px_#00ff00]' : 'bg-red-500'}`}></span>
                    <span className="font-bold text-lg">{model.name}</span>
                    <span className="text-xs bg-gray-800 px-2 py-1 text-gray-400">{model.category}</span>
                  </div>
                  <a href={model.of_link} target="_blank" className="border border-[#D4AF37] text-[#D4AF37] px-4 py-1 text-xs font-bold hover:bg-[#D4AF37] hover:text-black transition">
                    VIEW PROFILE ➜
                  </a>
                  {/* Csak az Admin látja ezt! */}
                  {isAdmin && <span className="text-xs text-blue-400 ml-4 hidden md:inline">{model.twitter}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- AGENCY TAB (MARKETING) --- */}
        {activeTab === 'agency' && (
          <div className="text-center">
            <div className="py-12 bg-gradient-radial from-[#1a1a1a] to-black border border-gray-800 mb-8">
              <h2 className="text-4xl md:text-5xl font-cinzel text-gold mb-4">GLOBAL MANAGEMENT</h2>
              <p className="text-gray-400 tracking-widest uppercase">Budapest • Dubai • Miami</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="glass-card p-6">
                <Shield className="mx-auto text-[#D4AF37] mb-4" size={40} />
                <h3 className="font-bold text-xl mb-2">FACELESS KARRIER</h3>
                <p className="text-sm text-gray-400">A maszk a védjegyed. Nem kell megmutatnod az arcodat a milliókhoz.</p>
              </div>
              <div className="glass-card p-6">
                <Globe className="mx-auto text-[#D4AF37] mb-4" size={40} />
                <h3 className="font-bold text-xl mb-2">UTAZÁS & LUXUS</h3>
                <p className="text-sm text-gray-400">Ingyenes fotózások Dubajban. Építs nemzetközi kapcsolatokat a mi költségünkön.</p>
              </div>
              <div className="glass-card p-6">
                <DollarSign className="mx-auto text-[#D4AF37] mb-4" size={40} />
                <h3 className="font-bold text-xl mb-2">WHALE HUNTING</h3>
                <p className="text-sm text-gray-400">Mi a "Bálnákra" (gazdag külföldiekre) vadászunk. Dollárban fizetnek.</p>
              </div>
            </div>

            {/* KALKULÁTOR */}
            <div className="bg-[#111] border-2 border-[#D4AF37] p-8 rounded-xl max-w-2xl mx-auto shadow-[0_0_30px_rgba(212,175,55,0.15)]">
              <h3 className="text-gray-400 font-bold mb-4">VÁRHATÓ HAVI BEVÉTEL (INDULÁSKOR)</h3>
              <div className="text-5xl font-mono text-green-500 font-black mb-2">$3,500</div>
              <div className="text-[#D4AF37] text-xl">~ 1,250,000 HUF</div>
              <button className="btn-gold w-full mt-8">JELENTKEZÉS AUDITRA (INGYENES)</button>
            </div>
          </div>
        )}

        {/* --- ADMIN TAB --- */}
        {activeTab === 'admin' && (
          <div className="max-w-md mx-auto bg-[#111] p-8 border border-gray-800">
            {!isAdmin ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Admin Belépés</h2>
                <input 
                  type="password" 
                  placeholder="Jelszó" 
                  className="w-full bg-black border border-gray-700 p-3 mb-4 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin} className="btn-gold w-full">Belépés</button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-6 text-green-500 font-bold">
                  <Lock size={16} /> Adminisztrátor Jog: AKTÍV
                </div>

                <div className="space-y-6">
                  {/* HUNTER BOT */}
                  <div className="border border-gray-700 p-4">
                    <h3 className="font-bold text-lg mb-2">🕵️ REAL HUNTER (Google Dorking)</h3>
                    <p className="text-xs text-gray-500 mb-4">Ez a funkció megkeresi a Twitteren az aktív magyar lányokat.</p>
                    <button 
                      onClick={runHunterBot} 
                      disabled={isSearching}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded flex justify-center items-center gap-2"
                    >
                      {isSearching ? 'Keresés folyamatban...' : '🚀 KERESÉS INDÍTÁSA'}
                    </button>
                  </div>

                  {/* BANNER CSERE */}
                  <div className="border border-gray-700 p-4">
                    <h3 className="font-bold text-lg mb-2">🖼️ Mozgó Bannerek Cseréje</h3>
                    <input type="text" placeholder="Új Kép URL" className="w-full bg-black border border-gray-700 p-2 mb-2 text-sm" />
                    <button className="btn-gold w-full text-sm">Hozzáadás a szalaghoz</button>
                  </div>

                  {/* HÍR HOZZÁADÁS */}
                  <div className="border border-gray-700 p-4">
                    <h3 className="font-bold text-lg mb-2">📰 Új Hír Posztolása</h3>
                    <input type="text" placeholder="Cím" className="w-full bg-black border border-gray-700 p-2 mb-2 text-sm" />
                    <button className="btn-gold w-full text-sm">Posztolás (Dátum auto)</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <footer className="mt-20 border-t border-gray-900 p-8 text-center text-gray-600 text-xs">
        <p>© 2026 PRIME GLOBAL AGENCY. All Rights Reserved.</p>
        <p className="mt-2">Budapest • Dubai • Miami</p>
      </footer>
    </div>
  );
}