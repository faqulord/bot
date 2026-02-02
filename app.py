import streamlit as st
import pandas as pd

# --- KONFIGURÁCIÓ (PROFI ÜGYNÖKSÉG MÓD) ---
st.set_page_config(
    page_title="Velvet Blue Management",
    page_icon="💎",
    layout="wide",
    initial_sidebar_state="collapsed" # Alapból csukjuk be a menüt a tisztaságért
)

# --- PROFI CSS DESIGN (OnlyFans Színek & Agency Stílus) ---
st.markdown("""
    <style>
    /* Betűtípus importálása (Google Fonts: Poppins) */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

    /* ALAP BEÁLLÍTÁSOK */
    html, body, [class*="css"] {
        font-family: 'Poppins', sans-serif;
    }
    
    /* HÁTTÉR - Sötét, elegáns, sötétkék átmenettel */
    .stApp {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #ffffff;
    }

    /* ONLYFANS KÉK KIEMELÉSEK */
    .highlight {
        color: #00AFF0; /* Hivatalos OF Kék */
        font-weight: bold;
    }

    /* HEADER / HERO SZEKCIÓ */
    .hero-container {
        text-align: center;
        padding: 60px 20px;
        background: radial-gradient(circle at center, #1e3a8a33 0%, transparent 70%);
        border-bottom: 1px solid #334155;
        margin-bottom: 40px;
    }
    .hero-title {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 2px;
        background: -webkit-linear-gradient(0deg, #ffffff, #00AFF0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
        font-size: 1.2rem;
        color: #94a3b8;
        max-width: 600px;
        margin: 0 auto;
    }

    /* MODEL KÁRTYÁK (GLASSMORPHISM) */
    .model-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 0;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        margin-bottom: 20px;
    }
    .model-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 175, 240, 0.2); /* Kék ragyogás */
        border-color: #00AFF0;
    }
    .model-img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        opacity: 0.9;
    }
    .model-info {
        padding: 20px;
    }
    .model-name {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
        color: white;
    }
    .model-tag {
        background-color: #00AFF0;
        color: white;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        display: inline-block;
        margin-bottom: 10px;
    }
    
    /* GOMBOK */
    .stButton > button {
        background-color: #00AFF0;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 10px 30px;
        font-weight: 600;
        text-transform: uppercase;
        transition: all 0.3s ease;
        width: 100%;
    }
    .stButton > button:hover {
        background-color: #0084b4;
        box-shadow: 0 0 15px rgba(0, 175, 240, 0.6);
    }
    
    /* ADMIN PANEL ELREJTÉSE (Hogy a user ne lássa) */
    /* Csak a design kedvéért most hagyjuk, de élesben elrejtenénk */

    </style>
""", unsafe_allow_html=True)

# --- FÜGGVÉNYEK ---

def show_hero():
    """A látványos felső rész"""
    st.markdown("""
        <div class="hero-container">
            <div class="hero-title">Velvet Blue</div>
            <div class="hero-subtitle">Magyarország Prémium OnlyFans Tehetséggondozó Ügynöksége. <br>Exkluzív tartalom. Ellenőrzött modellek. Diszkréció.</div>
        </div>
    """, unsafe_allow_html=True)

def show_featured_models():
    """Kiemelt modellek szekció (Manuális példa adatokkal)"""
    st.markdown("### 💎 Kiemelt Tehetségeink")
    
    col1, col2, col3 = st.columns(3)
    
    # KÁRTYA 1
    with col1:
        st.markdown("""
        <div class="model-card">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" class="model-img">
            <div class="model-info">
                <span class="model-tag">Elite</span>
                <h3 class="model-name">Kitti</h3>
                <p style="color: #ccc; font-size: 0.9rem;">22 éves • Budapest • Lifestyle & Glamour</p>
                <p style="color: #888; font-size: 0.8rem; margin-top: 10px;">"Az ország leggyorsabban növekvő profilja."</p>
            </div>
        </div>
        """, unsafe_allow_html=True)
        st.button("Profil Megtekintése", key="btn1")

    # KÁRTYA 2
    with col2:
        st.markdown("""
        <div class="model-card">
            <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80" class="model-img">
            <div class="model-info">
                <span class="model-tag">Új Felfedezett</span>
                <h3 class="model-name">Szandra</h3>
                <p style="color: #ccc; font-size: 0.9rem;">20 éves • Debrecen • Cosplay & Art</p>
                <p style="color: #888; font-size: 0.8rem; margin-top: 10px;">"Kreatív tartalmak, napi frissítéssel."</p>
            </div>
        </div>
        """, unsafe_allow_html=True)
        st.button("Profil Megtekintése", key="btn2")

    # KÁRTYA 3
    with col3:
        st.markdown("""
        <div class="model-card">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80" class="model-img">
            <div class="model-info">
                <span class="model-tag">VIP</span>
                <h3 class="model-name">Niki</h3>
                <p style="color: #ccc; font-size: 0.9rem;">28 éves • Bécs/BP • Exclusive</p>
                <p style="color: #888; font-size: 0.8rem; margin-top: 10px;">"Csak komoly érdeklődőknek."</p>
            </div>
        </div>
        """, unsafe_allow_html=True)
        st.button("Profil Megtekintése", key="btn3")

def show_news_ticker():
    """Hírsáv (Agency News)"""
    st.markdown("---")
    st.markdown("### 📰 Ügynökségi Hírek & Pletykák")
    
    # Hír blokk (Stilizált)
    st.info("📢 **Legfrissebb:** Kitti (Top 1 modellünk) tegnap bejelentette, hogy jövő héten indul a privát VIP csoportja. A helyek 80%-a már elkelt.")
    st.info("📉 **Piaci Elemzés:** Az OnlyFans algoritmus változása miatt a magyar lányok bevétele nőtt - tudd meg miért a Blogunkban.")


# --- FŐOLDAL ÖSSZERAKÁSA ---

show_hero()
show_featured_models()
show_news_ticker()

# Admin Login (Elrejtve az aljára, diszkréten)
st.markdown("<br><br><br>", unsafe_allow_html=True)
with st.expander("🔒 Agency Portal (Staff Only)"):
    password = st.text_input("Access Code", type="password")
    if password == "admin123":
        st.success("Belépés sikeres")
        st.write("Itt lesznek az admin beállítások...")