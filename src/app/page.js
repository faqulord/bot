'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  DollarSign, 
  Globe, 
  Lock, 
  Smartphone, 
  Star, 
  Camera 
} from 'lucide-react';

// --- A FELTÖLTÖTT KÉPEID BEILLESZTVE A LEGJOBB SORRENDBEN ---
const HERO_IMAGES = [
  "https://i.postimg.cc/q7TLcwQP/Gemini-Generated-Image-b5aq1fb5aq1fb5aq.png", // 1. AZ ÚJ SEXY KÉP (Húzóerő)
  "https://i.postimg.cc/LhFYdCq8/Gemini-Generated-Image-z1mm12z1mm12z1mm.png", // 2. FOTÓS (Profizmus üzenet)
  "https://i.postimg.cc/2Sfvg6v9/Gemini-Generated-Image-urcusuurcusuurcu.png", // 3. RING LIGHT (Otthoni munka üzenet)
  "https://i.postimg.cc/hjGVM5m6/Gemini-Generated-Image-io149oio149oio14.png"  // 4. KÖZÖSSÉG (Nem vagy egyedül)
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [formStatus, setFormStatus] = useState('idle');

  // Képváltó automatika (3.5 másodpercenként vált)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const scrollToForm = () => {
    document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Itt lenne a valós adatküldés backendre
    setTimeout(() => {
      setFormStatus('success');
      alert("Jelentkezés sikeresen elküldve! 24 órán belül keresünk.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#00AFF0] selection:text-white">
      
      {/* --- MOBILE NAV (LEBEGŐ HEADER) --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 h-16 flex items-center justify-between px-6 shadow-2xl transition-all">
        <div className="flex flex-col cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <span className="text-xl font-extrabold tracking-[0.15em] uppercase leading-none font-display">
            PRIME<span className="text-[#00AFF0]">GLOBAL</span>
          </span>
          <span className="text-[8px] text-gray-400 tracking-[0.3em] uppercase">Talent Management</span>
        </div>
        <button 
          onClick={scrollToForm}
          className="bg-[#00AFF0] text-white text-[10px] font-bold px-5 py-2.5 rounded uppercase tracking-widest shadow-[0_0_20px_rgba(0,175,240,0.4)] hover:bg-white hover:text-black transition-all transform hover:scale-105"
        >
          Jelentkezem
        </button>
      </nav>

      {/* --- HERO SECTION (A LÉNYEG) --- */}
      <section className="relative h-[95vh] w-full flex flex-col justify-end pb-16 overflow-hidden">
        
        {/* HÁTTÉR KÉPEK (SLIDER) */}
        {HERO_IMAGES.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Sötétítés alul és oldalt, hogy a fehér szöveg olvasható legyen */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent z-10"></div>
            <img src={img} alt="Prime Model" className="w-full h-full object-cover object-center" />
          </div>
        ))}

        {/* CÍMSOR ÉS SZÖVEG */}
        <div className="relative z-20 px-6 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#00AFF0]/40 rounded-full bg-black/70 backdrop-blur-md mb-6 shadow-lg">
            <span className="w-2 h-2 bg-[#00AFF0] rounded-full animate-pulse shadow-[0_0_10px_#00AFF0]"></span>
            <span className="text-[#00AFF0] text-[10px] font-bold tracking-[0.2em] uppercase">
              Hivatalos Partner
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black leading-[0.9] mb-6 text-white drop-shadow-2xl">
            URALD A <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AFF0] to-white">PIACOT.</span><br/>
            A TELEFONOD <br/>A BANKOD.
          </h1>

          <p className="text-gray-300 text-sm sm:text-lg mb-10 leading-relaxed font-medium drop-shadow-lg border-l-4 border-[#00AFF0] pl-5">
            A szépséged a belépő, a stratégia a kulcs. Míg mások 10 órát chatelnek aprópénzért, te éled az életed, mi pedig a <span className="text-white font-bold underline decoration-[#00AFF0]">"Bálna" ügyfelekre</span> vadászunk. 
            <br/><span className="text-[#00AFF0] font-bold mt-2 block tracking-wide uppercase">0-24 Profizmus. Diszkréció. Dollár.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={scrollToForm}
              className="w-full sm:w-auto bg-[#00AFF0] text-white py-4 px-8 text-sm font-extrabold tracking-[0.2em] uppercase rounded shadow-[0_0_30px_rgba(0,175,240,0.6)] flex items-center justify-center gap-3 active:scale-95 transition-transform hover:bg-white hover:text-black group"
            >
              AUDIT INDÍTÁSA <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 bg-black/50 px-4 py-4 rounded border border-white/10">
                <CheckCircle size={14} className="text-green-500"/> Csak Top 1% Lányoknak
            </div>
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF STRIP (PÖRGŐ SÁV) --- */}
      <div className="bg-[#0a0a0a] border-y border-white/5 py-8 overflow-hidden relative">
        <div className="flex justify-center flex-wrap gap-6 sm:gap-12 px-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white"><Globe size={18} className="text-[#00AFF0]"/> ONLYFANS PREMIUM</div>
           <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white"><Shield size={18} className="text-[#00AFF0]"/> DMCA PROTECTED</div>
           <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white"><DollarSign size={18} className="text-[#00AFF0]"/> DAILY PAYOUTS</div>
           <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white"><Camera size={18} className="text-[#00AFF0]"/> PRO STUDIO</div>
        </div>
      </div>

      {/* --- REALITY CHECK ("MIÉRT MI") --- */}
      <section className="py-24 px-6 bg-[#050505] relative overflow-hidden">
        {/* Dekorációs fény a háttérben */}
        <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-[#00AFF0] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black mb-12 leading-tight text-center sm:text-left">
            A legtöbb lány <span className="text-gray-600 line-through decoration-red-500 decoration-2">hobbiból</span> csinálja.<br/>
            Te csináld <span className="text-[#00AFF0]">üzletként.</span>
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#0f0f0f] p-8 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#00AFF0]/30 transition-colors duration-300">
              <div className="absolute right-[-20px] top-[-20px] p-4 opacity-10 group-hover:opacity-20 transition"><Smartphone size={100} /></div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#00AFF0]">01.</span> Szabadság
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                Nem azért kezdtél bele, hogy napi 12 órát a telefonodon lógj. A mi chat-csapatunk dolgozik, amíg te alszol, edzel vagy a tengerparton vagy.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0f0f0f] p-8 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#00AFF0]/30 transition-colors duration-300">
              <div className="absolute right-[-20px] top-[-20px] p-4 opacity-10 group-hover:opacity-20 transition"><DollarSign size={100} /></div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#00AFF0]">02.</span> High-Ticket
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                Nem $10-os feliratkozókra hajtunk. A célunk a VIP "Bálna" réteg, akik élvezik, hogy sokat költhetnek rád. Egy vevő = Egy havi átlagbér.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0f0f0f] p-8 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#00AFF0]/30 transition-colors duration-300">
              <div className="absolute right-[-20px] top-[-20px] p-4 opacity-10 group-hover:opacity-20 transition"><Shield size={100} /></div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#00AFF0]">03.</span> Titoktartás
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                Teljes Magyarország tiltás (Geo-Blocking). A rokonaid, ismerőseid sosem fogják látni a tartalmaidat. Építs karriert anonim módon, 100% biztonságban.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FORM SECTION (JELENTKEZÉS) --- */}
      <section id="apply-form" className="py-24 px-6 bg-gradient-to-b from-[#050505] to-[#0d0d0d] border-t border-white/5 relative">
        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="bg-[#00AFF0]/10 text-[#00AFF0] px-4 py-2 rounded text-[10px] font-bold tracking-[0.3em] uppercase inline-block mb-4 border border-[#00AFF0]/20">
              Limited Spots Available
            </span>
            <h2 className="text-4xl font-black text-white mb-4">Jelentkezés Auditra</h2>
            <p className="text-xs text-gray-400">
              Nem veszünk fel mindenkit. Csak olyan lányokat keresünk, akikben látjuk a potenciált. Töltsd ki, és ha megfelelsz, a Prime csapata felveszi veled a kapcsolatot.
            </p>
          </div>

          <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider ml-1 mb-2 block">Teljes Név / Művésznév</label>
                <input type="text" placeholder="Pl. Kovács Anna" required
                  className="w-full bg-[#050505] border border-white/10 p-4 rounded text-sm focus:border-[#00AFF0] focus:ring-1 focus:ring-[#00AFF0] outline-none transition text-white placeholder-gray-700" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider ml-1 mb-2 block">Instagram Link (Fontos!)</label>
                <input type="text" placeholder="instagram.com/te_neved" required
                  className="w-full bg-[#050505] border border-white/10 p-4 rounded text-sm focus:border-[#00AFF0] focus:ring-1 focus:ring-[#00AFF0] outline-none transition text-white placeholder-gray-700" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider ml-1 mb-2 block">Email Cím (Privát)</label>
                <input type="email" placeholder="email@cim.com" required
                  className="w-full bg-[#050505] border border-white/10 p-4 rounded text-sm focus:border-[#00AFF0] focus:ring-1 focus:ring-[#00AFF0] outline-none transition text-white placeholder-gray-700" />
              </div>

              <div>
                 <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider ml-1 mb-2 block">Jelenlegi bevétel (Havi)</label>
                <select className="w-full bg-[#050505] border border-white/10 p-4 rounded text-sm text-gray-300 focus:border-[#00AFF0] outline-none cursor-pointer">
                  <option>Még nem kezdtem el</option>
                  <option>$0 - $500</option>
                  <option>$500 - $2,000</option>
                  <option>$2,000 - $10,000</option>
                  <option>$10,000+</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={formStatus === 'submitting' || formStatus === 'success'}
                className={`w-full py-5 rounded font-extrabold uppercase tracking-[0.2em] text-xs shadow-lg transition transform hover:scale-[1.01] ${
                  formStatus === 'success' 
                  ? 'bg-green-600 text-white cursor-default' 
                  : 'bg-[#00AFF0] text-white hover:bg-white hover:text-black'
                }`}
              >
                {formStatus === 'idle' && 'Jelentkezés Küldése'}
                {formStatus === 'submitting' && 'Feldolgozás...'}
                {formStatus === 'success' && 'Sikeresen Elküldve!'}
              </button>
              
              <div className="flex justify-center items-center gap-2 mt-4 text-gray-600">
                  <Lock size={10} className="text-green-500"/>
                  <span className="text-[9px] uppercase tracking-widest">Az adataidat titkosítva kezeljük.</span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center border-t border-white/5 bg-black">
         <span className="text-2xl font-black tracking-[0.2em] uppercase text-white leading-none block mb-6">
            PRIME<span className="text-[#00AFF0]">GLOBAL</span>
         </span>
          <div className="flex justify-center gap-6 mb-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>Budapest</span>
            <span className="text-[#00AFF0]">•</span>
            <span>Dubai</span>
            <span className="text-[#00AFF0]">•</span>
            <span>Los Angeles</span>
          </div>
          <p className="text-[9px] text-gray-700">© 2026 Prime Global Agency. All Rights Reserved.</p>
      </footer>
    </div>
  );
}