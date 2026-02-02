import streamlit as st
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
if 'lang' not in st.session_state: st.session_state.lang = 'hu'

# Hírek (Képekkel, címkékkel)
if 'news' not in st.session_state:
    st.session_state.news = [
        {
            "id": 1,
            "title": "LEAKED: Magyar modellek privát bulija Miamiban",
            "subtitle": "Kiszivárgott videók a zártkörű partiról. Felismered őket?",
            "img": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
            "tag": "EXCLUSIVE",
            "reactions": 1240
        },
        {
            "id": 2,
            "title": "TOP 10: Ők keresték a legtöbbet januárban",
            "subtitle": "A lista első helyezettje sokkolta a közösséget.",
            "img": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
            "tag": "MONEY",
            "reactions": 850
        },
        {
            "id": 3,
            "title": "ÚJ TRÜKK: Így kerülik ki az OnlyFans tiltást",
            "subtitle": "Mindenki ezt a módszert használja most.",
            "img": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
            "tag": "TECH",
            "reactions": 560
        }
    ]

# Bannerek a mozgó szalaghoz (Marquee)
if 'marquee' not in st.session_state:
    st.session_state.marquee = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506956191951-7a88da4435e5?w=300&h=300&fit=crop"
    ] * 3 # Duplikáljuk, hogy hosszabb legyen

# --- 3. PROFI CSS DESIGN (A LÉNYEG) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600;800&display=swap');
    
    /* ALAPOK */
    .stApp { background-color: #050505; color: #ffffff; font-family: 'Inter', sans-serif; }
    
    /* BREAKING NEWS TICKER */
    .ticker-wrap {
        position: fixed; top: 0; left: 0; width: 100%; height: 30px; 
        background-color: #990000; z-index: 9999; overflow: hidden;
        display: flex; align-items: center; border-bottom: 1px solid #ff0000;
    }
    .ticker {
        display: inline-block; white-space: nowrap; padding-left: 100%;
        animation: ticker 30s linear infinite; color: white; font-weight: bold; font-size: 12px; text-transform: uppercase;
    }
    @keyframes ticker { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }

    /* HEADER STÍLUS */
    .header-container { text-align: center; margin-top: 40px; margin-bottom: 20px; }
    .gold-title {
        font-family: 'Cinzel', serif; font-size: 3.5rem; font-weight: 700;
        background: linear-gradient(to bottom, #cfc09f 22%,#634f2c 24%, #cfc09f 26%, #cfc09f 27%,#ffecb3 40%,#3a2c0f 78%); 
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        text-shadow: 0px 0px 10px rgba(212, 175, 55, 0.3);
    }
    .subtitle { color: #888; letter-spacing: 3px; font-size: 0.9rem; text-transform: uppercase; }

    /* MENÜ FÜLEK (Custom Tabs) */
    .stTabs [data-baseweb="tab-list"] { gap: 20px; justify-content: center; }
    .stTabs [data-baseweb="tab"] {
        background-color: transparent; border: 1px solid #333; color: #888; border-radius: 0px; padding: 10px 30px;
    }
    .stTabs [aria-selected="true"] {
        background-color: #D4AF37 !important; color: #000 !important; font-weight: bold; border: 1px solid #D4AF37;
    }

    /* MARQUEE (KÉPEK) */
    .marquee-container {
        overflow: hidden; white-space: nowrap; margin: 20px 0; border-top: 1px solid #333; border-bottom: 1px solid #333; background: #0a0a0a; padding: 10px 0;
    }
    .marquee-content { display: inline-block; animation: scroll 40s linear infinite; }
    .marquee-img {
        height: 120px; width: 120px; margin: 0 5px; border-radius: 5px; object-fit: cover; opacity: 0.7; transition: 0.3s; display: inline-block; border: 1px solid #222;
    }
    .marquee-img:hover { opacity: 1; transform: scale(1.1); border-color: #D4AF37; }
    @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

    /* MAGAZIN DESIGN (HÍREK) */
    .hero-card {
        position: relative; border-radius: 0px; overflow: hidden; height: 400px;
        background-size: cover; background-position: center; border: 1px solid #333;
    }
    .hero-overlay {
        position: absolute; bottom: 0; left: 0; width: 100%;
        background: linear-gradient(to top, #000 0%, transparent 100%);
        padding: 30px;
    }
    .news-tag { background: #D4AF37; color: black; padding: 3px 8px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
    .hero-title { font-size: 2rem; font-weight: 800; color: white; margin: 10px 0; line-height: 1.1; }
    
    .side-news-card {
        display: flex; gap: 15px; margin-bottom: 20px; padding: 10px; background: rgba(255,255,255,0.03); border: 1px solid #222;
    }
    .side-news-img { width: 100px; height: 80px; object-fit: cover; }
    .side-news-title { font-size: 1rem; font-weight: 600; color: #eee; line-height: 1.2; }

    /* AGENCY OLDAL */
    .agency-header { text-align: center; padding: 50px; background: radial-gradient(circle at center, #222 0%, #000 70%); border: 1px solid #222; margin-bottom: 30px; }
    .stat-card { background: #111; border-top: 3px solid #D4AF37; padding: 20px; text-align: center; }
    .stat-num { font-size: 2.5rem; font-weight: 900; color: white; }
    .stat-desc { color: #888; font-size: 0.8rem; text-transform: uppercase; }

    </style>
""", unsafe_allow_html=True)

# --- 4. KOMPONENSEK ---

def breaking_news():
    """A felső piros csík"""
    st.markdown("""
    <div class="ticker-wrap">
        <div class="ticker">
            BREAKING: KISZIVÁRGOTT VIDEÓK A BALATONRÓL +++ REKORD BEVÉTEL: KITTI ÁTLÉPTE A 10 MILLIÓT +++ ÚJ TAGOK A PRIME LISTÁN: ZSÓFI ÉS REBEKA +++ KERESD A VIP JELVÉNYT +++
        </div>
    </div>
    """, unsafe_allow_html=True)

def header():
    """Logo és Nyelvválasztó"""
    st.markdown("<br>", unsafe_allow_html=True) # Hely a ticker miatt
    c1, c2, c3 = st.columns([1, 4, 1])
    with c2:
        st.markdown("""
        <div class="header-container">
            <div class="gold-title">PRIME GLOBAL</div>
            <div class="subtitle">PREMIUM MANAGEMENT & NEWS</div>
        </div>
        """, unsafe_allow_html=True)
    with c3:
        # Nyelvváltó gombok (csak design)
        st.markdown('<div style="text-align:right; padding-top:40px;"><span style="cursor:pointer; opacity:1;">🇭🇺</span> <span style="cursor:pointer; opacity:0.5;">🇬🇧</span></div>', unsafe_allow_html=True)

def marquee():
    """A mozgó képes szalag"""
    images_html = "".join([f'<img src="{img}" class="marquee-img">' for img in st.session_state.marquee])
    st.markdown(f"""
    <div class="marquee-container">
        <div class="marquee-content">{images_html}</div>
    </div>
    """, unsafe_allow_html=True)

# --- 5. TABS & OLDALAK ---

breaking_news()
header()

# Menürendszer (Ez a standard Streamlit tab, de átstilizáltuk CSS-el)
tab_portal, tab_agency, tab_admin = st.tabs(["MAGAZINE (HÍREK)", "AGENCY (PARTNER)", "ADMIN"])

# === 1. MAGAZIN OLDAL (Designos Hírek) ===
with tab_portal:
    marquee() # A mozgó szalag itt van
    
    st.markdown("### 🔥 TRENDING NOW")
    
    # MAGAZINE LAYOUT (Bento Box)
    # Balra a nagy cikk, Jobbra a kicsik
    col_hero, col_side = st.columns([2, 1])
    
    main_story = st.session_state.news[0]
    side_stories = st.session_state.news[1:]
    
    with col_hero:
        # A Nagy Cikk
        st.markdown(f"""
        <div class="hero-card" style="background-image: url('{main_story['img']}');">
            <div class="hero-overlay">
                <span class="news-tag">{main_story['tag']}</span>
                <div class="hero-title">{main_story['title']}</div>
                <p style="color:#ddd;">{main_story['subtitle']}</p>
                <button style="background:#D4AF37; border:none; padding:10px 20px; font-weight:bold; cursor:pointer;">OLVASÁS ➜</button>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
    with col_side:
        # Oldalsó Hírek
        for story in side_stories:
            st.markdown(f"""
            <div class="side-news-card">
                <img src="{story['img']}" class="side-news-img">
                <div>
                    <span style="color:#D4AF37; font-size:10px; font-weight:bold;">{story['tag']}</span>
                    <div class="side-news-title">{story['title']}</div>
                    <div style="font-size:10px; color:#666; margin-top:5px;">🔥 {story['reactions']} Reakció</div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
    # HIRDETÉS HELYE
    st.markdown("---")
    st.markdown('<div style="background:#111; color:#444; text-align:center; padding:30px; border:1px dashed #333;">📢 GOOGLE ADS SPACE</div>', unsafe_allow_html=True)

    # LISTA
    st.markdown("### 📋 HIVATALOS LISTA (ROSTER)")
    st.info("A Prime Hungary ellenőrzött partnerei.")
    # Ide jönne a lista, amit már megírtunk, csak most egyszerűsítve a design kedvéért:
    st.markdown("""
    <div style="column-count: 2; column-gap: 40px; color: #ccc;">
        <p>➤ Kitti_Official <span style="color:gold;">★</span></p>
        <p>➤ Szandra_Queen</p>
        <p>➤ Niki_Milf</p>
        <p>➤ Rebeka_Wild</p>
        <p>➤ Vivi_X</p>
        <p>➤ Dorina_B</p>
        <p>➤ Zsófi_Life</p>
        <p>➤ Petra_Fit</p>
    </div>
    """, unsafe_allow_html=True)


# === 2. AGENCY OLDAL (Pénzcsináló) ===
with tab_agency:
    st.markdown("""
    <div class="agency-header">
        <h1 style="color:#D4AF37; font-family:Cinzel;">PRIME MANAGEMENT</h1>
        <p style="font-size:1.2rem; color:white;">WE BUILD EMPIRES. NOT JUST PROFILES.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # KAMU STATISZTIKÁK (ANIMÁLT HATÁSÚ SZÁMOK)
    c1, c2, c3 = st.columns(3)
    c1.markdown('<div class="stat-card"><div class="stat-num">$4.2M</div><div class="stat-desc">Generált Bevétel</div></div>', unsafe_allow_html=True)
    c2.markdown('<div class="stat-card"><div class="stat-num">120+</div><div class="stat-desc">Aktív Partner</div></div>', unsafe_allow_html=True)
    c3.markdown('<div class="stat-card"><div class="stat-num">24/7</div><div class="stat-desc">Chat Support</div></div>', unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # MARKETING COPY
    col_text, col_form = st.columns([1, 1])
    
    with col_text:
        st.markdown("### 💎 MIÉRT A PRIME?")
        st.markdown("""
        Az OnlyFans piac 90%-a telített. Ha egyedül csinálod, láthatatlan vagy.
        
        **Amit mi nyújtunk:**
        * **Global Reach:** Kijuttatunk a nemzetközi piacra (USA, UAE).
        * **AI Chatbot:** A rendszerünk beszélget helyetted. Te alszol, a pénz jön.
        * **Content Strategy:** Profi stáb, videós forgatókönyvek.
        * **Legal Shield:** Jogi védelem és anonimitás.
        """)
    
    with col_form:
        st.markdown('<div style="background:#111; padding:20px; border:1px solid #333;">', unsafe_allow_html=True)
        st.markdown("### 🚀 JELENTKEZÉS AUDITRA")
        st.text_input("Instagram / OF Link")
        st.selectbox("Jelenlegi Bevétel", ["Még nincs", "0 - $1000", "$1000 - $5000", "$5000+"])
        st.button("JELENTKEZÉS KÜLDÉSE (INGYENES)", type="primary")
        st.markdown('</div>', unsafe_allow_html=True)


# === 3. ADMIN OLDAL ===
with tab_admin:
    pw = st.text_input("Jelszó", type="password")
    if pw == "admin123":
        st.success("Belépve")
        st.write("Itt tudod szerkeszteni a híreket és a listát.")
        # Admin funkciók (ugyanaz mint eddig)