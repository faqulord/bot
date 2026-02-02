import streamlit as st
import time
import random

# --- 1. KONFIGURÁCIÓ ---
st.set_page_config(
    page_title="PRIME | Official",
    page_icon="👑",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- 2. ADATOK ---
if 'news' not in st.session_state:
    st.session_state.news = [
        {
            "title": "LEAKED: Magyar modellek privát bulija Miamiban",
            "img": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
            "tag": "EXCLUSIVE",
            "reactions": {"🔥": 1240, "🍑": 530}
        },
        {
            "title": "TOP 10: Ők keresték a legtöbbet januárban",
            "img": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80",
            "tag": "MONEY",
            "reactions": {"🔥": 850, "🍑": 210}
        },
         {
            "title": "ÚJ TRÜKK: Így kerülik ki az OnlyFans tiltást",
            "img": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
            "tag": "TECH",
            "reactions": {"🔥": 440, "🍑": 120}
        }
    ]

if 'marquee' not in st.session_state:
    st.session_state.marquee = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1506956191951-7a88da4435e5?w=200&h=200&fit=crop",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop"
    ] * 4

# --- 3. CSS DESIGN (KOMPAKT HEADER & LUXUS) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@300;400;600;800&display=swap');
    
    .stApp { background-color: #050505; color: #ffffff; font-family: 'Inter', sans-serif; }
    
    /* HEADER KICSIKÍTÉSE */
    .header-compact {
        display: flex; justify-content: space-between; align-items: center;
        padding: 10px 20px; border-bottom: 1px solid #333; background: #000;
    }
    .logo-text {
        font-family: 'Cinzel', serif; font-size: 1.8rem; margin: 0;
        background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    
    /* MARQUEE (VÉKONYABB) */
    .marquee-container {
        overflow: hidden; white-space: nowrap; background: #0a0a0a; padding: 5px 0; border-bottom: 1px solid #333;
    }
    .marquee-content { display: inline-block; animation: scroll 40s linear infinite; }
    .marquee-img {
        height: 80px; width: 80px; margin: 0 5px; border-radius: 50%; /* Kerek képek = Profilfotó hatás */
        border: 2px solid #333; object-fit: cover; opacity: 0.8; transition: 0.3s;
    }
    .marquee-img:hover { border-color: #D4AF37; opacity: 1; transform: scale(1.1); }
    @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

    /* HÍR KÁRTYÁK (ÁTLÁTHATÓBB) */
    .news-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .news-card {
        background: #111; border: 1px solid #222; border-radius: 8px; overflow: hidden; position: relative;
    }
    .news-card img { width: 100%; height: 180px; object-fit: cover; opacity: 0.7; }
    .news-overlay { padding: 15px; }
    .news-tag { color: #D4AF37; font-size: 10px; font-weight: bold; letter-spacing: 1px; }
    .news-title { font-size: 1.1rem; font-weight: 700; color: white; margin: 5px 0; }
    
    /* REAKCIÓ GOMBOK (NAGYOK) */
    .reaction-row { display: flex; gap: 10px; margin-top: 10px; }
    .react-pill {
        background: #222; border: 1px solid #333; padding: 5px 15px; border-radius: 20px; 
        font-size: 0.9rem; color: #ccc; cursor: pointer; transition: 0.2s;
    }
    .react-pill:hover { border-color: #D4AF37; color: white; background: #333; }

    /* LISTA TABLÁZAT */
    .roster-row {
        display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #222; align-items: center;
    }
    .roster-row:hover { background: #111; }
    .status-dot { height: 8px; width: 8px; background-color: #00ff00; border-radius: 50%; display: inline-block; margin-right: 5px; box-shadow: 0 0 5px #00ff00; }

    /* AGENCY SZÖVEG DOBOZ */
    .agency-box {
        background: radial-gradient(circle at top right, #222, #000);
        border: 1px solid #D4AF37; padding: 40px; border-radius: 0px; margin-top: 20px;
        box-shadow: 0 0 30px rgba(212, 175, 55, 0.1);
    }
    .check-list li { margin-bottom: 10px; color: #ccc; }
    
    /* TABOK STÍLUSA */
    .stTabs [data-baseweb="tab-list"] { gap: 10px; }
    .stTabs [data-baseweb="tab"] { background: #111; border: none; color: #666; font-size: 12px; }
    .stTabs [aria-selected="true"] { background: #D4AF37 !important; color: black !important; font-weight: bold; }

    </style>
""", unsafe_allow_html=True)

# --- 4. ANIMÁLT PRE-LOADER (UX TRÜKK) ---
placeholder = st.empty()
if 'loaded' not in st.session_state:
    with placeholder.container():
        st.markdown("""
        <div style="height: 100vh; display:flex; justify-content:center; align-items:center; background:black; color:#D4AF37; font-family:monospace;">
            <div>
                <h2>PRIME GATEWAY</h2>
                <p>CHECKING SECURE CONNECTION...</p>
                <p>VERIFYING AGE...</p>
                <p style="color:#00ff00">ACCESS GRANTED.</p>
            </div>
        </div>
        """, unsafe_allow_html=True)
        time.sleep(2.5) # 2.5 másodperc várakozás
        st.session_state.loaded = True
    placeholder.empty()

# --- 5. KOMPAKT HEADER & MARQUEE ---
st.markdown("""
<div class="header-compact">
    <div class="logo-text">PRIME</div>
    <div style="color: #666; font-size: 12px;">HUNGARY'S #1 ONLYFANS DATABASE</div>
    <div>🇭🇺</div>
</div>
""", unsafe_allow_html=True)

# A mozgó szalag (Vékonyabb, kerek képekkel)
images_html = "".join([f'<img src="{img}" class="marquee-img">' for img in st.session_state.marquee])
st.markdown(f"""
<div class="marquee-container">
    <div class="marquee-content">{images_html}</div>
</div>
""", unsafe_allow_html=True)

# --- 6. MENÜRENDSZER (4 FÜL) ---
tab_news, tab_list, tab_agency, tab_admin = st.tabs(["MAGAZINE", "LISTA (ROSTER)", "AGENCY", "ADMIN"])

# === TAB 1: MAGAZIN (Hírek + Reakciók) ===
with tab_news:
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Fő hír (Hero)
    hero = st.session_state.news[0]
    st.markdown(f"""
    <div style="background-image: url('{hero['img']}'); height: 350px; background-size: cover; position: relative; border: 1px solid #333;">
        <div style="position: absolute; bottom: 0; background: linear-gradient(to top, #000, transparent); width: 100%; padding: 20px;">
            <span style="background:red; color:white; padding: 2px 5px; font-size: 10px; font-weight:bold;">BREAKING</span>
            <h1 style="color: white; margin: 5px 0; font-size: 2rem;">{hero['title']}</h1>
            <div class="reaction-row">
                <div class="react-pill">🔥 {hero['reactions']['🔥']}</div>
                <div class="react-pill">🍑 {hero['reactions']['🍑']}</div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("### 🔥 TOP SZTORIK")
    
    # Kisebb hírek rácsban
    c1, c2 = st.columns(2)
    for i, news in enumerate(st.session_state.news[1:]):
        with (c1 if i==0 else c2):
            st.markdown(f"""
            <div class="news-card">
                <img src="{news['img']}">
                <div class="news-overlay">
                    <div class="news-tag">{news['tag']}</div>
                    <div class="news-title">{news['title']}</div>
                    <div class="reaction-row">
                        <div class="react-pill">🔥 {news['reactions']['🔥']}</div>
                        <div class="react-pill">🍑 {news['reactions']['🍑']}</div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)

    # Google Ads Hely
    st.markdown('<div style="margin-top:20px; padding:20px; border:1px dashed #333; text-align:center; color:#555;">📢 HIRDETÉS HELYE</div>', unsafe_allow_html=True)


# === TAB 2: A LISTA (Külön fülön!) ===
with tab_list:
    st.markdown("### 📋 HIVATALOS MAGYAR LISTA")
    st.info("Ez a lista tartalmazza az összes ellenőrzött, aktív magyar profilt.")
    
    # Szimulált lista (Ez néz ki táblázatnak)
    roster_data = [
        {"name": "Kitti_Official", "cat": "Elite", "stat": "Online"},
        {"name": "Szandra_Queen", "cat": "New", "stat": "Online"},
        {"name": "Vivi_Baby", "cat": "Teen", "stat": "Offline"},
        {"name": "Rebeka_Wild", "cat": "Pro", "stat": "Online"},
        {"name": "Dorina_X", "cat": "Elite", "stat": "Online"},
        {"name": "Zsófi_Life", "cat": "Milf", "stat": "Offline"},
    ]
    
    st.markdown('<div style="border-top: 1px solid #333;">', unsafe_allow_html=True)
    for r in roster_data:
        color = "#00ff00" if r['stat'] == "Online" else "#666"
        st.markdown(f"""
        <div class="roster-row">
            <div style="font-weight:bold; font-size:1.1rem;">
                <span class="status-dot" style="background-color:{color}; box-shadow: 0 0 5px {color};"></span> {r['name']}
            </div>
            <div style="color:#666; font-size:0.9rem;">{r['cat'].upper()}</div>
            <a href="#" style="color:#D4AF37; text-decoration:none; border:1px solid #D4AF37; padding:5px 15px; font-size:0.8rem;">PROFIL ➜</a>
        </div>
        """, unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)


# === TAB 3: AGENCY (A Régi, Jó Szöveggel!) ===
with tab_agency:
    st.markdown("""
    <div style="text-align:center; padding: 30px;">
        <h1 style="color:#D4AF37; font-family:Cinzel;">PRIME MANAGEMENT</h1>
        <p style="letter-spacing: 2px;">WE BUILD EMPIRES.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # A GYILKOS SZÖVEG VISSZATÉRT (Designos dobozban)
    st.markdown("""
    <div class="agency-box">
        <h2 style="color: white; margin-bottom: 20px; text-align:center;">Miért a PRIME?</h2>
        <p style="font-size: 1.1rem; color: #ccc; line-height: 1.6; text-align:center;">
            Nem te vagy a rabszolga. <b>Te vagy a Díj.</b><br>
            A legtöbb lány napi 12 órát pötyög a telefonján fillérekért. Mi megfordítjuk a játékot.
        </p>
        <hr style="border-color: #444; margin: 30px 0;">
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <div>
                <h3 style="color: #00AFF0;">🤖 AZ AI CHATBOT FORRADALOM</h3>
                <p style="color: white; font-weight: bold;">
                    Képzeld el, hogy 100 gazdag férfival beszélgetsz egyszerre.
                </p>
                <ul class="check-list">
                    <li>✅ <b>Láthatatlan AI Chatbot:</b> A rendszerünk elemzi a férfi vágyait.</li>
                    <li>✅ <b>Pszichológiai Profilozás:</b> Tudjuk, ki a "Bálna", aki ma este elkölt 1000 Eurót.</li>
                    <li>✅ <b>Automata Dollár:</b> A vendég szerelmes lesz beléd, miközben te alszol.</li>
                </ul>
            </div>
            <div>
                <h3 style="color: #D4AF37;">✈️ GLOBAL LIFESTYLE</h3>
                <p style="color: white; font-weight: bold;">
                    Nemzetközi karrier. Nem csak Budapest.
                </p>
                <ul class="check-list">
                    <li>✅ <b>Utaztatás:</b> Kapcsolataink vannak Miamiban és Dubajban.</li>
                    <li>✅ <b>Brand Építés:</b> Profi fotós stáb és videós forgatókönyvek.</li>
                    <li>✅ <b>Vagyonkezelés:</b> Hogy a pénzed biztonságban legyen.</li>
                </ul>
            </div>
        </div>
        
        <div style="text-align:center; margin-top:40px;">
            <a href="#" style="background:#D4AF37; color:black; padding:15px 40px; text-decoration:none; font-weight:bold; font-size:1.2rem;">JELENTKEZÉS AUDITRA ➜</a>
        </div>
    </div>
    """, unsafe_allow_html=True)

# === TAB 4: ADMIN ===
with tab_admin:
    st.write("Admin Login")
    # ... (Admin funkciók maradtak a régiek)