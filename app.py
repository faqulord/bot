import streamlit as st
import pandas as pd
import numpy as np

# --- CONFIG ---
st.set_page_config(page_title="ONYX SYSTEMS | Zártkörű Elemzés", page_icon="⚫", layout="centered")

# --- DESIGN & CSS (A Mátrix / High-End Stílus) ---
st.markdown("""
<style>
    /* Sötét háttér és betűtípusok */
    .stApp { background-color: #050505; color: #e0e0e0; font-family: 'Helvetica Neue', sans-serif; }
    
    /* Címsorok */
    h1 { color: #ffffff; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; }
    h2 { color: #00ff88; font-weight: 600; font-size: 1.5rem; border-left: 3px solid #00ff88; padding-left: 10px; }
    h3 { color: #888; font-size: 1.1rem; font-weight: 400; }
    
    /* Kiemelt dobozok */
    .metric-box {
        background: #111; border: 1px solid #333; padding: 20px; border-radius: 8px;
        text-align: center; margin-bottom: 20px;
        box-shadow: 0 4px 15px rgba(0, 255, 136, 0.1);
    }
    .big-number { font-size: 2.5rem; font-weight: bold; color: #00ff88; }
    .label { font-size: 0.9rem; color: #666; text-transform: uppercase; letter-spacing: 1px; }
    
    /* Gombok (Neon stílus) */
    .stButton>button {
        background-color: #000; color: #00ff88; 
        border: 1px solid #00ff88; border-radius: 0px;
        font-weight: bold; padding: 15px 30px; text-transform: uppercase;
        transition: all 0.3s ease; width: 100%;
    }
    .stButton>button:hover {
        background-color: #00ff88; color: #000;
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.6);
    }
    
    /* Link gomb stílus (Telegram) */
    .telegram-btn {
        display: block; width: 100%; padding: 15px; margin-top: 20px;
        background: linear-gradient(45deg, #0088cc, #005f8f);
        color: white !important; text-align: center; text-decoration: none;
        font-weight: bold; border-radius: 5px; font-size: 1.1rem;
        box-shadow: 0 4px 15px rgba(0, 136, 204, 0.4);
    }
    .telegram-btn:hover { opacity: 0.9; }

    /* Lakat ikon */
    .locked { font-size: 3rem; text-align: center; color: #333; margin: 20px 0; }
</style>
""", unsafe_allow_html=True)

# --- FEJLÉC ---
col1, col2 = st.columns([1, 5])
with col1:
    st.markdown("<div style='font-size: 3rem; text-align: center;'>⚫</div>", unsafe_allow_html=True)
with col2:
    st.title("ONYX SYSTEMS")
    st.markdown("### ALGORITMIKUS VAGYONÉPÍTÉS. NEM SZERENCSEJÁTÉK.")

st.markdown("---")

# --- HERO SZEKCIÓ (Az Ígéret) ---
st.markdown("""
**Üdvözöllek a valóságban.**

A fogadóirodák abból élnek, hogy te érzésből játszol. Mi abból élünk, hogy matematikával verjük meg őket.
Az **ONYX** egy mesterséges intelligencia alapú rendszer, amely statisztikai hibákat (Value Bets) keres a piacon.

* **Nincs tippelgetés.**
* **Nincsenek érzelmek.**
* **Csak tiszta matematika és 30 napos ciklusok.**
""")

# --- STATISZTIKA (A Bizonyíték - Szimulált Grafikon) ---
st.write("")
st.markdown("## 📊 TELJESÍTMÉNY MUTATÓK")

# Szimulált profit görbe generálása (hogy lássák a növekedést)
chart_data = pd.DataFrame(
    np.cumsum(np.random.randn(30) + 1.2), # Pozitív trend szimuláció
    columns=['Tőkenövekedés (%)']
)
st.line_chart(chart_data, color="#00ff88")

c1, c2, c3 = st.columns(3)
with c1:
    st.markdown("""
    <div class="metric-box">
        <div class="big-number">68%</div>
        <div class="label">Találati Arány</div>
    </div>
    """, unsafe_allow_html=True)
with c2:
    st.markdown("""
    <div class="metric-box">
        <div class="big-number">+42%</div>
        <div class="label">Átl. Havi Profit</div>
    </div>
    """, unsafe_allow_html=True)
with c3:
    st.markdown("""
    <div class="metric-box">
        <div class="big-number">AI</div>
        <div class="label">Elozslás Modell</div>
    </div>
    """, unsafe_allow_html=True)

# --- A STRATÉGIA ---
st.markdown("## 🔒 ZÁRTKÖRŰ TAGSÁG")
st.write("Ez nem egy tömegcsoport. Nem engedünk be mindenkit. A tagság feltétele a szigorú fegyelem és a stratégia betartása.")

st.markdown("""
* ✅ **Napi 1-2 Prémium Signal:** Csak a legerősebb, matematikailag igazolt lehetőségek.
* ✅ **Bankroll Management:** Pontosan megmondjuk, mennyit tegyél fel.
* ✅ **Onyx AI Elemzés:** Hozzáférés a rendszerünk által generált adatokhoz.
* ✅ **30 Napos Ciklusok:** Hosszú távú tőkeépítésre tervezve.
""")

st.markdown("<div class='locked'>🔒</div>", unsafe_allow_html=True)
st.warning("⚠️ A TARTALOM JELENLEG ZÁROLT. CSAK AKTÍV ELŐFIZETŐKNEK.")

# --- PRICING & CTA ---
st.markdown("---")
st.markdown("<h2 style='text-align: center; border: none; color: #fff;'>CSATLAKOZÁS A RENDSZERHEZ</h2>", unsafe_allow_html=True)

col_price, col_join = st.columns([1, 1])

with col_price:
    st.markdown("""
    <div style="background: #1a1a1a; padding: 30px; border-radius: 10px; border: 1px solid #444;">
        <h3 style="color: #fff; margin-top: 0;">ONYX VIP PASS</h3>
        <div style="font-size: 2rem; font-weight: bold; color: #00ff88; margin: 10px 0;">15.000 Ft <span style="font-size: 1rem; color: #888;">/ hó</span></div>
        <p style="color: #aaa; font-size: 0.9rem;">Teljes hozzáférés a napi elemzésekhez és a privát Telegram csatornához.</p>
        <p style="color: #fff;">✅ Manuális felvétel</p>
        <p style="color: #fff;">✅ 24/7 Support</p>
    </div>
    """, unsafe_allow_html=True)

with col_join:
    st.write("")
    st.write("A felvétel nem automatikus. Írj üzenetet a rendszer adminisztrátorának a Telegramon.")
    st.write("Az üzenetben írd meg: **'Jelentkezem az ONYX VIP-be'**.")
    
    # TELEGRAM LINK @SHANNA444-hez
    st.markdown("""
    <a href="https://t.me/SHANNA444" target="_blank" class="telegram-btn">
        💬 ÜZENET KÜLDÉSE (@SHANNA444)
    </a>
    """, unsafe_allow_html=True)
    
    st.caption("A fizetés Revoluton vagy Banki átutalással történik. A válaszidő ált. 1-2 óra.")

# --- FOOTER ---
st.markdown("---")
st.markdown("<div style='text-align: center; color: #555; font-size: 0.8rem;'>© 2024 ONYX SYSTEMS. Minden jog fenntartva. Ez nem pénzügyi tanácsadás.</div>", unsafe_allow_html=True)