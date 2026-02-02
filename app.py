import streamlit as st
import pandas as pd
import time
import random

# --- 1. KONFIGURÁCIÓ ---
st.set_page_config(
    page_title="PRIME GLOBAL | Official",
    page_icon="👑",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- 2. ADATOK & ÁLLAPOT ---
if 'news' not in st.session_state:
    st.session_state.news = [
        {"title": "LEAKED: Magyar modellek privát bulija Miamiban", "img": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80", "tag": "LIFESTYLE", "reactions": {"🔥": 2400, "🍑": 850}},
        {"title": "TOP 10: Ők keresték a legtöbbet januárban", "img": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80", "tag": "BUSINESS", "reactions": {"🔥": 1150, "🍑": 400}},
        {"title": "MASK ON: Miért keresnek többet az arc nélküli lányok?", "img": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80", "tag": "STRATEGY", "reactions": {"🔥": 3200, "🍑": 120}}
    ]

# A MOZGÓ SZALAG KÉPEI
if 'marquee' not in st.session_state:
    st.session_state.marquee = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1506956191951-7a88da4435e5?w=200&h=200&fit=crop"
    ] * 5

# A "VALÓDI" LISTA (Kezdetben üres, ide importálsz majd)
if 'roster' not in st.session_state:
    st.session_state.roster = [
        {"name": "Kitti_Official", "cat": "Elite", "link": "#"},
        {"name": "Szandra_Queen", "cat": "New Face", "link": "#"},
        {"name": "Masked_Goddess", "cat": "Faceless", "link": "#"}
    ]

# --- 3. CSS DESIGN (PRÉMIUM FEKETE-ARANY) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@300;400;600;800&display=swap');
    
    .stApp { background-color: #000000; color: #ffffff; font-family: 'Inter', sans-serif; }
    
    /* ANIMÁLT ARANY CÍMSOR */
    .gold-title {
        font-family: 'Cinzel', serif; font-size: 2.5rem; margin: 0;
        background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        animation: shine 3s infinite linear;
    }
    @keyframes shine { 0% {background-position: 0;} 100% {background-position: 200px;} }

    /* HEADER */
    .header-compact {
        display: flex; justify-content: space-between; align-items: center;
        padding: 15px 20px; border-bottom: 1px solid #222; background: #050505;
    }
    
    /* MARQUEE (KEREK KÉPEK) */
    .marquee-container {
        overflow: hidden; white-space: nowrap; background: #0a0a0a; padding: 10px 0; border-bottom: 1px solid #222;
    }
    .marquee-content { display: inline-block; animation: scroll 30s linear infinite; }
    .marquee-img {
        height: 70px; width: 70px; margin: 0 8px; border-radius: 50%;
        border: 2px solid #333; object-fit: cover; transition: 0.3s;
    }
    .marquee-img:hover { border-color: #D4AF37; transform: scale(1.15); box-shadow: 0 0 15px rgba(212, 175, 55, 0.4); }
    @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

    /* AGENCY SZÖVEG DOBOZ */
    .agency-hero {
        text-align: center; padding: 40px 20px;
        background: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
        border: 1px solid #333; margin-bottom: 30px;
    }
    .feature-card {
        background: rgba(255,255,255,0.05); padding: 20px; border: 1px solid #333; text-align: center;
        transition: 0.3s;
    }
    .feature-card:hover { border-color: #D4AF37; transform: translateY(-5px); }

    /* KALKULÁTOR DOBOZ */
    .calc-box {
        background: #111; border: 2px solid #D4AF37; padding: 30px; border-radius: 10px;
        text-align: center; margin-top: 20px; box-shadow: 0 0 30px rgba(212, 175, 55, 0.1);
    }
    .money-text { font-size: 2.5rem; color: #00ff00; font-weight: 900; font-family: monospace; }

    /* LISTA TABLÁZAT */
    .roster-row {
        display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #222; align-items: center;
    }
    .roster-row:hover { background: #111; }
    
    /* GOMBOK */
    .stButton > button {
        background: #D4AF37; color: black; font-weight: bold; border-radius: 0px; border: none;
        text-transform: uppercase; letter-spacing: 1px;
    }
    .stButton > button:hover { background: #fff; box-shadow: 0 0 15px white; }

    </style>
""", unsafe_allow_html=True)

# --- 4. HEADER & MARQUEE ---
st.markdown("""
<div class="header-compact">
    <div class="gold-title">PRIME GLOBAL</div>
    <div style="color: #666; font-size: 10px; letter-spacing: 2px;">EXCLUSIVE MANAGEMENT</div>
    <div style="font-size: 20px;">🇬🇧 🇺🇸 🇦🇪</div>
</div>
""", unsafe_allow_html=True)

# Mozgó szalag
images_html = "".join([f'<img src="{img}" class="marquee-img">' for img in st.session_state.marquee])
st.markdown(f"""
<div class="marquee-container">
    <div class="marquee-content">{images_html}</div>
</div>
""", unsafe_allow_html=True)

# --- 5. FÜLEK ---
tab_portal, tab_list, tab_agency, tab_admin = st.tabs(["🔥 NEWS PORTAL", "📋 OFFICIAL ROSTER", "💎 AGENCY & CAREER", "🛠️ ADMIN"])

# === TAB 1: NEWS PORTAL (A Csali) ===
with tab_portal:
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Fő Cikk
    hero = st.session_state.news[0]
    st.markdown(f"""
    <div style="background-image: url('{hero['img']}'); height: 300px; background-size: cover; position: relative; border: 1px solid #333;">
        <div style="position: absolute; bottom: 0; background: linear-gradient(to top, #000, transparent); width: 100%; padding: 20px;">
            <span style="background:#D4AF37; color:black; padding: 2px 8px; font-size: 10px; font-weight:bold;">{hero['tag']}</span>
            <h2 style="color: white; margin: 5px 0;">{hero['title']}</h2>
            <div style="margin-top:10px;">
                <span style="background:#111; color:#D4AF37; padding:5px 10px; border-radius:20px; font-size:12px; margin-right:10px;">🔥 {hero['reactions']['🔥']}</span>
                <span style="background:#111; color:#D4AF37; padding:5px 10px; border-radius:20px; font-size:12px;">🍑 {hero['reactions']['🍑']}</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("### 📢 LATEST STORIES")
    c1, c2 = st.columns(2)
    for i, news in enumerate(st.session_state.news[1:]):
        with (c1 if i==0 else c2):
            st.markdown(f"""
            <div style="background:#111; padding:15px; border:1px solid #222; margin-bottom:10px;">
                <div style="color:#666; font-size:10px; font-weight:bold;">{news['tag']}</div>
                <div style="color:white; font-weight:bold; margin:5px 0;">{news['title']}</div>
                <div style="font-size:11px; color:#D4AF37;">🔥 {news['reactions']['🔥']} People reading this</div>
            </div>
            """, unsafe_allow_html=True)

# === TAB 2: ROSTER (Az Igazi Lista) ===
with tab_list:
    st.markdown("### 🇭🇺 HUNGARIAN ONLYFANS DATABASE")
    st.caption(f"Active Profiles: {len(st.session_state.roster)}")
    
    # Kereső
    search = st.text_input("Search Model...", placeholder="Name, Tag...")
    
    # Lista megjelenítése
    st.markdown('<div style="border-top: 1px solid #333;">', unsafe_allow_html=True)
    
    filtered = [m for m in st.session_state.roster if search.lower() in m['name'].lower()]
    
    for r in filtered:
        st.markdown(f"""
        <div class="roster-row">
            <div style="font-weight:bold; color:white;">
                <span style="color:#00ff00;">●</span> {r['name']}
            </div>
            <div style="color:#888; font-size:12px;">{r['cat'].upper()}</div>
            <a href="{r['link']}" target="_blank" style="color:#D4AF37; text-decoration:none; border:1px solid #D4AF37; padding:3px 10px; font-size:10px;">VIEW PROFILE</a>
        </div>
        """, unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Beküldő Gomb a Kanosoknak
    with st.expander("➕ Hiányzik valaki? Küldd be te!"):
        with st.form("submit_model"):
            st.text_input("Modell Neve")
            st.text_input("OnlyFans Link")
            st.form_submit_button("Beküldés (Anonim)")
            st.success("Köszönjük! Ellenőrzés után kikerül a listára.")

# === TAB 3: AGENCY (Az Üzlet) ===
with tab_agency:
    st.markdown("""
    <div class="agency-hero">
        <h1 style="color:white; font-size:3rem; margin-bottom:10px;">GLOBAL MANAGEMENT</h1>
        <p style="color:#ccc; letter-spacing:1px;">BUDAPEST • DUBAI • MIAMI</p>
    </div>
    """, unsafe_allow_html=True)
    
    # 3 FŐ ÉRV
    c1, c2, c3 = st.columns(3)
    with c1:
        st.markdown('<div class="feature-card"><h3>🎭 FACELESS CAREER</h3><p style="color:#aaa; font-size:13px;">Nem akarod megmutatni az arcod? Nem baj. A titokzatosság a legdrágább árucikk. A maszk legyen a védjegyed.</p></div>', unsafe_allow_html=True)
    with c2:
        st.markdown('<div class="feature-card"><h3>✈️ TRAVEL & LIFESTYLE</h3><p style="color:#aaa; font-size:13px;">Ingyenes utazások a céggel. Fotózások Dubajban, üzleti találkozók Londonban. Építs nemzetközi kapcsolatokat.</p></div>', unsafe_allow_html=True)
    with c3:
        st.markdown('<div class="feature-card"><h3>🐳 WHALE HUNTING</h3><p style="color:#aaa; font-size:13px;">Mi nem a magyar piacra lövünk. A "Bálnák" (gazdag külföldiek) fizetik a számláidat. Dollárban.</p></div>', unsafe_allow_html=True)

    # BEVÉTEL KALKULÁTOR
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("### 💰 MENNYIT KERESHETSZ VELÜNK?")
    
    followers = st.slider("Mennyi követőd van Instagramon/TikTokon?", 0, 100000, 5000)
    
    # Kamu de motiváló kalkuláció
    potential_usd = int((followers * 0.5) + 1500)
    potential_huf = potential_usd * 360
    
    st.markdown(f"""
    <div class="calc-box">
        <div style="color:#888; text-transform:uppercase;">Várható Havi Bevétel (Induláskor)</div>
        <div class="money-text">${potential_usd:,}</div>
        <div style="color:#D4AF37; font-size:1.2rem;">~ {potential_huf:,.0f} HUF</div>
        <p style="margin-top:20px; color:#666; font-size:12px;">*A Prime Global modelljeinek átlagos adatai alapján.</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    st.button("JELENTKEZÉS AUDITRA (INGYENES)", use_container_width=True)

# === TAB 4: ADMIN (Az Importáló) ===
with tab_admin:
    st.write("Admin Area")
    pwd = st.text_input("Jelszó", type="password")
    
    if pwd == "admin123":
        st.success("Belépve")
        
        st.subheader("📥 LISTA IMPORTÁLÁSA (CSV)")
        st.info("Töltsd fel a 'hunter.csv' fájlt, amit a robot generált.")
        
        uploaded_file = st.file_uploader("CSV Fájl kiválasztása", type=["csv"])
        
        if uploaded_file is not None:
            try:
                df = pd.read_csv(uploaded_file)
                # Adjuk hozzá a sessionhöz
                for index, row in df.iterrows():
                    st.session_state.roster.append({
                        "name": row['name'],
                        "cat": row['category'],
                        "link": row['link']
                    })
                st.success(f"Sikeresen importálva {len(df)} új modell!")
            except Exception as e:
                st.error(f"Hiba a beolvasáskor: {e}")
                
        if st.button("Lista törlése (Reset)"):
             st.session_state.roster = []
             st.warning("Lista törölve.")