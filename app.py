import streamlit as st
import random
import time

# --- 1. LUXUS KONFIGURÁCIÓ ---
st.set_page_config(
    page_title="PRIME GLOBAL | Elite Management",
    page_icon="👑",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- 2. ÁLLAPOTKEZELÉS (Nyelv & Adatok) ---

# Nyelv (Alap: Magyar)
if 'lang' not in st.session_state:
    st.session_state.lang = 'hu'

# Bannerek a Mozgó Szalaghoz (Infinity Marquee)
if 'marquee_images' not in st.session_state:
    # Ide sok képet tehetsz, ezek fognak úszni körbe-körbe
    st.session_state.marquee_images = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506956191951-7a88da4435e5?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506956191951-7a88da4435e5?w=300&h=300&fit=crop", # Duplikálva a hosszúság miatt
    ]

# Hírek
if 'news' not in st.session_state:
    st.session_state.news = [
        {"title_hu": "Kiszivárgott: Így buliznak a magyar modellek Miamiban", "title_en": "Leaked: How Hungarian models party in Miami", "img": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600", "reactions": {"🔥": 852, "🍑": 420}},
        {"title_hu": "Rekordbevétel: Ő az új magyar OnlyFans királynő?", "title_en": "Record Revenue: Is she the new Hungarian OF Queen?", "img": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600", "reactions": {"🔥": 1200, "🍑": 600}}
    ]

# --- 3. SZÖVEGEK (FORDÍTÁS) ---
TEXTS = {
    'hu': {
        'agency_title': "NEMZETKÖZI KARRIERÉPÍTÉS",
        'agency_sub': "A Prime Global nem csak egy ügynökség. Mi vagyunk a híd Budapest és Dubai között.",
        'stat1': "450% Átlagos Növekedés",
        'stat2': "120+ Nemzetközi Partner",
        'stat3': "$4.2M Kezelt Vagyon",
        'service1_t': "1. Content Architecture",
        'service1_d': "Személyre szabott tartalomstratégia. Profi stábbal készítjük el a fotóidat és videóidat, amik megfelelnek a nemzetközi trendeknek.",
        'service2_t': "2. Global Network",
        'service2_d': "Kiszabadítunk Magyarországról. Kapcsolataink révén eljuttatunk Miamiba, Dubajba és Londonba, ahol a 'Bálnák' (gazdag ügyfelek) vannak.",
        'service3_t': "3. 24/7 Chat Team",
        'service3_d': "Amíg te alszol, vagy utazol, a profi chat-csapatunk dollárokat termel neked. Pszichológiai alapú értékesítés.",
        'cta_btn': "JELENTKEZÉS AUDITRA",
        'news_header': "TRENDING & GOSSIP"
    },
    'en': {
        'agency_title': "GLOBAL CAREER MANAGEMENT",
        'agency_sub': "Prime Global is not just an agency. We are the bridge between Budapest and Dubai.",
        'stat1': "450% Avg. Growth",
        'stat2': "120+ Global Partners",
        'stat3': "$4.2M Assets Managed",
        'service1_t': "1. Content Architecture",
        'service1_d': "Personalized content strategy. We produce high-end photos and videos with pro crews that match global standards.",
        'service2_t': "2. Global Network",
        'service2_d': "We take you out of the local market. Our network gets you to Miami, Dubai, and London where the 'Whales' are.",
        'service3_t': "3. 24/7 Chat Team",
        'service3_d': "While you sleep or travel, our pro chat team generates dollars for you using psychological sales tactics.",
        'cta_btn': "APPLY FOR AUDIT",
        'news_header': "TRENDING & GOSSIP"
    }
}

# --- 4. CSS DESIGN (ANIMÁCIÓK & LUXUS) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;700&display=swap');
    
    /* ALAPOK */
    .stApp { background-color: #050505; color: #ffffff; font-family: 'Montserrat', sans-serif; }
    
    /* GOMBOK REJTÉSE (Header) */
    header {visibility: hidden;}
    
    /* ARANY GRADIENT SZÖVEG */
    .gold-text {
        background: linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
    }

    /* --- INFINITY MARQUEE (A MOZGÓ SZALAG) --- */
    .marquee-container {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        background: #000;
        padding: 20px 0;
        border-bottom: 2px solid #B38728;
        border-top: 2px solid #B38728;
        position: relative;
    }
    
    .marquee-content {
        display: inline-block;
        animation: scroll 20s linear infinite;
    }
    
    .marquee-item {
        display: inline-block;
        width: 150px; /* Kisebb rubrikák */
        height: 150px;
        margin-right: 15px;
        border-radius: 10px;
        border: 1px solid #333;
        background-size: cover;
        background-position: center;
        transition: transform 0.3s;
        cursor: pointer;
        position: relative;
    }
    
    .marquee-item:hover {
        transform: scale(1.1);
        border: 2px solid #D4AF37;
        z-index: 10;
    }

    @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
    }

    /* --- ÜGYNÖKSÉGI RÉSZ (STATISZTIKÁK) --- */
    .stat-box {
        background: rgba(255,255,255,0.05);
        border: 1px solid #333;
        padding: 20px;
        text-align: center;
        border-radius: 0px;
    }
    .stat-number { font-size: 1.5rem; color: #D4AF37; font-weight: bold; font-family: 'Cinzel', serif; }
    .stat-label { font-size: 0.8rem; color: #aaa; text-transform: uppercase; }

    /* --- HÍREK --- */
    .news-card {
        background: #111;
        border-left: 3px solid #D4AF37;
        margin-bottom: 20px;
        transition: all 0.3s;
    }
    .news-card:hover { background: #1a1a1a; }
    
    /* ZÁSZLÓ GOMBOK */
    .flag-btn {
        font-size: 24px; cursor: pointer; background: none; border: none; padding: 5px; opacity: 0.5; transition: 0.3s;
    }
    .flag-btn:hover { opacity: 1; transform: scale(1.2); }
    .flag-active { opacity: 1; transform: scale(1.1); border-bottom: 2px solid #D4AF37; }

    </style>
""", unsafe_allow_html=True)

# --- 5. FEJLÉC & NYELV ---

# Nyelvválasztó sáv (Custom HTML)
col_logo, col_lang = st.columns([4, 1])
with col_logo:
    st.markdown('<h1 style="font-family:Cinzel; font-size: 3rem; margin:0;">PRIME <span class="gold-text">GLOBAL</span></h1>', unsafe_allow_html=True)
with col_lang:
    # Egyszerű gombok a nyelvváltáshoz
    c1, c2 = st.columns(2)
    if c1.button("🇭🇺"): st.session_state.lang = 'hu'
    if c2.button("🇬🇧"): st.session_state.lang = 'en'

t = TEXTS[st.session_state.lang] # Az aktuális nyelv szövegei

st.markdown("---")

# --- 6. AZ INFINITY MARQUEE (MOZGÓ SZALAG) ---
# Ez a HTML/CSS trükk hozza létre a folyamatos mozgást
images_html = ""
for img in st.session_state.marquee_images:
    # Duplázzuk a listát a végtelen hatáshoz
    images_html += f'<div class="marquee-item" style="background-image: url({img});"><div style="position:absolute; bottom:0; background:rgba(0,0,0,0.7); width:100%; color:white; font-size:10px; text-align:center;">FEATURED</div></div>'
# Duplázás a loop miatt
images_html += images_html 

st.markdown(f"""
<div class="marquee-container">
    <div class="marquee-content">
        {images_html}
    </div>
</div>
""", unsafe_allow_html=True)

# --- 7. TARTALOM (HÍREK vs AGENCY) ---

tab_news, tab_agency, tab_admin = st.tabs(["🔥 " + t['news_header'], "💎 AGENCY / PARTNER", "🛠️ ADMIN"])

# === HÍREK TAB (KANOSOKNAK) ===
with tab_news:
    st.markdown("<br>", unsafe_allow_html=True)
    c1, c2 = st.columns(2)
    
    # Hírek megjelenítése
    for i, news in enumerate(st.session_state.news):
        title = news[f'title_{st.session_state.lang}'] # Nyelv szerinti cím
        with (c1 if i % 2 == 0 else c2):
            st.markdown(f"""
            <div class="news-card">
                <img src="{news['img']}" style="width:100%; height:200px; object-fit:cover; opacity:0.8;">
                <div style="padding:15px;">
                    <h3 style="color:white; margin:0; font-size:1.1rem; text-transform:uppercase;">{title}</h3>
                    <div style="margin-top:10px; display:flex; gap:10px;">
                        <span style="background:#222; padding:5px 10px; border-radius:20px; color:#D4AF37; font-size:12px;">🔥 {news['reactions']['🔥']}</span>
                        <span style="background:#222; padding:5px 10px; border-radius:20px; color:#D4AF37; font-size:12px;">🍑 {news['reactions']['🍑']}</span>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
    # Hirdetési hely (Placeholder)
    st.markdown('<div style="text-align:center; padding:20px; border:1px dashed #333; color:#555;">📢 GLOBAL AD SPACE (Google Ads)</div>', unsafe_allow_html=True)
    
    # A LISTA
    st.markdown("---")
    st.markdown(f"### 📋 OFFICIAL HUNGARIAN ROSTER")
    st.text("Loading 154 active profiles from database...")
    st.progress(100)
    # Ide jönne a statikus lista, amit az adminból töltesz fel


# === AGENCY TAB (LÁNYOKNAK - A PÉNZCSAP) ===
with tab_agency:
    # HERO SECTION
    st.markdown(f"""
    <div style="text-align:center; padding: 50px 20px; background: radial-gradient(circle, #222 0%, #000 100%); margin-bottom: 30px;">
        <h2 class="gold-text" style="font-size: 2.5rem; margin-bottom: 10px;">{t['agency_title']}</h2>
        <p style="font-size: 1.1rem; color: #ccc; max-width: 800px; margin: 0 auto;">{t['agency_sub']}</p>
    </div>
    """, unsafe_allow_html=True)

    # STATISZTIKÁK (KAMU DE HATÁSOS)
    k1, k2, k3 = st.columns(3)
    k1.markdown(f'<div class="stat-box"><div class="stat-number">450%</div><div class="stat-label">{t["stat1"]}</div></div>', unsafe_allow_html=True)
    k2.markdown(f'<div class="stat-box"><div class="stat-number">120+</div><div class="stat-label">{t["stat2"]}</div></div>', unsafe_allow_html=True)
    k3.markdown(f'<div class="stat-box"><div class="stat-number">$4.2M</div><div class="stat-label">{t["stat3"]}</div></div>', unsafe_allow_html=True)

    st.markdown("---")

    # SZOLGÁLTATÁSOK
    c1, c2, c3 = st.columns(3)
    with c1:
        st.markdown(f"#### 📷 {t['service1_t']}")
        st.write(t['service1_d'])
    with c2:
        st.markdown(f"#### ✈️ {t['service2_t']}")
        st.write(t['service2_d'])
    with c3:
        st.markdown(f"#### 💬 {t['service3_t']}")
        st.write(t['service3_d'])

    st.markdown("<br>", unsafe_allow_html=True)
    
    # CTA (Call to Action)
    st.markdown(f"""
    <div style="text-align:center;">
        <a href="#" style="background-color: #D4AF37; color: black; padding: 15px 40px; text-decoration: none; font-weight: bold; font-size: 1.2rem; border-radius: 50px; box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);">{t['cta_btn']}</a>
        <p style="margin-top:10px; font-size:0.8rem; color:#666;">*Kizárólag válogatott jelentkezőknek.</p>
    </div>
    """, unsafe_allow_html=True)

# === ADMIN TAB ===
with tab_admin:
    st.write("Admin Login")
    pw = st.text_input("Jelszó", type="password")
    if pw == "admin123":
        st.success("Belépve")
        st.write("**Mozgó Képek Kezelése**")
        new_img = st.text_input("Új Kép URL a szalaghoz")
        if st.button("Hozzáadás"):
            st.session_state.marquee_images.append(new_img)
            st.success("Hozzáadva a mozgó szalaghoz!")
            
        st.write("**Twitter Import (Szimuláció)**")
        if st.button("Twitter Aktív Lista Importálása (.csv)"):
            with st.spinner("Adatok feldolgozása..."):
                time.sleep(2)
                st.success("Sikeresen importálva 154 új profil a rendszerbe!")