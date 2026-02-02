import streamlit as st
import random
import time
from datetime import datetime

# --- 1. KONFIGURÁCIÓ & DESIGN ---
st.set_page_config(
    page_title="Velvet Blue - Hungary",
    page_icon="🔥",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- 2. ADATBÁZIS (SESSION STATE) ---
if 'models' not in st.session_state:
    st.session_state.models = [
        {
            "id": 1, 
            "name": "Kitti", 
            "category": "Elite", 
            "tags": ["szőke", "vékony", "tetovált", "kicsi mell"],
            "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80", 
            "vip": True, 
            "boost": 10, 
            "desc": "Az ország leggyorsabban növekvő profilja.", 
            "link": "#"
        },
        {
            "id": 2, 
            "name": "Szandra", 
            "category": "New Face", 
            "tags": ["barna", "gömbölyű", "szemüveges", "egyetemista"],
            "image": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80", 
            "vip": False, 
            "boost": 5, 
            "desc": "Kreatív tartalmak, napi frissítéssel.", 
            "link": "#"
        },
        {
            "id": 3, 
            "name": "Niki", 
            "category": "MILF", 
            "tags": ["szőke", "érett", "nagy mell", "anyuka"],
            "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80", 
            "vip": True, 
            "boost": 8, 
            "desc": "Tapasztalt és exkluzív.", 
            "link": "#"
        }
    ]

if 'news' not in st.session_state:
    st.session_state.news = [
        {"title": "LEBUKOTT: Kiszivárgott videó a Balaton Soundról?", "body": "Egy ismert magyar modell videója terjed a Redditen. A felvételeken állítólag...", "reactions": {"fire": 424, "peach": 189}, "date": "Ma, 10:23"},
        {"title": "Mennyit keres valójában egy top OnlyFans modell itthon?", "body": "Exkluzív interjú Kittivel, aki megmutatta a bankszámláját. A számok sokkolóak.", "reactions": {"fire": 850, "peach": 310}, "date": "Tegnap"}
    ]

# --- 3. CSS DESIGN (KANOS STYLE) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');
    html, body, [class*="css"] { font-family: 'Poppins', sans-serif; }
    .stApp { background-color: #0e1117; color: #ffffff; }

    /* CÍMSOROK */
    .neon-text {
        color: #00AFF0;
        font-weight: 900; text-transform: uppercase; letter-spacing: 1px;
        text-shadow: 0 0 10px rgba(0,175,240,0.5);
    }
    
    /* MODELL KÁRTYA (Kisebb, kompaktabb) */
    .model-card {
        background: #1c1c1c; border: 1px solid #333;
        border-radius: 10px; overflow: hidden; margin-bottom: 10px; position: relative;
    }
    .vip-border { border: 2px solid #ffd700 !important; }
    
    /* HÍR KÁRTYA (Nagyobb, figyelemfelkeltő) */
    .news-card {
        background: #262730; border-left: 5px solid #ff4b4b;
        padding: 20px; border-radius: 5px; margin-bottom: 20px;
    }
    .news-title { font-size: 1.5rem; font-weight: bold; color: white; margin-bottom: 5px; }
    .news-meta { font-size: 0.8rem; color: #888; }
    
    /* REAKCIÓK */
    .reaction-btn { background: #333; padding: 5px 15px; border-radius: 20px; font-size: 14px; margin-right: 10px; }

    /* MARKETING SZÖVEG DOBOZ */
    .marketing-box {
        background: linear-gradient(45deg, #1e1e1e, #2d2d2d);
        border: 2px solid #00AFF0;
        border-radius: 15px;
        padding: 40px;
        text-align: center;
        margin-bottom: 30px;
        box-shadow: 0 0 30px rgba(0,175,240,0.2);
    }
    </style>
""", unsafe_allow_html=True)

# --- 4. FÜGGVÉNYEK ---

def show_fake_notification():
    """Kamu értesítés, hogy pörögjön az oldal"""
    notifs = [
        "🔥 Gábor (Budapest) épp feliratkozott Kitti oldalára!",
        "💎 Tamás (Debrecen) VIP tagságot vásárolt!",
        "👀 450 ember nézi jelenleg ezt az oldalt."
    ]
    st.toast(random.choice(notifs), icon="🔥")

# --- 5. OLDALAK ---

def show_home():
    show_fake_notification()
    
    # KÉT OSZLOP: Balra a Hírek (Nagy), Jobbra a Trending (Kicsi)
    col_news, col_trend = st.columns([2, 1])
    
    with col_news:
        st.markdown("# 📢 FRISS PLETYKÁK & LEAKEK")
        st.markdown("*A magyar OnlyFans közösség titkai.*")
        
        # Google Ads helye a hírek felett
        st.markdown('<div style="background:#222; padding:20px; text-align:center; color:#555; border:1px dashed #444;">📢 GOOGLE ADS HELYE</div>', unsafe_allow_html=True)
        
        for news in st.session_state.news:
            st.markdown(f"""
            <div class="news-card">
                <div class="news-title">{news['title']}</div>
                <div class="news-meta">{news['date']} • 👁️ {random.randint(1000, 5000)} megtekintés</div>
                <p style="color:#ddd; margin-top:10px;">{news['body']}</p>
                <div style="margin-top:15px;">
                    <span class="reaction-btn">🔥 {news['reactions']['fire']}</span>
                    <span class="reaction-btn">🍑 {news['reactions']['peach']}</span>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
    with col_trend:
        st.markdown("### 🔥 TRENDING MOST")
        st.caption("Fizetett kiemelés")
        
        # Csak a TOP 3 BOOSTOLT modell látszik itt
        trending = sorted(st.session_state.models, key=lambda x: x.get('boost', 0), reverse=True)[:3]
        
        for model in trending:
            border = "vip-border" if model['vip'] else ""
            st.markdown(f"""
            <div class="model-card {border}">
                <img src="{model['image']}" style="width:100%; height:150px; object-fit:cover;">
                <div style="padding:10px;">
                    <h4 style="margin:0;">{model['name']}</h4>
                    <small style="color:#00AFF0;">{model['category']}</small>
                </div>
            </div>
            """, unsafe_allow_html=True)
            st.button(f"Megnézem ➝", key=f"trend_{model['id']}")

def show_directory():
    st.markdown("## 🔎 MODELL KERESŐ")
    st.markdown("Találd meg álmaid nőjét. Írj be bármit: *szőke, milf, tetovált...*")
    
    # KERESŐ MŰKÖDÉSE
    search_term = st.text_input("Keresés...", placeholder="Pl. Szőke, Nagy mell...").lower()
    
    filtered_models = []
    for model in st.session_state.models:
        # Összefűzzük a modell adatait egy szöveggé a kereséshez
        tags_str = " ".join(model.get('tags', [])).lower()
        full_text = f"{model['name']} {model['category']} {model['desc']} {tags_str}".lower()
        
        if search_term in full_text:
            filtered_models.append(model)
            
    # EREDMÉNYEK MEGJELENÍTÉSE
    if not filtered_models:
        st.warning("Nincs találat. Próbálj más szót!")
    else:
        st.success(f"{len(filtered_models)} lány található.")
        cols = st.columns(3)
        for i, model in enumerate(filtered_models):
            with cols[i % 3]:
                st.markdown(f"""
                <div class="model-card">
                    <img src="{model['image']}" style="width:100%; height:250px; object-fit:cover;">
                    <div style="padding:15px;">
                        <h3>{model['name']}</h3>
                        <div style="margin-bottom:5px;">
                            {' '.join([f'<span style="background:#333; font-size:10px; padding:2px 5px; margin-right:2px; border-radius:3px;">{t}</span>' for t in model.get('tags', [])[:3]])}
                        </div>
                        <p style="color:#aaa; font-size:12px;">{model['desc']}</p>
                    </div>
                </div>
                """, unsafe_allow_html=True)
                st.button("PROFIL MEGTEKINTÉSE", key=f"dir_{model['id']}")

def show_partner_program():
    # A GYILKOS MARKETING SZÖVEG
    st.markdown("""
    <div style="text-align:center; padding: 20px;">
        <h1 style="font-size: 3rem; color: #00AFF0;">VELVET BLUE AGENCY</h1>
        <p style="font-size: 1.5rem;">A Milliomosok Titkos Fegyvere.</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div class="marketing-box">
        <h2 style="color: white; margin-bottom: 20px;">Miért a Velvet Blue?</h2>
        <p style="font-size: 1.1rem; color: #ccc; line-height: 1.6;">
            Nem te vagy a rabszolga. <b>Te vagy a Díj.</b><br>
            A legtöbb lány napi 12 órát pötyög a telefonján fillérekért, miközben a gazdag pasik átnéznek rajtuk.
            Mi megfordítjuk a játékot.
        </p>
        <hr style="border-color: #444; margin: 30px 0;">
        <h3 style="color: #00AFF0;">🤖 AZ AI CHATBOT FORRADALOM</h3>
        <p style="color: white; font-weight: bold;">
            Képzeld el, hogy 100 gazdag férfival beszélgetsz egyszerre. Lehetetlen? NEKÜNK NEM.
        </p>
        <ul style="text-align: left; margin: 20px auto; max-width: 600px; color: #ddd;">
            <li>✅ <b>Láthatatlan AI Chatbot:</b> A rendszerünk elemzi a férfi vágyait, és pontosan azt írja vissza, amit hallani akar.</li>
            <li>✅ <b>Pszichológiai Profilozás:</b> Tudjuk, ki az, aki csak nézelődik, és ki az a "Bálna", aki ma este elkölt 1000 Eurót.</li>
            <li>✅ <b>Senkinek nem tűnik fel:</b> A válaszok annyira emberiek, hogy a vendég szerelmes lesz beléd, miközben te alszol.</li>
        </ul>
        <h3 style="color: #ffd700; margin-top: 30px;">💰 GARANTÁLT EREDMÉNYEK</h3>
        <p>
            Már több száz elégedett ügyfelünk van, akik <b>havi több ezer eurós bevételt</b> értek el a stratégiánkkal.
            Profi fotósok, videós forgatókönyvek és teljes Brand Építés.
        </p>
        <br>
    </div>
    """, unsafe_allow_html=True)
    
    c1, c2 = st.columns(2)
    with c1:
        st.error("KEZDŐKNEK")
        st.write("Még nincs OnlyFansed? Felépítjük a birodalmad nulláról.")
        st.button("JELENTKEZEM (Kezdő)")
    with c2:
        st.success("HALADÓKNAK")
        st.write("Van bevételed, de többet akarsz munka nélkül? Automatizáljuk.")
        st.button("JELENTKEZEM (Profi)")

def show_admin():
    st.title("🛠️ ADMIN VEZÉRLŐPULT")
    
    tab1, tab2 = st.tabs(["ÚJ LÁNY FELVÉTELE", "BOOST KEZELÉS"])
    
    with tab1:
        st.write("Itt tudsz új lányt berakni az adatbázisba, hogy megtalálja a kereső.")
        with st.form("add_model"):
            new_name = st.text_input("Modell Neve")
            new_cat = st.selectbox("Kategória", ["Elite", "New Face", "MILF", "Teen", "Wild"])
            new_tags = st.text_input("Címkék (vesszővel elválasztva)", placeholder="szőke, tetovált, vékony")
            new_img = st.text_input("Kép Linkje")
            submitted = st.form_submit_button("MODELL MENTÉSE")
            
            if submitted:
                # Létrehozzuk az új adatot
                new_id = len(st.session_state.models) + 1
                tag_list = [t.strip() for t in new_tags.split(',')]
                
                model_data = {
                    "id": new_id,
                    "name": new_name,
                    "category": new_cat,
                    "tags": tag_list,
                    "image": new_img if new_img else "https://via.placeholder.com/300",
                    "vip": False,
                    "boost": 0,
                    "desc": "Új modell.",
                    "link": "#"
                }
                st.session_state.models.append(model_data)
                st.success(f"{new_name} sikeresen hozzáadva! Most már megtalálható a keresőben.")

    with tab2:
        st.write("Itt állítsd be, ki legyen elöl (Aki fizetett).")
        model_names = [m['name'] for m in st.session_state.models]
        selected = st.selectbox("Válassz lányt", model_names)
        
        # Megkeressük a kiválasztottat
        model = next((m for m in st.session_state.models if m['name'] == selected), None)
        
        if model:
            new_boost = st.slider(f"Boost Szint (Jelenleg: {model['boost']})", 0, 10, model['boost'])
            is_vip = st.checkbox("Legyen VIP (Arany keret)?", value=model['vip'])
            
            if st.button("BEÁLLÍTÁSOK FRISSÍTÉSE"):
                model['boost'] = new_boost
                model['vip'] = is_vip
                st.success("Frissítve! Nézd meg a főoldalon.")

# --- 6. NAVIGÁCIÓ ---
with st.sidebar:
    st.title("VELVET BLUE")
    menu = st.radio("MENÜ", ["HÍREK (Főoldal)", "KERESŐ", "PARTNER PROGRAM", "ADMIN"], label_visibility="collapsed")
    st.info("Admin jelszó: admin123")

if menu == "HÍREK (Főoldal)":
    show_home()
elif menu == "KERESŐ":
    show_directory()
elif menu == "PARTNER PROGRAM":
    show_partner_program()
elif menu == "ADMIN":
    p = st.text_input("Jelszó", type="password")
    if p == "admin123":
        show_admin()