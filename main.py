import streamlit as st
import pandas as pd
import os
import json
from datetime import datetime

# --- KONFIGURÁCIÓ ---
st.set_page_config(
    page_title="Hungarian Fans Hub",
    page_icon="🔥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Sötét téma és egyedi stílus (CSS)
st.markdown("""
    <style>
    .stApp {
        background-color: #0e1117;
        color: white;
    }
    .main-header {
        font-size: 3rem; 
        font-weight: bold; 
        color: #ff4b4b; 
        text-align: center;
        margin-bottom: 20px;
        text-transform: uppercase;
    }
    .ad-banner {
        width: 100%;
        height: 100px;
        background-color: #333;
        color: #aaa;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed #666;
        margin: 20px 0;
        border-radius: 10px;
    }
    .card {
        background-color: #262730;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 10px;
        border-left: 5px solid #ff4b4b;
    }
    </style>
""", unsafe_allow_html=True)

# --- FÜGGVÉNYEK ---

def display_ad(location="header"):
    """Google Ads vagy Egyedi Banner helye"""
    # Itt később lecseréljük a Google Ads HTML kódjára
    st.markdown(f"""
        <div class="ad-banner">
            <p>HIRDETÉS HELYE ({location.upper()}) - Google Ads</p>
        </div>
    """, unsafe_allow_html=True)

def check_password():
    """Admin jelszó ellenőrzése"""
    def password_entered():
        if st.session_state["password"] == "titkosjelszo123": # Ezt majd változtasd meg!
            st.session_state["password_correct"] = True
            del st.session_state["password"]  # Töröljük a jelszót a mezőből
        else:
            st.session_state["password_correct"] = False

    if "password_correct" not in st.session_state:
        # Első belépés
        st.text_input(
            "Admin Jelszó", type="password", on_change=password_entered, key="password"
        )
        return False
    elif not st.session_state["password_correct"]:
        # Hibás jelszó
        st.text_input(
            "Admin Jelszó", type="password", on_change=password_entered, key="password"
        )
        st.error("😕 Hibás jelszó")
        return False
    else:
        # Helyes jelszó
        return True

# --- OLDALAK ---

def show_home():
    st.markdown('<div class="main-header">🔥 Hungarian Fans Hub 🔥</div>', unsafe_allow_html=True)
    st.markdown("<h3 style='text-align: center; color: #ccc;'>A legfrissebb pletykák és a legszebb modellek egy helyen.</h3>", unsafe_allow_html=True)
    
    display_ad("felső_banner")
    
    st.subheader("📢 Legfrissebb Hírek & Pletykák")
    # Itt lesznek majd a hírek (adatbázisból)
    st.info("Hamarosan: Friss botrányok és kiszivárgott infók!")

    st.markdown("---")
    
    st.subheader("🏆 Heti Kiemelt Modellek")
    # Itt lesz a rács (grid)
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown('<div class="card"><h4>👑 Kitti (Top 1)</h4><p>Az eheti győztes.</p></div>', unsafe_allow_html=True)
    with col2:
        st.markdown('<div class="card"><h4>🥈 Szandra</h4><p>Új feltörekvő.</p></div>', unsafe_allow_html=True)
    with col3:
        st.markdown('<div class="card"><h4>🥉 Niki</h4><p>Közönségkedvenc.</p></div>', unsafe_allow_html=True)

def show_models():
    st.title("💃 Összes Modell")
    display_ad("modellek_fent")
    st.write("Itt tudsz majd keresni a lányok között kategóriák szerint.")
    # Ide jön majd a kereső motor

def show_admin():
    st.title("🛠️ Admin Panel")
    st.write("Üdv a vezérlőpultban, Főnök!")
    
    tab1, tab2, tab3 = st.tabs(["Új Hír (AI)", "Modell Hozzáadása", "Beállítások"])
    
    with tab1:
        st.subheader("📰 AI Hírszerkesztő")
        st.write("Itt fogjuk generálni a cikkeket a Twitter/Reddit alapján.")
        if st.button("AI Hírgenerálás Indítása"):
            st.warning("Ehhez még kell az OpenAI kód a következő lépésben!")
            
    with tab2:
        st.subheader("Modell feltöltése")
        st.text_input("Név")
        st.text_input("OnlyFans Link")
        st.button("Mentés")

# --- FŐ VEZÉRLÉS (NAVIGÁCIÓ) ---

# Oldalsáv menü
with st.sidebar:
    st.title("Navigáció")
    page = st.radio("Menü", ["Főoldal", "Modellek / Kereső", "Admin Belépés"])
    st.markdown("---")
    st.caption("Hungarian Fans Hub v1.0")

# Oldal váltás logika
if page == "Főoldal":
    show_home()
elif page == "Modellek / Kereső":
    show_models()
elif page == "Admin Belépés":
    if check_password():
        show_admin()