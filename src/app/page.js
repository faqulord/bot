'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, DollarSign, Lock, Star, X, Zap, Target, Users, TrendingUp, ChevronRight, Heart, Flame, PlusCircle, CheckCircle, ArrowRight } from 'lucide-react';

// --- NYELVI ÉS MARKETING ADATBÁZIS ---
const TRANSLATIONS = {
  hu: {
    slogan: "Hivatalos OnlyFans Management.",
    subSlogan: "Professzionális márkaépítés és 0-24 Chat Management. Növeld a bevételedet 300%-kal az első hónapban, miközben mi levesszük a terhet a válladról.",
    apply: "JELENTKEZÉS MENEDZSMENTRE",
    tabs: { news: "Hírek", roster: "Modellek", agency: "Karrier", admin: "Manager" },
    newsTitle: "Piaci Hírek",
    rosterTitle: "Ellenőrzött Modellek",
    agencyTitle: "Miért válassz minket?",
    agencyText: "A legtöbb modell a bevételének 60%-át az asztalon hagyja rossz árazással és gyenge kommunikációval. Mi nem csak egy ügynökség vagyunk, hanem befektetők. Pénzt, időt és szakértelmet teszünk a karrieredbe.",
    agencyCards: [
      { title: "Fix Bevétel Stratégia", desc: "Kiszámítható havi profit. Nincs több hullámvölgy, csak folyamatos növekedés." },
      { title: "Nemzetközi Márkaépítés", desc: "Kiszabadítunk a magyar piacról. Célközönség: USA, UK és Nyugat-Európa." },
      { title: "0-24 Chat Team", desc: "Profi értékesítők válaszolnak helyetted. Minden üzenetből kihozzuk a maximumot." }
    ],
    adminLogin: "Manager Belépés",
  },
  en: {
    slogan: "Official OnlyFans Management.",
    subSlogan: "Professional branding and 24/7 Chat Management. Increase your revenue by 300% in the first month while we handle the heavy lifting.",
    apply: "APPLY FOR MANAGEMENT",
    tabs: { news: "News", roster: "Talent", agency: "Career", admin: "Admin" },
    newsTitle: "Market News",
    rosterTitle: "Verified Talent",
    agencyTitle: "Why Choose Us?",
    agencyText: "Most models leave 60% of their revenue on the table due to poor pricing and weak communication. We are not just an agency; we are investors. We put money, time, and expertise into your career.",
    agencyCards: [
      { title: "Fixed Income Strategy", desc: "Predictable monthly profit. No more ups and downs, just continuous growth." },
      { title: "Global Branding", desc: "Break out of the local market. Target audience: USA, UK, and Western Europe." },
      { title: "24/7 Chat Team", desc: "Pro sales team replying for you. We maximize profit from every message." }
    ],
    adminLogin: "Manager Login",
  }
};

const BANNER_MODELS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506956191951-7a88da4435e5?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop"
];

const ROSTER_DATA = [
  { name: "Kitti_Official", cat: "ELITE", status: "Online", img: BANNER_MODELS[0] },
  { name: "Szandra_Queen", cat: "NEW FACE", status: "Online", img: BANNER_MODELS[1] },
  { name: "Vivi_Baby", cat: "TEEN", status: "Away", img: BANNER_MODELS[2] },
  { name: "Masked_Goddess", cat: "FACELESS", status: "Online", img: BANNER_MODELS[3] },
  { name: "Petra_Fit", cat: "FITNESS", status: "Online", img: BANNER_MODELS[4] },
  { name: "Niki_VIP", cat: "ELITE", status: "Offline", img: BANNER_MODELS[5] }
];

const INITIAL_NEWS = [
  { 
    id: 1, 
    date: "MA | 14:00", 
    title: "Piaci Elemzés: Hogyan érj el $10k+ bevételt 60 nap alatt?", 
    summary: "A 'High-Ticket' értékesítés titka. Miért fizetnek a Bálnák?",
    content: "Az adataink egyértelműek: nem a követők száma, hanem a minősége számít. A Prime Global stratégiájával a modellek a feliratkozóik 1%-ából szerzik a bevételük 80%-át. A kulcs a pszichológiai alapú chat-szkriptek használata.",
    tag: "TIPP", 
    views: "18.2K", 
    likes: 420,
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80" 
  },
  { 
    id: 2, 
    date: "TEGNAP", 
    title: "Új Trend: Az arc nélküli (Faceless) profilok robbanása", 
    summary: "Anonimitás és luxus bevétel. Lehetséges?",
    content: "Sokan félnek belevágni az arcfelismerés miatt. Jó hírünk van: a Faceless profilok jelenleg a piac leggyorsabban növekvő szegmense. A rejtélyfaktor miatt a felhasználók többet fizetnek a privát tartalmakért.",
    tag: "TREND", 
    views: "12.5K", 
    likes: 850,
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80" 
  }
];

export default function Home() {
  const [lang, setLang] = useState('hu');
  const t = TRANSLATIONS[lang];

  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState(INITIAL_NEWS);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  
  // Admin State
  const [newTitle, setNewTitle] = useState('');
  const [newImg, setNewImg] = useState('');
  const [newTag, setNewTag] = useState('UPDATE');
  const [fakeLikes, setFakeLikes] = useState(100);

  // REAKCIÓ KEZELÉS (ANTI-BUG: localStorage használat)
  const handleReaction = (id) => {
    // Ellenőrizzük, hogy a böngészőben van-e már mentve like
    const storageKey = `liked_${id}`;
    const alreadyLiked = localStorage.getItem(storageKey);

    if (alreadyLiked) {
      alert("Már reagáltál erre a posztra!");
      return;
    }

    // Ha nincs, növeljük és mentjük
    setNews(news.map(item => item.id === id ? { ...item, likes: item.likes + 1 } : item));
    localStorage.setItem(storageKey, 'true');
  };

  const handlePostNews = () => {
    if(!newTitle) return alert("Adj meg címet!");
    const newPost = {
      id: Date.now(),
      date: "ÉPPEN MOST",
      title: newTitle,
      summary: "Hivatalos közlemény.",
      content: "Részletek hamarosan...",
      tag: newTag,
      views: "1.2K",
      likes: parseInt(fakeLikes),
      img: newImg || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"
    };
    setNews([newPost, ...news]);
    alert("Poszt közzétéve!");
    setNewTitle('');
    setNewImg('');
  };
return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans overflow-x-hidden pb-24 md:pb-0">
      
      {/* 1. HEADER & MARQUEE */}
      <header className="fixed top-0 w-full z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="h-6 w-1 bg-[#00AFF0]"></div> {/* OF KÉK CSÍK */}
             <h1 className="text-xl font-display font-bold tracking-widest text-white uppercase">
               PRIME<span className="text-[#00AFF0]">GLOBAL</span>
             </h1>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={() => setLang(lang === 'hu' ? 'en' : 'hu')} className="flex items-center gap-1 text-xs font-bold border border-white/20 px-3 py-1 rounded hover:border-[#00AFF0] transition text-gray-300">
               <Globe size={14} className="text-[#00AFF0]"/>
               {lang === 'hu' ? 'HU' : 'EN'}
             </button>
             <button onClick={() => setActiveTab('agency')} className="hidden md:block bg-[#00AFF0] text-white px-5 py-2 text-xs font-bold tracking-widest hover:bg-white hover:text-black transition duration-300 rounded-sm shadow-[0_0_15px_rgba(0,175,240,0.3)]">
               {t.apply}
             </button>
          </div>
        </div>

        {/* MOZGÓ BANNER */}
        <div className="border-t border-white/5 bg-black/50 py-2 overflow-hidden relative">
          <div className="flex w-max animate-scroll">
            {[...BANNER_MODELS, ...BANNER_MODELS, ...BANNER_MODELS, ...BANNER_MODELS].map((src, i) => (
              <div key={i} className="flex-shrink-0 mx-3 opacity-80 hover:opacity-100 transition duration-300 cursor-pointer border border-[#00AFF0]/30 rounded-full p-0.5 hover:scale-110">
                <img src={src} className="w-10 h-10 rounded-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <div className="pt-36 pb-12 px-6 text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#00AFF0] opacity-[0.15] blur-[120px] rounded-full pointer-events-none"></div>
        
        <span className="inline-block py-1 px-3 border border-[#00AFF0]/30 rounded-full bg-[#00AFF0]/10 text-[#00AFF0] text-[10px] font-bold tracking-[0.2em] mb-4">
          HUNGARY'S #1 AGENCY
        </span>
        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
          {t.slogan}
        </h2>
        <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          {t.subSlogan}
        </p>
        
        {/* TAB NAVIGÁCIÓ */}
        <div className="hidden md:flex justify-center gap-4 relative z-10">
          {Object.entries(t.tabs).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-8 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 border rounded-sm ${
                activeTab === key 
                ? 'bg-[#00AFF0] text-white border-[#00AFF0] shadow-[0_0_20px_rgba(0,175,240,0.4)]' 
                : 'bg-black/50 text-gray-500 border-white/10 hover:border-[#00AFF0] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4">

        {/* --- NEWS PORTAL --- */}
        {activeTab === 'news' && (
          <div className="space-y-8 animate-in fade-in">
            <h3 className="text-[#00AFF0] font-bold text-lg tracking-widest border-l-4 border-[#00AFF0] pl-4">{t.newsTitle}</h3>
            {news.map((item) => (
              <div key={item.id} className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden hover:border-[#00AFF0]/50 transition group shadow-lg">
                <div className="h-56 md:h-72 overflow-hidden relative cursor-pointer" onClick={() => setSelectedNews(item)}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent opacity-60"></div>
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute top-4 left-4 bg-[#00AFF0] text-white px-3 py-1 text-[10px] font-bold rounded shadow-lg">
                    {item.tag}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-3 uppercase tracking-wider">
                    <span>{item.date}</span>
                    <span className="flex items-center gap-1"><TrendingUp size={12}/> {item.views}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-snug cursor-pointer hover:text-[#00AFF0] transition" onClick={() => setSelectedNews(item)}>{item.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-6 font-light">{item.summary}</p>
                  
                  <div className="flex items-center gap-6 border-t border-white/5 pt-4">
                    <button 
                      onClick={() => handleReaction(item.id)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#00AFF0] transition group/btn"
                    >
                      <Heart size={18} className={`transition ${item.likes > 500 ? "text-[#00AFF0] fill-[#00AFF0]" : "group-hover/btn:scale-110"}`} /> 
                      {item.likes}
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-orange-500 transition">
                      <Flame size={18} /> Hot
                    </button>
                    <button className="ml-auto bg-white/5 hover:bg-[#00AFF0] hover:text-white text-gray-300 px-4 py-2 rounded text-xs font-bold transition flex items-center gap-2" onClick={() => setSelectedNews(item)}>
                      OLVASÁS <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- AGENCY (KARRIER & LEÍRÁS) --- */}
        {activeTab === 'agency' && (
          <div className="animate-in fade-in">
            {/* Intro Text */}
            <div className="text-center mb-16 px-4">
              <h3 className="text-3xl font-display text-white mb-6">{t.agencyTitle}</h3>
              <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base border-l-2 border-[#00AFF0] pl-6 text-left md:text-center md:border-l-0 md:border-t-2 md:pt-6">
                {t.agencyText}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {t.agencyCards.map((card, i) => (
                <div key={i} className="p-8 bg-[#111] border border-white/5 hover:border-[#00AFF0] transition rounded-2xl group hover:-translate-y-2 duration-300">
                  <div className="w-14 h-14 bg-[#00AFF0]/10 rounded-full flex items-center justify-center mb-6 text-[#00AFF0] group-hover:bg-[#00AFF0] group-hover:text-white transition">
                    <Star size={28} />
                  </div>
                  <h4 className="font-bold text-white mb-3 text-lg">{card.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
            
            {/* Jelentkezés Box */}
            <div className="bg-gradient-to-r from-[#00AFF0] to-[#008ac0] p-1 rounded-2xl shadow-[0_0_40px_rgba(0,175,240,0.2)]">
              <div className="bg-[#0a0a0a] p-8 md:p-12 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00AFF0] blur-[120px] opacity-10"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Csatlakozz Hozzánk</h3>
                  <p className="text-gray-400 text-xs mb-8">Kezdd el építeni a saját birodalmadat még ma.</p>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    <input type="text" placeholder="TELJES NÉV / MŰVÉSZNÉV" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg text-white text-xs focus:border-[#00AFF0] outline-none transition" />
                    <input type="text" placeholder="INSTAGRAM / ONLYFANS LINK" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg text-white text-xs focus:border-[#00AFF0] outline-none transition" />
                    <button className="w-full bg-[#00AFF0] text-white font-bold py-4 rounded-lg text-sm tracking-widest hover:bg-white hover:text-[#00AFF0] transition shadow-lg transform hover:scale-[1.02] duration-200">
                      JELENTKEZÉS ELKÜLDÉSE
                    </button>
                    <p className="text-[10px] text-gray-500 mt-4">Az adataidat 100% diszkrécióval kezeljük.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ROSTER --- */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
             <h3 className="text-[#00AFF0] font-bold text-lg tracking-widest border-l-4 border-[#00AFF0] pl-4">{t.rosterTitle}</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {ROSTER_DATA.map((model, i) => (
                 <div key={i} className="flex items-center gap-4 bg-[#0f0f0f] border border-white/5 p-4 rounded-xl hover:border-[#00AFF0]/50 transition cursor-pointer group">
                   <div className="relative">
                     <img src={model.img} className="w-16 h-16 rounded-full object-cover border-2 border-[#00AFF0]/30 group-hover:border-[#00AFF0] transition" />
                     <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0f0f0f] ${model.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                   </div>
                   <div className="flex-1">
                     <h4 className="text-white font-bold text-lg">{model.name}</h4>
                     <span className="text-[10px] text-[#00AFF0] bg-[#00AFF0]/10 px-2 py-0.5 rounded font-bold">{model.cat}</span>
                   </div>
                   <div className="opacity-0 group-hover:opacity-100 transition -translate-x-2 group-hover:translate-x-0">
                     <ChevronRight className="text-[#00AFF0]" />
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* --- ADMIN --- */}
        {activeTab === 'admin' && (
          <div className="max-w-md mx-auto bg-[#0f0f0f] border border-white/10 p-8 rounded-xl shadow-2xl">
            {!isAdmin ? (
               <div className="text-center">
                 <Lock className="mx-auto text-[#00AFF0] mb-4" size={32} />
                 <h2 className="text-white font-bold mb-6 tracking-widest">{t.adminLogin}</h2>
                 <input type="password" placeholder="Jelszó" className="w-full bg-black border border-white/20 p-4 mb-4 rounded-lg text-center text-white focus:border-[#00AFF0] outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
                 <button onClick={() => password === 'admin123' && setIsAdmin(true)} className="w-full bg-[#00AFF0] text-white font-bold py-3 rounded-lg text-sm tracking-widest hover:bg-white hover:text-black transition">BELÉPÉS</button>
               </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-[#00AFF0] font-bold text-sm tracking-widest flex items-center gap-2"><Zap size={16}/> POST CREATOR (GOD MODE)</h3>
                
                <div className="space-y-3">
                   <input type="text" placeholder="Cikk Címe" className="w-full bg-black border border-white/20 p-3 rounded text-white text-xs" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                   <input type="text" placeholder="Kép URL" className="w-full bg-black border border-white/20 p-3 rounded text-white text-xs" value={newImg} onChange={(e) => setNewImg(e.target.value)} />
                   <div className="flex gap-2">
                     <input type="text" placeholder="Címke" className="w-1/2 bg-black border border-white/20 p-3 rounded text-white text-xs" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
                     <input type="number" placeholder="Kezdő Likeok" className="w-1/2 bg-black border border-white/20 p-3 rounded text-white text-xs" value={fakeLikes} onChange={(e) => setFakeLikes(e.target.value)} />
                   </div>
                   <button onClick={handlePostNews} className="w-full bg-[#00AFF0] text-white font-bold py-3 rounded text-xs flex items-center justify-center gap-2 hover:bg-white hover:text-[#00AFF0] transition">
                     <PlusCircle size={14} /> POSZTOLÁS
                   </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* MOBIL MENU (BOTTOM) */}
      <div className="md:hidden fixed bottom-0 w-full bg-[#050505]/95 backdrop-blur-md border-t border-white/10 p-2 flex justify-around z-50 pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        {Object.entries(t.tabs).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${activeTab === key ? 'text-[#00AFF0]' : 'text-gray-500'}`}
          >
            {key === 'news' && <Zap size={22} />}
            {key === 'roster' && <Users size={22} />}
            {key === 'agency' && <Target size={22} />}
            {key === 'admin' && <Lock size={22} />}
            <span className="text-[9px] font-bold uppercase tracking-wide">{label}</span>
          </button>
        ))}
      </div>

      {/* MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f0f0f] border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative rounded-2xl shadow-2xl">
            <button onClick={() => setSelectedNews(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:text-[#00AFF0] z-50 transition">
              <X size={24} />
            </button>
            <img src={selectedNews.img} className="w-full h-64 object-cover opacity-90" />
            <div className="p-8">
              <div className="flex gap-3 mb-6">
                 <span className="text-[#00AFF0] text-[10px] font-bold border border-[#00AFF0] px-3 py-1 rounded bg-[#00AFF0]/10">{selectedNews.tag}</span>
                 <span className="text-gray-400 text-[10px] py-1">{selectedNews.date}</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-6 leading-tight">{selectedNews.title}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm border-l-4 border-[#00AFF0] pl-6 mb-8">{selectedNews.content}</p>
              
              <button className="w-full bg-[#00AFF0] text-white font-bold py-4 rounded-lg text-sm tracking-widest hover:bg-white hover:text-[#00AFF0] transition shadow-[0_0_20px_rgba(0,175,240,0.3)]">
                JELENTKEZÉS A CSAPATBA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}