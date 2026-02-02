import streamlit as st
import time
import random

# --- 1. KONFIGURÁCIÓ & LUXUS DESIGN ---
st.set_page_config(
    page_title="PRIME HUNGARY | Official Agency",
    page_icon="👑",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- 2. ADATBÁZIS (SESSION STATE) ---
# Bannerek (A mozgó képek felül)
if 'banners' not in st.session_state:
    st.session_state.banners = [
        {"img": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&h=600&fit=crop", "link": "#", "title": "KITTI"},
        {"img": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&h=600&fit=crop", "link": "#", "title": "SZANDRA"},
        {"img": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&h=600&fit=crop", "link": "#", "title": "NIKI"}
    ]

# Hírek (A pletyka fal)
if 'news' not in st.session_state:
    st.session_state.news = [
        {"title": "Kiszivárgott a videó: Így buliznak a top modellek Dubajban", "img": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600", "reactions": {"🔥": 852, "🍑": 420, "💦": 150}},
        {"title": "Rekordbevétel: Ez a magyar lány keresi a legtöbbet idén", "img": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600", "reactions": {"🔥": 1200, "🍑": 600, "💦": 300}}
    ]

# A Nagy Lista (Csak nevek és linkek)
if 'roster' not in st.session_state:
    st.session_state.roster = [
        {"name": "Kitti_Official", "link": "#", "new": True},
        {"name": "Szandra_Queen", "link": "#", "new": False},
        {"name": "Vivi_Baby", "link": "#", "new": True},
        {"name": "Rebeka_Wild", "link": "#", "new": False},
        {"name": "Dorina_X", "link": "#", "new": False},
        # ... ide jön majd a többi 100 lány
    ]

# --- 3. CSS (BLACK & GOLD THEME) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');
    
    html, body, [class*="css"] { font-family: 'Montserrat', sans-serif; }
    
    /* HÁTTÉR: Mélyfekete */
    .stApp { background-color: #000000; color: #ffffff; }
    
    /* ARANY SZÍN (PRÉMIUM) */
    .gold-text {
        color: #D4AF37;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    
    /* FŐ CÍM */
    .prime-header {
        font-size: 3rem; font-weight: 900; text-align: center; margin-bottom: 20px;
        background: -webkit-linear-gradient(#fff, #999);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    /* BANNER SLIDER TARTÓ */
    .slideshow-container {
        position: relative;
        max-width: 100%;
        margin: auto;
        border-bottom: 4px solid #D4AF37;
        margin-bottom: 40px;
    }

    /* HÍR KÁRTYÁK */
    .news-card {
        background: #111;
        border: 1px solid #333;
        margin-bottom: 30px;
        border-radius: 0px; /* Szögletes, férfias */
    }
    .news-img { width: 100%; height: 250px; object-fit: cover; opacity: 0.8; transition: opacity 0.3s; }
    .news-img:hover { opacity: 1; }
    .news-title {
        font-size: 1.4rem; font-weight: 700; padding: 15px; color: white; text-transform: uppercase;
    }
    .reaction-bar {
        background: #222; padding: 10px; display: flex; justify-content: space-around;
        border-top: 1px solid #333;
    }
    .reaction-btn {
        background: none; border: 1px solid #444; color: #D4AF37; 
        padding: 5px 15px; cursor: pointer; font-size: 1.2rem;
    }
    .reaction-btn:hover { background: #D4AF37; color: black; }

    /* A LISTA (ROSTER) */
    .roster-item {
        padding: 15px; border-bottom: 1px solid #222;
        display: flex; justify-content: space-between; align-items: center;
        transition: background 0.2s;
    }
    .roster-item:hover { background: #111; }
    .roster-name { font-size: 1.1rem; font-weight: 600; color: #eee; }
    .roster-link { color: #D4AF37; text-decoration: none; font-size: 0.9rem; border: 1px solid #D4AF37; padding: 5px 10px; }
    
    /* AGENCY OLDAL */
    .agency-hero {
        text-align: center; padding: 60px 20px;
        background: radial-gradient(circle, #222 0%, #000 100%);
        border: 1px solid #333; margin-bottom: 30px;
    }
    
    /* MENÜ GOMBOK */
    .nav-btn { width: 100%; padding: 20px; text-align: center; background: #111; border: 1px solid #333; color: #D4AF37; font-weight: bold; margin-bottom: 5px; cursor: pointer; }
    .nav-btn:hover { background: #D4AF37; color: black; }
    
    </style>
""", unsafe_allow_html=True)

# --- 4. FÜGGVÉNYEK ---

def show_carousel():
    """A FŐOLDALI MOZGÓ KÉPEK (Exkluzív hirdetés)"""
    # Streamlitben a legtisztább slideshow megoldás:
    # Véletlenszerűen kiválasztunk egy 'Featured' modellt minden frissítésnél (vagy timerrel lehetne váltani)
    # De hogy "mozogjon", használunk egy full-width képet.
    
    featured = random.choice(st.session_state.banners)
    
    st.markdown(f"""
    <div class="slideshow-container">
        <div style="position: absolute; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); padding: 10px 20px; border-left: 5px solid #D4AF37;">
            <span style="color: white; font-size: 12px; letter-spacing: 2px;">KIEMELT PARTNER</span><br>
            <span style="color: #D4AF37; font-size: 30px; font-weight: 900;">{featured['title']}</span>
        </div>
        <img src="{featured['img']}" style="width: 100%; height: 500px; object-fit: cover;">
    </div>
    """, unsafe_allow_html=True)

def show_news_feed():
    """A HÍRPORTÁL (Csak a lényeg)"""
    st.markdown('<div class="gold-text" style="margin-bottom: 20px;">🔥 TOP SZTORIK & LEAKS</div>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    for i, item in enumerate(st.session_state.news):
        with (col1 if i % 2 == 0 else col2):
            st.markdown(f"""
            <div class="news-card">
                <img src="{item['img']}" class="news-img">
                <div class="news-title">{item['title']}</div>
                <div class="reaction-bar">
                    <button class="reaction-btn">🔥 {item['reactions']['🔥']}</button>
                    <button class="reaction-btn">🍑 {item['reactions']['🍑']}</button>
                    <button class="reaction-btn">💦 {item['reactions']['💦']}</button>
                </div>
            </div>
            """, unsafe_allow_html=True)

def show_the_list():
    """A LISTA - Minden magyar OF lány"""
    st.markdown("---")
    st.markdown('<div class="gold-text" style="text-align: center; margin: 40px 0;">🇭🇺 HIVATALOS MAGYAR ONLYFANS LISTA</div>', unsafe_allow_html=True)
    
    st.info("ℹ️ Ez a lista automatikusan frissül. Az aktív, ellenőrzött profilok listája.")
    
    # Két oszlopba rendezzük a listát, hogy hosszúnak tűnjön de olvasható legyen
    roster_cols = st.columns(2)
    
    for idx, girl in enumerate(st.session_state.roster):
        with roster_cols[idx % 2]:
            new_badge = '<span style="color:#00ff00; font-size:10px; margin-left:5px;">● ONLINE</span>' if girl['new'] else ""
            st.markdown(f"""
            <div class="roster-item">
                <span class="roster-name">{girl['name']} {new_badge}</span>
                <a href="{girl['link']}" class="roster-link" target="_blank">PROFIL ➜</a>
            </div>
            """, unsafe_allow_html=True)
            
    st.markdown('<div style="text-align:center; margin-top:20px; color:#555;">+ 128 további profil betöltése...</div>', unsafe_allow_html=True)

def show_agency_page():
    """A PROFI MANAGEMENT OLDAL"""
    st.markdown('<div class="prime-header">PRIME AGENCY</div>', unsafe_allow_html=True)
    
    st.markdown("""
    <div class="agency-hero">
        <h2 style="color:white; margin-bottom:20px;">NEM KERESÜNK MODELLEKET. <br><span style="color:#D4AF37;">MI ÉPÍTJÜK ŐKET.</span></h2>
        <p style="color:#ccc; max-width: 800px; margin: 0 auto; line-height: 1.6;">
            A Prime Hungary nem egy "chates cég". Mi vagyunk Magyarország egyetlen <b>Full-Service OnlyFans Menedzsmentje</b>.
            Az ügyfeleink nem dolgoznak. Ők birtokolják a brandet, mi pedig működtetjük a gépezetet.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    c1, c2, c3 = st.columns(3)
    
    with c1:
        st.markdown("### 🤖 1. The System")
        st.write("Saját fejlesztésű AI technológiánk elemzi a feliratkozóid viselkedését. Tudjuk, mikor fizetnek, mire vágynak, és a chatbotunk 0-24-ben kiszolgálja őket.")
    
    with c2:
        st.markdown("### 📈 2. The Traffic")
        st.write("Nem kell instán koldulnod a like-okért. A Prime Network (ez az oldal) havi 100.000+ célzott látogatót terel az oldaladra. Automatikusan.")
    
    with c3:
        st.markdown("### ⚖️ 3. The Shield")
        st.write("Teljes jogi védelem, tartalom törlés (DMCA) és pénzügyi tanácsadás. Hogy a bevételed biztonságban legyen.")

    st.markdown("---")
    st.markdown("<h3 style='text-align:center'>JELENTKEZÉS MENEDZSMENTRE</h3>", unsafe_allow_html=True)
    st.markdown("<p style='text-align:center; color:#666;'>Kizárólag meghívásos alapon vagy casting útján.</p>", unsafe_allow_html=True)
    
    st.text_input("Instagram / OnlyFans Link")
    st.text_input("Jelenlegi havi bevétel (Hogy tudjuk, hova soroljunk)")
    st.button("AUDIT KÉRÉSE (INGYENES)")


def show_admin():
    st.title("Adminisztrációs Felület")
    
    tab1, tab2, tab3 = st.tabs(["🖼️ Főoldali Banner", "📰 Hír Beküldés", "📋 Lista Frissítés"])
    
    with tab1:
        st.write("Ide illeszd be a képet, ami a főoldalon mozogjon (Exkluzív hely).")
        img = st.text_input("Kép URL")
        title = st.text_input("Modell Neve (Bannerre)")
        link = st.text_input("OnlyFans Link")
        if st.button("Banner Hozzáadása"):
            st.session_state.banners.insert(0, {"img": img, "title": title, "link": link})
            st.success("Kint van a főoldalon!")

    with tab2:
        st.write("Új pletyka vagy hír.")
        news_title = st.text_input("Cím (Clickbait)")
        news_img = st.text_input("Kép URL (Hírhez)")
        if st.button("Posztolás"):
            st.session_state.news.insert(0, {"title": news_title, "img": news_img, "reactions": {"🔥": 0, "🍑": 0, "💦": 0}})
            st.success("Cikk élesítve!")
            
    with tab3:
        st.write("Adj hozzá új lányt a nagy listához.")
        name = st.text_input("Név (pl. Kitti_Official)")
        olink = st.text_input("Link")
        if st.button("Listára teszem"):
            st.session_state.roster.append({"name": name, "link": olink, "new": True})
            st.success("Hozzáadva a listához!")

# --- 5. NAVIGÁCIÓ (REJTETT / MINIMALISTA) ---

with st.sidebar:
    st.markdown('<h2 style="color:#D4AF37;">PRIME</h2>', unsafe_allow_html=True)
    menu = st.radio("Navigáció", ["PORTÁL", "AGENCY / PARTNER", "ADMIN"], label_visibility="collapsed")
    st.info("Login: admin123")

if menu == "PORTÁL":
    # Ez a férfiak oldala
    show_carousel()
    show_news_feed()
    show_the_list() # A végtelen lista a lap alján

elif menu == "AGENCY / PARTNER":
    # Ez a lányok oldala
    show_agency_page()

elif menu == "ADMIN":
    pw = st.text_input("Jelszó", type="password")
    if pw == "admin123":
        show_admin()