"use client";

import React, { useState } from 'react';
import { 
  Zap, ArrowRight, Lock, Mail, 
  Terminal, ShieldCheck, CheckCircle2, 
  Clock, AlertTriangle, ChevronRight,
  HelpCircle, ChevronDown, Globe, 
  Smartphone, X, Scale, BellRing, 
  Banknote, TrendingUp
} from 'lucide-react';

export default function OnyxFinal_V19() {
  // --- ÁLLAPOTOK ---
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // --- EREDMÉNYEK ---
  const LAST_UPDATE = "2026. Február 04. 23:00"; 
  const MATCHES = [
    { name: "Rukh Lviv vs Austria", time: "Ma 14:06", result: "WIN 1.85", type: "Sniper" },
    { name: "Yokohama FC vs Kawasaki", time: "Ma 11:30", result: "WIN 2.10", type: "Sniper" },
    { name: "Santos U20 vs Flamengo", time: "Tegnap 21:45", result: "WIN 1.95", type: "Sniper" },
    { name: "Bayern M. (Am) vs 1860", time: "Tegnap 19:15", result: "LOSS", type: "Sniper" },
  ];

  // --- FAQ ---
  const FAQS = [
    { 
      question: "Mennyi tőke szükséges az induláshoz?", 
      answer: "A rendszer a hosszú távú, stabil vagyonépítésre lett tervezve. Nem a gyors meggazdagodás a cél, hanem a tőke fegyelmezett, hónapról hónapra történő növelése a kamatos kamat erejével. A kezdőtőke mérete másodlagos; a lényeg a stratégia és a Money Management pontos betartása." 
    },
    { 
      question: "Melyik fogadóirodával működik?", 
      answer: "Az Onyx univerzális. Bármilyen irodát használhatsz, ahol van Élő Fogadás (pl. 22Bet, TippmixPro, Unibet, Bet365, Rocky). Mi a technológiai elemzést adjuk, a tranzakciót te hajtod végre a saját felületeden." 
    },
    { 
      question: "Miért ingyenes a Béta alatt?", 
      answer: "Mert bizonyítani akarunk. A piacon sok a hamis ígéret. Mi fordítva működünk: először eredményt teszünk le az asztalra, és ha elégedett vagy a profitoddal, később a fizetős rendszerben is velünk tartasz." 
    },
    { 
      question: "Kell értenem a focihoz?", 
      answer: "Egyáltalán nem. Sőt, befektetői szempontból előny, ha nincsenek érzelmeid a csapatok iránt. Az Onyx AI elvégzi a matematikai elemzést. A te feladatod a jelzések precíz végrehajtása." 
    },
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-purple-500/30 relative text-slate-200 bg-[#000212] overflow-x-hidden">
      
      {/* Háttér elemek */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#000212] to-[#000212]"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>
      <div className="grid-overlay fixed inset-0 z-0 opacity-20 pointer-events-none" style={{backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#000212]/80 backdrop-blur-xl transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.5)]">
               <Zap className="text-white fill-white" size={16} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ONYX<span className="text-purple-500">.AI</span></span>
          </div>
          <a href="https://t.me/SHANNA444" target="_blank" className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5">
            <Terminal size={12} /> Support Kapcsolat
          </a>
        </div>
      </nav>

      <main className="relative z-10 pt-28 pb-20 px-6">
        
        {/* --- HERO SECTION --- */}
        <div className="max-w-4xl mx-auto text-center mb-16 animate-in fade-in zoom-in duration-700">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-6 animate-pulse cursor-default">
            <AlertTriangle size={14} />
            BÉTA TESZT: MÉG INGYENES!
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            A Sportfogadás <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              Forradalma.
            </span>
          </h1>
          
          {/* SZTORI & TECHNOLÓGIA */}
          <div className="max-w-3xl mx-auto mb-8 text-left md:text-center space-y-4">
             <p className="text-lg text-gray-300 leading-relaxed">
               <span className="text-white font-bold">Ez nem tippmix. Ez adatbányászat.</span> <br/>
               Az Onyx AI 14.000 sor Python kóddal, másodpercenként 140 mérkőzést szkennel. A célunk a "technológiai rés" megtalálása: amikor a pályán már "gól van a levegőben", de az oddsok még nem reagáltak.
             </p>
             <div className="flex flex-wrap justify-center gap-3 pt-2">
                 <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-mono text-purple-300">Python Core v4.0</span>
                 <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-mono text-blue-300">Live API Scan</span>
             </div>
          </div>

          {/* --- KOMPAKT "HOGYAN MŰKÖDIK" --- */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 mb-8 text-left max-w-2xl mx-auto backdrop-blur-md">
             <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-bold text-center">A Rendszer Működése</h3>
             <div className="space-y-4">
               {/* 1. Lépés */}
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <BellRing className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">1. Az AI Jelez</h4>
                    <p className="text-gray-400 text-xs">Ha hibás oddsot talál, azonnal küldi az értesítést.</p>
                  </div>
               </div>
               {/* 2. Lépés */}
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Smartphone className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">2. Te Másolsz</h4>
                    <p className="text-gray-400 text-xs">Megnyitod az irodát és 10 mp alatt megrakod a tippet.</p>
                  </div>
               </div>
               {/* 3. Lépés */}
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <TrendingUp className="text-green-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">3. Profitálsz</h4>
                    <p className="text-gray-400 text-xs">A matematika hosszú távon mindig nyer.</p>
                  </div>
               </div>
             </div>
          </div>

          {/* SCARCITY DOBOZ */}
          <div className="mb-8 max-w-lg mx-auto text-center">
             <p className="text-white font-bold text-sm mb-1 flex items-center justify-center gap-2">
               <Lock size={14} className="text-purple-400"/> Csak a Béta teszt alatt ingyenes!
             </p>
             <p className="text-gray-500 text-xs leading-relaxed">
               Ha lejár a tesztidőszak, a rendszer <span className="text-white font-bold">fizetős lesz</span>. Használd ki a lehetőséget most.
             </p>
          </div>

          {/* GOMBOK */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://t.me/SHANNA444" target="_blank" className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95">
              Ingyenes Csatlakozás <ArrowRight size={20} />
            </a>
          </div>
        </div>
{/* --- KOMPATIBILITÁS --- */}
        <div className="w-full overflow-hidden border-y border-white/5 py-8 mb-16 bg-white/[0.02]">
           <div className="max-w-4xl mx-auto text-center mb-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Kompatibilis platformok</p>
           </div>
           <div className="flex justify-center gap-6 md:gap-12 opacity-40 grayscale font-bold text-sm md:text-lg flex-wrap px-4">
              <span>22BET</span>
              <span>TIPPMIXPRO</span>
              <span>UNIBET</span>
              <span>BET365</span>
              <span>ROCKY</span>
              <span>VEGAS</span>
           </div>
        </div>

        {/* --- EREDMÉNYEK TÁBLÁZAT --- */}
        <div className="max-w-3xl mx-auto mb-24 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-20 blur-lg"></div>
          <div className="relative bg-[#05050A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
             <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.02]">
                <h2 className="font-bold flex items-center gap-2 text-white text-sm md:text-base">
                  <Clock className="text-purple-500" size={18} />
                  Előző Napi Zárás
                </h2>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20">
                  {LAST_UPDATE}
                </span>
             </div>
             
             {/* Fejléc */}
             <div className="grid grid-cols-12 bg-white/5 p-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-6 pl-2">Esemény</div>
                <div className="col-span-3 text-center">Idő</div>
                <div className="col-span-3 text-right pr-2">Eredmény</div>
             </div>

             {/* Adatok */}
             {MATCHES.map((match, index) => (
               <div key={index} className="grid grid-cols-12 p-3 border-b border-white/5 items-center hover:bg-white/5 transition-colors group cursor-default">
                  <div className="col-span-6 pl-2">
                     <div className="font-bold text-white group-hover:text-purple-300 transition-colors text-xs md:text-sm truncate">{match.name}</div>
                     <div className="text-[10px] text-gray-500">{match.type} v4.0</div>
                  </div>
                  <div className="col-span-3 text-center text-[10px] md:text-xs text-gray-400 font-mono">
                     {match.time}
                  </div>
                  <div className="col-span-3 text-right pr-2">
                     <span className={`px-1.5 py-0.5 rounded text-[10px] md:text-xs font-bold ${match.result.includes('WIN') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {match.result}
                     </span>
                  </div>
               </div>
             ))}
             
             <div className="p-3 bg-white/[0.02] text-center">
                <a href="https://t.me/SHANNA444" target="_blank" className="text-[10px] md:text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1 transition-colors">
                  Összes korábbi eredmény a Telegramon <ChevronRight size={12} />
                </a>
             </div>
          </div>
        </div>

        {/* --- GYIK / FAQ --- */}
        <div id="faq" className="max-w-3xl mx-auto mb-24 scroll-mt-24">
          <h2 className="text-2xl font-bold text-center mb-8">Gyakori Kérdések</h2>
          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <div key={index} className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white text-sm">{faq.question}</span>
                  <ChevronDown className={`text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} size={16} />
                </button>
                {openFaq === index && (
                  <div className="p-4 pt-0 text-gray-400 text-xs md:text-sm leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- HÍRLEVÉL --- */}
        <div className="max-w-2xl mx-auto text-center bg-[#080810] border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden group mb-16">
           <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white border border-white/10 shadow-lg">
                <Mail size={24} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Technológiai Hírlevél</h2>
              <p className="text-gray-400 mb-6 text-xs md:text-sm">
                Iratkozz fel, és értesítünk az új fejlesztésekről.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                 <input type="email" placeholder="Email cím..." className="flex-1 bg-black border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors placeholder:text-gray-600 text-sm" />
                 <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 text-sm">FELIRATKOZÁS</button>
              </div>
           </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-[#000212] pt-12 pb-32 md:pb-12 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
           <Zap size={18} />
           <span className="font-bold text-lg">ONYX.AI</span>
        </div>
        <p className="text-gray-600 text-[10px] mb-6 max-w-md mx-auto leading-relaxed px-6">
          © 2026 Onyx AI Systems. Minden jog fenntartva. <br/>
          A rendszer fejlesztői nem vállalnak felelősséget a fogadási veszteségekért.
        </p>
        <div className="flex justify-center gap-6 text-[10px] font-bold text-gray-500">
           {/* JOGI GOMB */}
           <button onClick={() => setIsLegalOpen(true)} className="hover:text-white transition-colors flex items-center gap-1 border border-white/10 px-3 py-1.5 rounded-full">
             <Scale size={12} /> Jogi Nyilatkozat & Feltételek (Kattints ide)
           </button>
        </div>
      </footer>

      {/* --- STICKY MOBILE BUTTON (FIXED ALUL) --- */}
      <div className="fixed bottom-0 left-0 w-full p-3 bg-[#000212]/95 backdrop-blur-lg border-t border-white/10 md:hidden z-40 flex justify-between items-center safe-area-pb">
         <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold">Rendszer Státusz</p>
            <p className="text-xs text-green-400 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> ONLINE</p>
         </div>
         <a href="https://t.me/SHANNA444" target="_blank" className="bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse">
            CSATLAKOZÁS
         </a>
      </div>

      {/* --- ATOMBZTOS JOGI MODAL (FELUGRÓ ABLAK) --- */}
      {isLegalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-[#05050A] border border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl relative">
              
              {/* Fejléc */}
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                 <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="text-purple-500" /> Jogi Nyilatkozat
                 </h2>
                 <button onClick={() => setIsLegalOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <X size={18} />
                 </button>
              </div>

              {/* TARTALOM (ATOM BIZTOS SZÖVEGEZÉS) */}
              <div className="p-6 overflow-y-auto text-xs md:text-sm text-gray-400 space-y-6 leading-relaxed text-justify">
                 
                 {/* FIGYELMEZTETÉS */}
                 <div className="p-4 bg-red-900/10 border border-red-500/30 rounded-xl flex gap-3 items-start">
                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                    <div>
                       <h3 className="text-white font-bold mb-2">SZERENCSEJÁTÉK FÜGGŐSÉGET OKOZHAT!</h3>
                       <p className="text-xs text-red-200">
                         A túlzásba vitt szerencsejáték szenvedélybetegséghez, pszichológiai problémákhoz és súlyos anyagi veszteségekhez vezethet. Ha úgy érzi, problémája van, kérjen segítséget szakembertől, vagy tájékozódjon a <a href="http://www.szerencsejatek.hu/felelos-jatekszervezes" className="underline font-bold">Szerencsejáték Zrt. Felelős Játékszervezés</a> oldalán.
                       </p>
                    </div>
                 </div>

                 <section>
                    <h3 className="text-white font-bold text-sm mb-2 uppercase">1. Felelősségkizárás (Disclaimer)</h3>
                    <p>Az Onyx AI szoftver és a kapcsolódó weboldal (Szolgáltatás) kizárólag informatikai és statisztikai célokat szolgál. A generált adatok, előrejelzések és elemzések <strong>NEM minősülnek pénzügyi tanácsadásnak</strong>, befektetési ajánlásnak vagy szerencsejátékra való felbujtásnak.</p>
                    <p className="mt-2">A Szolgáltató/Fejlesztő kifejezetten kizár minden felelősséget a Felhasználó által elszenvedett bárminemű közvetlen vagy közvetett vagyoni kárért, elmaradt haszonért, amely a szoftver használatából vagy az információk felhasználásából ered. A Felhasználó tudomásul veszi, hogy a sportfogadásban a tőkevesztés kockázata 100%.</p>
                 </section>

                 <section>
                    <h3 className="text-white font-bold text-sm mb-2 uppercase">2. 18+ Korhatár</h3>
                    <p>A weboldal látogatása és a Telegram csoporthoz való csatlakozás kizárólag 18. életévüket betöltött személyek számára engedélyezett. A Szolgáltatás használatával Ön kijelenti, hogy nagykorú.</p>
                 </section>

                 <section>
                    <h3 className="text-white font-bold text-sm mb-2 uppercase">3. Szolgáltatás Jellege</h3>
                    <p>A Béta teszt időszak alatt a szolgáltatás ingyenes. A Szolgáltató fenntartja a jogot a szolgáltatás bármikori megszüntetésére vagy fizetőssé tételére. A múltbeli eredmények (backtest adatok) nem garantálják a jövőbeni sikert.</p>
                 </section>

                 <div className="pt-4 border-t border-white/5 text-[10px] text-center text-gray-600">
                    Onyx AI Systems v4.0 - All Rights Reserved 2026.
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}