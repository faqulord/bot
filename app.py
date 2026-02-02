import streamlit as st
import pandas as pd
import random
import time
from datetime import datetime

# --- 1. KONFIGURÁCIÓ & DESIGN ---
st.set_page_config(
    page_title="Velvet Blue Management",
    page_icon="💎",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- 2. ADATBÁZIS (SESSION STATE) ---
# Ez tárolja az adatokat amíg fut az app. Élesben ezt egy adatbázis fájlból töltenénk be.

if 'models' not in st.session_state:
    # Kezdő adatbázis (Példa)
    st.session_state.models = [
        {"id": 1, "name": "Kitti", "category": "Elite", "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80", "vip": True, "boost": 10, "desc": "Az ország leggyorsabban növekvő profilja.", "link": "#"},
        {"id": 2, "name": "Szandra", "category": "New Face", "image": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80", "vip": False, "boost": 5, "desc": "Kreatív tartalmak, napi frissítéssel.", "link": "#"},
        {"id": 3, "name": "Niki", "category": "MILF", "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80", "vip": True, "boost": 8, "desc": "Tapasztalt és exkluzív.", "link": "#"},
        {"id": 4, "name": "Rebeka", "category": "Wild", "image": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=80", "vip": False, "boost": 2, "desc": "Vadóc stílus, tetovált.", "link": "#"},
        {"id": 5, "name": "Dorina", "category": "Teen", "image": "https://images.unsplash.com/photo-1506956191951-7a88da4435e5?w=500&q=80", "vip": False, "boost": 1, "desc": "Most kezdtem, légy kedves!", "link": "#"},
    ]

if 'news' not in st.session_state:
    st.session_state.news = [
        {"title": "BOTRÁNY: Kiszivárgott videó a Balatonról?", "body": "Egy ismert magyar modell videója terjed a Redditen. A felvételeken állítólag...", "reactions": {"fire": 124, "peach": 89, "angry": 12}, "date": "Ma, 10:23"},
        {"title": "Mennyit keres valójában egy top OnlyFans modell itthon?", "body": "Exkluzív interjú Kittivel, aki megmutatta a bankszámláját. A számok sokkolóak.", "reactions": {"fire": 450, "peach": 210, "angry": 5}, "date": "Tegnap"}
    ]

if 'banners' not in st.session_state:
    # Ezek a fenti nagy bannerek
    st.session_state.banners = [
        {"image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&h=400&fit=crop", "link": "#", "active": True},
        {"image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1200&h=400&fit=crop", "link": "#", "active": True}
    ]

# --- 3. CSS DESIGN (PROFI ÜGYNÖKSÉG) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
    html, body, [class*="css"] { font-family: 'Poppins', sans-serif; }
    .stApp { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; }

    /* CÍMSOROK */
    .neon-text {
        background: -webkit-linear-gradient(0deg, #ffffff, #00AFF0);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        font-weight: 800; text-transform: uppercase; letter-spacing: 2px;
    }
    
    /* MODELL KÁRTYA */
    .model-card {
        background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px; overflow: hidden; transition: transform 0.3s; margin-bottom: 20px; position: relative;
    }
    .model-card:hover { transform: translateY(-5px); border-color: #00AFF0; }
    .vip-border { border: 2px solid #ffd700 !important; box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); }
    
    /* REAKCIÓ GOMBOK (HÍREKHEZ) */
    .reaction-btn {
        background: #334155; border: none; padding: 5px 10px; border-radius: 20px;
        color: white; font-size: 12px; margin-right: 5px; cursor: pointer;
    }
    .reaction-btn:hover { background: #475569; }

    /* HIRDETÉS HELYE */
    .ad-slot {
        background: #1e1e1e; border: 1px dashed #444; color: #666;
        text-align: center; padding: 20px; margin: 10px 0; border-radius: 10px; font-size: 0.8rem;
    }

    /* MENÜ GOMBOK */
    .nav-btn { width: 100%; padding: 15px; margin: 5px 0; background: transparent; border: 1px solid #333; color: white; text-align: left; cursor: pointer; }
    .nav-btn:hover { background: #00AFF0; border-color: #00AFF0; }
    </style>
""", unsafe_allow_html=True)

# --- 4. FÜGGVÉNYEK ---

def generate_fake_reactions():
    """Generál egy csomó kamu reakciót, hogy aktívnak tűnjön az oldal"""
    return {
        "fire": random.randint(50, 500),
        "peach": random.randint(20, 300),
        "angry": random.randint(0, 50)
    }

def show_ad_banner(type="google"):
    """Google Ads Helykitöltő"""
    st.markdown(f"""
    <div class="ad-slot">
        <p>📢 HIRDETÉS HELYE ({type.upper()})</p>
        <p>Ide kerül a Google Adsense kód</p>
    </div>
    """, unsafe_allow_html=True)

# --- 5. OLDALAK ---

def show_home():
    # 1. CAROUSEL BANNER (A fizetett lányok képei úsznak)
    st.markdown('<h1 class="neon-text" style="text-align:center; font-size: 3rem;">Velvet Blue</h1>', unsafe_allow_html=True)
    
    # Egyszerű képnézegető a bannerekből (Aki fizetett)
    active_banners = [b for b in st.session_state.banners if b['active']]
    if active_banners:
        # Véletlenszerűen választunk egyet minden frissítésnél (vagy lehetne slideshow)
        promo = random.choice(active_banners)
        st.image(promo['image'], use_container_width=True, caption="🔥 KIEMELT PARTNERÜNK (HIRDETÉS)")
    
    # 2. TRENDING MOST (Aki a Boostert fizette)
    st.markdown("### 🔥 Trending Most")
    st.caption("A legaktívabb profilok ebben az órában")
    
    # Sorbarendezés BOOST szerint (Admin állítja)
    trending_models = sorted(st.session_state.models, key=lambda x: x.get('boost', 0), reverse=True)[:3]
    
    cols = st.columns(3)
    for idx, model in enumerate(trending_models):
        with cols[idx]:
            st.markdown(f"""
            <div class="model-card vip-border">
                <div style="position:absolute; top:10px; left:10px; background:red; color:white; padding:2px 5px; font-weight:bold; font-size:10px; border-radius:3px;">LIVE</div>
                <img src="{model['image']}" style="width:100%; height:200px; object-fit:cover;">
                <div style="padding:10px; text-align:center;">
                    <h3 style="margin:0;">{model['name']}</h3>
                    <small style="color:#ffd700;">★ TOP 1%</small>
                </div>
            </div>
            """, unsafe_allow_html=True)
            st.button(f"Profil megnyitása ➝", key=f"trend_{model['id']}")

    show_ad_banner("Főoldal_Közép")

    # 3. HÍREK & PLETYKÁK (A csali)
    st.markdown("### 📰 Friss Pletykák & Botrányok")
    
    for i, news in enumerate(st.session_state.news):
        with st.container():
            st.markdown(f"""
            <div style="background:#1e293b; padding:15px; border-radius:10px; border-left: 4px solid #00AFF0; margin-bottom:15px;">
                <h4 style="margin:0; color:white;">{news['title']}</h4>
                <p style="color:#aaa; font-size:14px; margin:5px 0;">{news['date']}</p>
                <p style="color:#ddd;">{news['body']}</p>
                <div style="margin-top:10px;">
                    <span class="reaction-btn">🔥 {news['reactions']['fire']}</span>
                    <span class="reaction-btn">🍑 {news['reactions']['peach']}</span>
                    <span class="reaction-btn">😡 {news['reactions']['angry']}</span>
                </div>
            </div>
            """, unsafe_allow_html=True)
        
        # Minden 2. hír után egy reklám
        if i % 2 != 0:
            show_ad_banner("Hírfolyam_Közi")

def show_directory():
    st.markdown("## 🔎 Modell Kereső")
    
    # Keresőmezők
    c1, c2 = st.columns([3, 1])
    search = c1.text_input("Keresés...", placeholder="Név, stílus, hajszín...")
    cat = c2.selectbox("Kategória", ["Összes", "Elite", "New Face", "MILF", "Wild", "Teen"])

    # Szűrés
    filtered = st.session_state.models
    if cat != "Összes":
        filtered = [m for m in filtered if m['category'] == cat]
    if search:
        filtered = [m for m in filtered if search.lower() in m['name'].lower()]

    st.markdown(f"**Találat:** {len(filtered)} modell")
    
    # GRID MEGJELENÍTÉS + GOOGLE ADS BESZÚRÁSA
    cols = st.columns(3)
    for i, model in enumerate(filtered):
        # Minden 5. kártya után beszúrunk egy reklámot a rácsba (opcionális)
        
        with cols[i % 3]:
            vip_class = "vip-border" if model['vip'] else ""
            badge = '<span style="background:#ffd700; color:black; padding:2px 5px; border-radius:3px; font-size:10px; font-weight:bold;">VIP</span>' if model['vip'] else ""
            
            st.markdown(f"""
            <div class="model-card {vip_class}">
                <img src="{model['image']}" style="width:100%; height:250px; object-fit:cover;">
                <div style="padding:15px;">
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:#00AFF0; font-size:12px; font-weight:bold;">{model['category'].upper()}</span>
                        {badge}
                    </div>
                    <h3 style="margin:5px 0;">{model['name']}</h3>
                    <p style="color:#aaa; font-size:12px;">{model['desc']}</p>
                </div>
            </div>
            """, unsafe_allow_html=True)
            st.button(f"Megnézem", key=f"dir_{model['id']}")

def show_partner_program():
    st.markdown("""
    <div style="text-align:center; padding:40px 0;">
        <h1 class="neon-text" style="font-size:3rem;">Partner Program</h1>
        <p style="font-size:1.2rem; color:#ccc;">Ne csak álmodozz róla. Építsd fel a birodalmad.</p>
    </div>
    """, unsafe_allow_html=True)

    tab1, tab2, tab3 = st.tabs(["🚀 KEZDŐKNEK", "💎 PROFIKNAK", "📢 HIRDETÉS VÁSÁRLÁS"])

    with tab1:
        st.info("Még nincs OnlyFansed? Vagy van, de nem hoz pénzt?")
        st.markdown("""
        ### Start Your Empire Csomag
        Látod a sikeres lányokat Dubajban? Ők sem tudtak semmit az elején. **Csak volt egy jó menedzserük.**
        * ✅ **Profilépítés nulláról:** Megírjuk a bemutatkozásodat, ami elad.
        * ✅ **Árazási Stratégia:** Hogy ne aprópénzért vetkőzz.
        * ✅ **Első 100 Feliratkozó:** Titkos módszer reklámköltség nélkül.
        
        **Ár:** 30.000 Ft (Egyszeri díj)
        """)
        st.button("Jelentkezem a Mentorprogramba")

    with tab2:
        st.info("Már van bevételed, de belefulladsz a munkába?")
        st.markdown("""
        ### Scale to Top 1%
        Te vagy a Múzsa, nem a rabszolga. Automatizáljuk a bevételed.
        * 🚀 **Chat Management:** Profi operátorok válaszolnak helyetted 0-24-ben.
        * 🐳 **Whale Hunting:** Megtaláljuk a "bálnákat" (gazdag vendégek).
        * 💎 **Brand Építés:** Legyél márka, ne csak egy lány a sok közül.
        
        **Ár:** 20% Jutalék a növekményből
        """)
        st.button("Szintet akarok lépni")

    with tab3:
        st.warning("Azonnali forgalmat akarsz?")
        st.markdown("""
        ### Get Seen - Hirdetési Csomagok
        A Velvet Blue Magyarország legnagyobb közössége. **Havi 80.000+ éhes szempár.**
        
        | Csomag | Mit kapsz? | Ár |
        | :--- | :--- | :--- |
        | **Heti Banner** | Óriásplakát a főoldalon 7 napig. | **50.000 Ft** |
        | **Algoritmus Boost** | 'Trending' lista eleje + Kereső boost. | **20.000 Ft** |
        | **Címlapsztori** | PR Cikk rólad a Hírekben + Link. | **15.000 Ft** |
        """)
        st.button("Lefoglalom a Helyet (WhatsApp)")

def show_admin():
    st.markdown("## 🛠️ ADMIN VEZÉRLŐPULT")
    
    c1, c2 = st.columns(2)
    
    with c1:
        st.subheader("🤖 AI Automatizáció")
        
        # 1. HÍR GENERÁTOR
        st.write("**1. Pletyka Generátor**")
        topic = st.text_input("Miről írjon az AI?", placeholder="Pl. Szőke modell botrány")
        if st.button("✨ AI Hír Generálása"):
            with st.spinner("Az AI írja a botrányos cikket..."):
                time.sleep(2) # Szimuláció
                new_article = {
                    "title": f"BREAKING: {topic if topic else 'Újabb OnlyFans dráma'} rázta meg a közösséget!",
                    "body": "A belső forrásaink szerint hatalmas felháborodást keltett a tegnapi eset, amikor...",
                    "reactions": generate_fake_reactions(),
                    "date": datetime.now().strftime("%H:%M")
                }
                st.session_state.news.insert(0, new_article) # Hozzáadjuk az elejére
                st.success("Cikk élesítve a főoldalon!")

        st.markdown("---")
        
        # 2. HUNTER BOT
        st.write("**2. OnlyFans Hunter Bot**")
        st.caption("Ez a script végignézi a Twitter/Reddit #hungary hashtageket.")
        if st.button("🕵️ Új Lányok Keresése"):
            with st.spinner("A robot keresi az aktív magyar profilokat..."):
                time.sleep(3) # Szimuláció
                found_models = [
                    {"id": random.randint(100,999), "name": "Betti_Official", "category": "New Face", "image": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500", "vip":False, "boost":0, "desc":"Most találtam Twitteren.", "link":"#"},
                    {"id": random.randint(100,999), "name": "Vivi_Queen", "category": "Teen", "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500", "vip":False, "boost":0, "desc":"Redditről scannelve.", "link":"#"}
                ]
                st.session_state.models.extend(found_models)
                st.success(f"Siker! 2 új potenciális modellt találtam. Bekerültek az adatbázisba.")

    with c2:
        st.subheader("💰 Hirdetés Kezelő")
        
        # 3. BANNER FELTÖLTÉS (LINK ALAPJÁN)
        st.write("**Új Banner Kitűzése**")
        img_link = st.text_input("Kép Linkje (Jobb klikk -> Kép címének másolása)")
        target_link = st.text_input("Hova mutasson? (Affiliate Link)")
        
        if st.button("Banner Élesítése"):
            if img_link:
                st.session_state.banners.append({"image": img_link, "link": target_link, "active": True})
                st.success("Banner kint van a főoldalon!")
            else:
                st.error("Kell egy kép link!")
        
        st.markdown("---")
        
        # 4. BOOST MANAGER (Kézi vezérlés)
        st.write("**Modell Boostolása (Aki fizetett)**")
        model_names = [m['name'] for m in st.session_state.models]
        selected_model_name = st.selectbox("Válassz modellt", model_names)
        
        # Megkeressük a kiválasztott modellt
        selected_model = next((m for m in st.session_state.models if m['name'] == selected_model_name), None)
        
        if selected_model:
            new_boost = st.slider(f"{selected_model_name} Boost Szintje", 0, 10, selected_model.get('boost', 0))
            is_vip = st.checkbox("Legyen VIP (Arany keret)?", value=selected_model['vip'])
            
            if st.button("Beállítások Mentése"):
                selected_model['boost'] = new_boost
                selected_model['vip'] = is_vip
                st.success(f"{selected_model_name} frissítve! (Boost: {new_boost}, VIP: {is_vip})")


# --- 6. FŐ NAVIGÁCIÓ ---

with st.sidebar:
    st.markdown('<h2 style="color:#00AFF0; text-align:center;">VELVET BLUE</h2>', unsafe_allow_html=True)
    menu = st.radio("MENÜ", ["Főoldal", "Modell Kereső", "Partner Program", "Admin"], label_visibility="collapsed")
    st.markdown("---")
    st.info("Admin Jelszó: admin123")

if menu == "Főoldal":
    show_home()
elif menu == "Modell Kereső":
    show_directory()
elif menu == "Partner Program":
    show_partner_program()
elif menu == "Admin":
    pwd = st.text_input("Jelszó", type="password")
    if pwd == "admin123":
        show_admin()