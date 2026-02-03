'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, DollarSign, Lock, Star, X, Zap, Target, Users, TrendingUp, ChevronRight, Heart, Flame, PlusCircle, CheckCircle } from 'lucide-react';

// --- NYELVI ADATBÁZIS (TRANSLATIONS) ---
const TRANSLATIONS = {
  hu: {
    slogan: "A Te Birodalmad. A Mi Stratégiánk.",
    subSlogan: "Felejtsd el az aprópénzt. A Prime Global a 'Bálna' ügyfelekre vadászik, hogy te dollárban keress, miközben alszol.",
    apply: "JELENTKEZÉS AUDITRA",
    tabs: { news: "Hírek", roster: "Modellek", agency: "Karrier", admin: "Manager" },
    newsTitle: "Prime Insider",
    rosterTitle: "Hivatalos Adatbázis",
    agencyTitle: "Miért a Prime?",
    agencyCards: [
      { title: "Ghost Strategy", desc: "Arc nélküli karrier? Lehetséges. A titokzatosság a legdrágább árucikk." },
      { title: "Global Travel", desc: "Ingyenes fotózások Dubajban és Miamiban. Építsd a portfóliód luxus környezetben." },
      { title: "24/7 Chat Team", desc: "Profi értékesítők kezelik a privátodat. Ők eladnak, te élvezed az életet." }
    ],
    adminLogin: "Manager Belépés",
  },
  en: {
    slogan: "We Build Digital Empires.",
    subSlogan: "Stop chasing pennies. We hunt 'Whale' clients so you earn in dollars while you sleep.",
    apply: "APPLY NOW",
    tabs: { news: "News", roster: "Talent", agency: "Agency", admin: "Admin" },
    newsTitle: "Market Watch",
    rosterTitle: "Official Database",
    agencyTitle: "Why Prime?",
    agencyCards: [
      { title: "Ghost Strategy", desc: "Faceless career? Possible. Mystery is the most expensive commodity." },
      { title: "Global Travel", desc: "Free content trips to Dubai & Miami. Build your portfolio in luxury." },
      { title: "24/7 Chat Team", desc: "Pro Sales team handling your DMs. They sell, you enjoy life." }
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

// MODEL LISTA ADATOK
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
    title: "REKORD: A 'Faceless' modellek bevétele megelőzte a hagyományos profilokat", 
    summary: "A titoktartás új szintje. Miért fizetnek többet a férfiak azért, amit nem látnak?",
    content: "Belső elemzéseink szerint a rejtély faktor 40%-kal növeli a 'Custom Video' kérések árát. A Prime Global 'Ghost' programja pontosan erre épít: hogyan legyél dollármilliomos anélkül, hogy a szomszédod felismerne.",
    tag: "STRATÉGIA", 
    views: "18.2K", 
    likes: 420,
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80" 
  },
  { 
    id: 2, 
    date: "TEGNAP", 
    title: "Miami Content Trip: 5 Modellünk már a magángépen", 
    summary: "Nem csak munka, életstílus. Kövesd a lányokat Instagramon!",
    content: "A negyedéves luxusút keretében kiemelt modelljeink Miamiba utaztak. Profi fotós stáb, 5 csillagos hotel és VIP belépők. Ez a tartalom generálja majd a következő hónap 'Bálna' feliratkozóit.",
    tag: "LIFESTYLE", 
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
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  
  // Admin Post Creator State
  const [newTitle, setNewTitle] = useState('');
  const [newImg, setNewImg] = useState('');
  const [newTag, setNewTag] = useState('UPDATE');
  const [fakeLikes, setFakeLikes] = useState(100);

  const handleReaction = (id) => {
    setNews(news.map(item => item.id === id ? { ...item, likes: item.likes + 1 } : item));
  };

  const handlePostNews = () => {
    if(!newTitle) return alert("Adj meg címet!");
    const newPost = {
      id: Date.now(),
      date: "ÉPPEN MOST",
      title: newTitle,
      summary: "Friss frissítés a menedzsmenttől.",
      content: "Részletek hamarosan...",
      tag: newTag,
      views: "1.2K",
      likes: parseInt(fakeLikes),
      img: newImg || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"
    };
    setNews([newPost, ...news]);
    alert("Poszt sikeresen közzétéve!");
    setNewTitle('');
    setNewImg('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans overflow-x-hidden pb-24 md:pb-0">
      
      {/* 1. HEADER & MARQUEE */}
      <header className="fixed top-0 w-full z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="h-6 w-1 bg-[#C5A059]"></div>
             <h1 className="text-xl font-display font-bold tracking-widest text-white uppercase">
               PRIME<span className="text-[#C5A059]">GLOBAL</span>
             </h1>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={() => setLang(lang === 'hu' ? 'en' : 'hu')} className="flex items-center gap-1 text-xs font-bold border border-white/20 px-3 py-1 rounded hover:border-[#C5A059] transition">
               <Globe size={14} className="text-[#C5A059]"/>
               {lang === 'hu' ? 'HU' : 'EN'}
             </button>
             <button className="hidden md:block bg-[#C5A059] text-black px-5 py-2 text-xs font-bold tracking-widest hover:bg-white transition duration-300">
               {t.apply}
             </button>
          </div>
        </div>

        <div className="border-t border-white/5 bg-black/50 py-2 overflow-hidden relative">
          <div className="flex w-max animate-scroll">
            {[...BANNER_MODELS, ...BANNER_MODELS, ...BANNER_MODELS, ...BANNER_MODELS].map((src, i) => (
              <div key={i} className="flex-shrink-0 mx-3 opacity-80 hover:opacity-100 transition duration-300 cursor-pointer border border-[#C5A059]/30 rounded-full p-0.5">
                <img src={src} className="w-12 h-12 rounded-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <div className="pt-36 pb-12 px-6 text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#C5A059] opacity-[0.1] blur-[100px] rounded-full pointer-events-none"></div>
        
        <span className="inline-block py-1 px-3 border border-[#C5A059]/30 rounded-full bg-[#C5A059]/5 text-[#C5A059] text-[10px] font-bold tracking-[0.2em] mb-4">
          PREMIUM MANAGEMENT
        </span>
        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-tight">
          {t.slogan}
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          {t.subSlogan}
        </p>
        
        <div className="hidden md:flex justify-center gap-4 relative z-10">
          {Object.entries(t.tabs).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-8 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                activeTab === key 
                ? 'bg-[#C5A059] text-black border-[#C5A059]' 
                : 'bg-black/50 text-gray-500 border-white/10 hover:border-[#C5A059] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4">

        {/* --- TAB 1: NEWS PORTAL --- */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <h3 className="text-[#C5A059] font-bold text-lg tracking-widest border-l-4 border-[#C5A059] pl-4">{t.newsTitle}</h3>
            {news.map((item) => (
              <div key={item.id} className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden hover:border-[#C5A059]/30 transition group">
                <div className="h-48 md:h-64 overflow-hidden relative" onClick={() => setSelectedNews(item)}>
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute top-3 left-3 bg-black/80 px-2 py-1 text-[10px] font-bold text-[#C5A059] border border-[#C5A059]/30">
                    {item.tag}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-2 uppercase tracking-wider">
                    <span>{item.date}</span>
                    <span>{item.views} views</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">{item.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">{item.summary}</p>
                  
                  <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                    <button 
                      onClick={() => handleReaction(item.id)}
                      className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-red-500 transition"
                    >
                      <Heart size={16} className={item.likes > 500 ? "text-red-500 fill-red-500" : ""} /> 
                      {item.likes}
                    </button>
                    <button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-orange-500 transition">
                      <Flame size={16} /> Hot
                    </button>
                    <button className="ml-auto text-[#C5A059] text-xs font-bold flex items-center gap-1" onClick={() => setSelectedNews(item)}>
                      OLVASÁS <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- TAB 2: ROSTER (MODELLEK) --- */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
             <h3 className="text-[#C5A059] font-bold text-lg tracking-widest border-l-4 border-[#C5A059] pl-4">{t.rosterTitle}</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {ROSTER_DATA.map((model, i) => (
                 <div key={i} className="flex items-center gap-4 bg-[#0f0f0f] border border-white/5 p-4 rounded-xl hover:border-[#C5A059]/50 transition cursor-pointer group">
                   <div className="relative">
                     <img src={model.img} className="w-14 h-14 rounded-full object-cover border border-[#C5A059]/30" />
                     <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${model.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                   </div>
                   <div className="flex-1">
                     <h4 className="text-white font-bold">{model.name}</h4>
                     <span className="text-[10px] text-[#C5A059] border border-[#C5A059]/30 px-2 py-0.5 rounded">{model.cat}</span>
                   </div>
                   <div className="opacity-0 group-hover:opacity-100 transition">
                     <ChevronRight className="text-[#C5A059]" />
                   </div>
                 </div>
               ))}
             </div>
             <div className="bg-[#111] p-6 text-center border border-white/5 rounded-xl">
               <p className="text-sm text-gray-400 mb-2">Te is felkerülnél a listára?</p>
               <button className="text-[#C5A059] font-bold text-xs hover:underline uppercase tracking-widest">Jelentkezés az Adatbázisba</button>
             </div>
          </div>
        )}

        {/* --- TAB 3: AGENCY --- */}
        {activeTab === 'agency' && (
          <div className="text-center animate-in fade-in">
            <h3 className="text-2xl font-display text-white mb-8">{t.agencyTitle}</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {t.agencyCards.map((card, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/5 hover:border-[#C5A059] transition rounded-lg">
                  <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C5A059]">
                    <Star size={24} />
                  </div>
                  <h4 className="font-bold text-white mb-2">{card.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-br from-[#111] to-black border border-[#C5A059] p-8 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059] blur-[80px] opacity-10"></div>
              <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">{t.apply}</h3>
              <div className="space-y-3 max-w-sm mx-auto">
                <input type="text" placeholder="TELJES NÉV" className="w-full bg-black/50 border border-white/20 p-3 rounded text-white text-xs focus:border-[#C5A059] outline-none" />
                <input type="text" placeholder="INSTAGRAM / ONLYFANS" className="w-full bg-black/50 border border-white/20 p-3 rounded text-white text-xs focus:border-[#C5A059] outline-none" />
                <button className="w-full bg-[#C5A059] text-black font-bold py-3 rounded text-xs tracking-[0.2em] hover:bg-white transition">
                  KÜLDÉS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: ADMIN --- */}
        {activeTab === 'admin' && (
          <div className="max-w-md mx-auto bg-[#0f0f0f] border border-white/10 p-6 rounded-xl">
            {!isAdmin ? (
               <div className="text-center">
                 <Lock className="mx-auto text-[#C5A059] mb-4" size={24} />
                 <h2 className="text-white font-bold mb-6 tracking-widest">{t.adminLogin}</h2>
                 <input type="password" placeholder="Jelszó" className="w-full bg-black border border-white/20 p-3 mb-4 rounded text-center text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
                 <button onClick={() => password === 'admin123' && setIsAdmin(true)} className="w-full bg-white text-black font-bold py-3 rounded text-xs tracking-widest">BELÉPÉS</button>
               </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-[#C5A059] font-bold text-sm tracking-widest flex items-center gap-2"><Zap size={16}/> POST CREATOR</h3>
                
                <div className="space-y-3">
                   <input 
                     type="text" 
                     placeholder="Cikk Címe (pl. Új rekord...)" 
                     className="w-full bg-black border border-white/20 p-2 rounded text-white text-xs"
                     value={newTitle}
                     onChange={(e) => setNewTitle(e.target.value)}
                   />
                   <input 
                     type="text" 
                     placeholder="Kép URL (pl. unsplash.com/...)" 
                     className="w-full bg-black border border-white/20 p-2 rounded text-white text-xs"
                     value={newImg}
                     onChange={(e) => setNewImg(e.target.value)}
                   />
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       placeholder="Címke (pl. MONEY)" 
                       className="w-1/2 bg-black border border-white/20 p-2 rounded text-white text-xs"
                       value={newTag}
                       onChange={(e) => setNewTag(e.target.value)}
                     />
                     <input 
                       type="number" 
                       placeholder="Kamu Likeok" 
                       className="w-1/2 bg-black border border-white/20 p-2 rounded text-white text-xs"
                       value={fakeLikes}
                       onChange={(e) => setFakeLikes(e.target.value)}
                     />
                   </div>
                   
                   <button onClick={handlePostNews} className="w-full bg-[#C5A059] text-black font-bold py-2 rounded text-xs flex items-center justify-center gap-2 hover:bg-white transition">
                     <PlusCircle size={14} /> POSZTOLÁS
                   </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* MOBIL NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 w-full bg-[#050505]/95 backdrop-blur-md border-t border-white/10 p-2 flex justify-around z-50 pb-6">
        {Object.entries(t.tabs).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${activeTab === key ? 'text-[#C5A059]' : 'text-gray-500'}`}
          >
            {key === 'news' && <Zap size={20} />}
            {key === 'roster' && <Users size={20} />}
            {key === 'agency' && <Target size={20} />}
            {key === 'admin' && <Lock size={20} />}
            <span className="text-[10px] font-bold uppercase">{label}</span>
          </button>
        ))}
      </div>

      {/* MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0f0f0f] border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative rounded-xl">
            <button onClick={() => setSelectedNews(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:text-[#C5A059] z-50">
              <X size={24} />
            </button>
            <img src={selectedNews.img} className="w-full h-64 object-cover opacity-90" />
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                 <span className="text-[#C5A059] text-[10px] font-bold border border-[#C5A059] px-2 py-1 rounded">{selectedNews.tag}</span>
                 <span className="text-gray-400 text-[10px] py-1">{selectedNews.date}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{selectedNews.title}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm border-l-2 border-[#C5A059] pl-4">{selectedNews.content}</p>
              
              <button className="w-full mt-8 