import streamlit as st
import pandas as pd
import time

# --- 1. KONFIGURÁCIÓ ---
st.set_page_config(
    page_title="Velvet Blue Management",
    page_icon="💎",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- 2. ADATBÁZIS (Szimulált) ---
# Ezt később az Admin panelen keresztül bővíted
if 'models' not in st.session_state:
    st.session_state.models = [
        {"id": 1, "name": "Kitti", "age": 22, "category": "Elite", "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80", "vip": True, "desc": "Az ország leggyorsabban növekvő profilja.", "link": "#"},
        {"id": 2, "name": "Szandra", "age": 20, "category": "New Face", "image": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80", "vip": False, "desc": "Kreatív tartalmak, napi frissítéssel.", "link": "#"},
        {"id": 3, "name": "Niki", "age": 28, "category": "Exclusive", "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80", "vip": True, "desc": "Csak komoly érdeklődőknek.", "link": "#"},
        {"id": 4, "name": "Rebeka", "age": 24, "category": "Wild", "image": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80", "vip": False, "desc": "Vadóc stílus, tetovált.", "link": "#"},
    ]

# --- 3. PROFI CSS DESIGN ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

    html, body, [class*="css"] { font-family: 'Poppins', sans-serif; }
    .stApp { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; }

    /* MENÜ STÍLUS */
    section[data-testid="stSidebar"] {
        background-color: #0f172a;
        border-right: 1px solid #334155;
    }

    /* HEADER */
    .hero-title {
        font-size: 3rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;
        background: -webkit-linear-gradient(0deg, #ffffff, #00AFF0);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        margin-bottom: 0;
    }
    .hero-sub { color: #94a3b8; font-size: 1.1rem; margin-bottom: 30px; }

    /* MODEL KÁRTYÁK */
    .model-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px; overflow: hidden; margin-bottom: 20px;
        transition: transform 0.3s;
    }
    .model-card:hover { transform: translateY(-5px); }
    
    /* VIP KIEMELÉS (EZÉRT FIZETNEK) */
    .vip-border { border: 2px solid #ffd700 !important; box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); }
    .vip-badge { background: #ffd700; color: #000; font-weight: bold; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 10px; }

    /* ÁRLISTA KÁRTYÁK (Pricing Table) */
    .pricing-card {
        background: #1e293b; border: 1px solid #334155; border-radius: 15px; padding: 30px; text-align: center;
    }
    .pricing-price { font-size: 2.5rem; color: #00AFF0; font-weight: bold; }
    .pricing-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 10px; }
    
    /* GOMBOK */
    .stButton > button {
        background-color: #00AFF0; color: white; border-radius: 50px; border: none; font-weight: 600; width: 100%;
    }
    .stButton > button:hover { background-color: #0084b4; }
    </style>
""", unsafe_allow_html=True)

# --- 4. OLDALAK ---

def show_home():
    """Főoldal - A Kirakat"""
    st.markdown('<div class="hero-title">Velvet Blue</div>', unsafe_allow_html=True)
    st.markdown('<div class="hero-sub">Magyarország Prémium OnlyFans Ügynöksége</div>', unsafe_allow_html=True)

    # Statisztika (Kamu, de jól néz ki - Social Proof)
    c1, c2, c3 = st.columns(3)
    c1.metric("Aktív Modellek", "124", "+12 a héten")
    c2.metric("Látogatók / hó", "85.4K", "↗ 15%")
    c3.metric("Kifizetett Jutalék", "€ 12.5K", "múlt hónap")

    st.markdown("---")
    st.subheader("🔥 Heti Top Kiemeltek")
    st.info("Ezek a modellek a 'VIP' csomagot fizették elő.")
    
    # Csak a VIP modelleket mutatjuk itt
    vips = [m for m in st.session_state.models if m['vip']]
    cols = st.columns(len(vips) if vips else 1)
    
    for idx, model in enumerate(vips):
        with cols[idx]:
            st.markdown(f"""
            <div class="model-card vip-border">
                <img src="{model['image']}" style="width:100%; height:250px; object-fit:cover;">
                <div style="padding:15px;">
                    <h3>{model['name']} <span class="vip-badge">VIP</span></h3>
                    <p style="color:#aaa; font-size:14px;">{model['desc']}</p>
                </div>
            </div>
            """, unsafe_allow_html=True)
            st.button(f"Profil: {model['name']}", key=f"home_{model['id']}")

def show_directory():
    """Kereső - A teljes adatbázis"""
    st.markdown("## 🔎 Modell Kereső")
    
    # Szűrők
    col1, col2 = st.columns([3, 1])
    with col1:
        search = st.text_input("Keresés név vagy stílus alapján...", placeholder="Pl. Szőke, Tetovált...")
    with col2:
        category = st.selectbox("Kategória", ["Összes", "Elite", "New Face", "MILF", "Wild"])

    # Szűrés logika
    filtered = st.session_state.models
    if category != "Összes":
        filtered = [m for m in filtered if m['category'] == category]
    if search:
        filtered = [m for m in filtered if search.lower() in m['name'].lower() or search.lower() in m['desc'].lower()]

    # Rács megjelenítése
    st.markdown("<br>", unsafe_allow_html=True)
    grid_cols = st.columns(3)
    
    for i, model in enumerate(filtered):
        with grid_cols[i % 3]:
            # VIP-eknek arany keret, többieknek sima
            border_class = "vip-border" if model['vip'] else ""
            badge = '<span class="vip-badge">VIP</span>' if model['vip'] else ""
            
            st.markdown(f"""
            <div class="model-card {border_class}">
                <img src="{model['image']}" style="width:100%; height:200px; object-fit:cover; opacity:0.9;">
                <div style="padding:15px;">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:#00AFF0; font-weight:bold; font-size:12px;">{model['category'].upper()}</span>
                        {badge}
                    </div>
                    <h3 style="margin:5px 0;">{model['name']}</h3>
                    <p style="color:#888; font-size:13px;">{model['age']} éves • {model['desc']}</p>
                </div>
            </div>
            """, unsafe_allow_html=True)
            st.button(f"Megnézem {model['name']}-t", key=f"dir_{model['id']}")

def show_services():
    """💰 A PÉNZTERMElŐ OLDAL - Itt adod el a szolgáltatást"""
    st.markdown('<div class="hero-title" style="font-size:2.5rem;">Dolgozz Velünk</div>', unsafe_allow_html=True)
    st.markdown('<div class="hero-sub">Növeld az OnlyFans bevételedet profi menedzsmenttel.</div>', unsafe_allow_html=True)

    c1, c2, c3 = st.columns(3)
    
    with c1:
        st.markdown("""
        <div class="pricing-card">
            <div class="pricing-title">BASIC LISTA</div>
            <div class="pricing-price">Ingyenes</div>
            <p>Kerülj be az adatbázisba.</p>
            <hr style="border-color:#333;">
            <ul style="text-align:left; color:#ccc;">
                <li>✅ Megjelenés a keresőben</li>
                <li>✅ Profilkép + Link</li>
                <li>❌ Nincs kiemelés</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
        st.button("Jelentkezés (Basic)", key="p1")

    with c2:
        st.markdown("""
        <div class="pricing-card" style="border: 2px solid #00AFF0; box-shadow: 0 0 20px rgba(0,175,240,0.2);">
            <div style="background:#00AFF0; color:white; border-radius:4px; display:inline-block; padding:2px 10px; font-size:12px; margin-bottom:10px;">LEGJOBB VÁLASZTÁS</div>
            <div class="pricing-title">VIP PRO</div>
            <div class="pricing-price">19.990 Ft</div>
            <p>havonta</p>
            <hr style="border-color:#333;">
            <ul style="text-align:left; color:#ccc;">
                <li>✅ <b>Kiemelés a Főoldalon</b></li>
                <li>✅ <b>Arany keret</b> a keresőben</li>
                <li>✅ "Hét lánya" interjú lehetőség</li>
                <li>✅ Direkt WhatsApp gomb</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
        st.button("Kiválasztom a VIP-t", key="p2")

    with c3:
        st.markdown("""
        <div class="pricing-card">
            <div class="pricing-title">AGENCY FULL</div>
            <div class="pricing-price">% Jutalék</div>
            <p>egyéni megállapodás</p>
            <hr style="border-color:#333;">
            <ul style="text-align:left; color:#ccc;">
                <li>✅ Teljes profil kezelés</li>
                <li>✅ Chat management (24/7)</li>
                <li>✅ Profi fotózás szervezés</li>
                <li>✅ Jogi tanácsadás</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
        st.button("Kapcsolatfelvétel", key="p3")

def show_news():
    st.markdown("## 📰 Hírek & Pletykák")
    st.warning("A híreket az AI generálja a Twitter trendek alapján. (Adminban frissíthető)")
    
    st.markdown("""
    > **BOTRÁNY:** Kiszivárgott, hogy melyik magyar top modell keresett 15 milliót múlt hónapban. [Tovább a cikkre...](#)
    
    > **ÚJDONSÁG:** A Velvet Blue elindította az új "Chatter Képzését". Jelentkezz te is!
    """)

def show_admin():
    st.markdown("## 🔒 Admin Irányítópult")
    st.info("Itt tudod hozzáadni az új lányokat, akiket a robot megtalált, vagy akik fizettek.")
    
    with st.form("new_model"):
        st.write("Új Modell Hozzáadása")
        name = st.text_input("Név")
        cat = st.selectbox("Kategória", ["Elite", "New Face", "MILF"])
        is_vip = st.checkbox("Fizetett VIP tagságot?")
        submitted = st.form_submit_button("Hozzáadás")
        if submitted:
            st.success(f"{name} hozzáadva az adatbázishoz! (VIP: {is_vip})")

# --- 5. FŐ NAVIGÁCIÓ (SIDEBAR) ---

with st.sidebar:
    st.markdown('<h2 style="color:#00AFF0; text-align:center;">VELVET BLUE</h2>', unsafe_allow_html=True)
    st.markdown("---")
    
    menu = st.radio(
        "MENÜ", 
        ["Főoldal", "Modell Kereső", "Szolgáltatások (Árak)", "Hírek", "Admin"],
        label_visibility="collapsed"
    )
    
    st.markdown("---")
    st.info("💡 **TIPP:** A 'Szolgáltatások' menüpontban vannak az árak, amiket a modelleknek küldesz el.")

# Oldal váltó logika
if menu == "Főoldal":
    show_home()
elif menu == "Modell Kereső":
    show_directory()
elif menu == "Szolgáltatások (Árak)":
    show_services()
elif menu == "Hírek":
    show_news()
elif menu == "Admin":
    # Jelszó védelem (egyszerű)
    pwd = st.text_input("Jelszó", type="password")
    if pwd == "admin123":
        show_admin()