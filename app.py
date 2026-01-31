import streamlit as st
import praw
import os
from openai import OpenAI
from elevenlabs.client import ElevenLabs
# MoviePy importok a videóhoz (egyszerűsített vágás)
# Megjegyzés: Streamlit Cloudon ez a rész erőforrásigényes!

# --- 1. BEJELENTKEZÉS KÉPERNYŐ ---
def login():
    st.title("🔐 Videó Birodalom Login")
    password = st.text_input("Jelszó", type="password")
    if password == "admin123":  # Ezt a jelszót írd át nyugodtan!
        st.session_state["logged_in"] = True
        st.success("Sikeres belépés!")
        st.rerun()
    elif password:
        st.error("Hibás jelszó!")

# --- 2. FŐ DASHBOARD ---
def dashboard():
    st.title("🎬 Automata Videó Generátor")
    st.write("Forrás: Reddit Trending -> TikTok & YouTube Shorts")

    # API Kulcsok bekérése (vagy Secrets-ből olvasása)
    # A telefonos egyszerűség kedvéért itt az oldalsávon is megadhatod
    with st.sidebar:
        st.header("⚙️ API Beállítások")
        openai_key = st.text_input("OpenAI API Key", type="password")
        eleven_key = st.text_input("ElevenLabs API Key", type="password")
        # Reddit kulcsok (ez kell a hírekhez)
        reddit_id = st.text_input("Reddit Client ID")
        reddit_secret = st.text_input("Reddit Client Secret")
        
    if not (openai_key and eleven_key and reddit_id and reddit_secret):
        st.warning("⚠️ Kérlek töltsd ki az API kulcsokat az oldalsávon!")
        return

    # Kliensek indítása
    client = OpenAI(api_key=openai_key)
    el_client = ElevenLabs(api_key=eleven_key)
    reddit = praw.Reddit(
        client_id=reddit_id,
        client_secret=reddit_secret,
        user_agent="VideoBot/1.0"
    )

    st.divider()

    # --- A. REDDIT HÍREK LEKÉRÉSE ---
    st.subheader("1. Téma Vadászat (Reddit)")
    
    col1, col2 = st.columns(2)
    with col1:
        subreddit = st.selectbox("Subreddit", ["hungary", "todayilearned", "news", "interestingasfuck"])
    with col2:
        filter_type = st.selectbox("Szűrés", ["Hot (Legfelkapottabb)", "Top (Nap legjobbja)"])

    if st.button("🔥 Friss Hírek Lekérése"):
        with st.spinner("Reddit pásztázása..."):
            if filter_type == "Hot":
                posts = reddit.subreddit(subreddit).hot(limit=5)
            else:
                posts = reddit.subreddit(subreddit).top(time_filter="day", limit=5)
            
            st.session_state["posts"] = []
            for post in posts:
                st.session_state["posts"].append(f"{post.title} (Upvote: {post.score})")
            st.success("Témák betöltve!")

    # Téma kiválasztása
    selected_topic = ""
    if "posts" in st.session_state:
        selected_topic = st.radio("Válassz témát a listából:", st.session_state["posts"])

    st.divider()

    # --- B. VIDEÓ GENERÁLÁS ---
    st.subheader("2. Tartalom Generálás")
    
    target_platform = st.radio("Hova készül?", ["TikTok / Shorts (Magyar)", "YouTube (Angol)"])

    if st.button("🚀 VIDEÓ LEGYÁRTÁSA (Start)"):
        if not selected_topic:
            st.error("Válassz előbb témát!")
            return

        status = st.empty()
        
        # 1. Lépés: Forgatókönyv
        status.info("📝 1/4: AI írja a szöveget...")
        
        system_msg = "You are a viral content creator."
        if "Magyar" in target_platform:
            prompt = f"Írj egy nagyon rövid, 30 másodperces, figyelemfelkeltő TikTok szöveget erről a hírről magyarul: '{selected_topic}'. Ne legyen benne emoji, csak a felolvasandó szöveg."
        else:
            prompt = f"Write a short 30-second viral script for YouTube Shorts about this topic: '{selected_topic}'. English. No emojis, just narration."

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": system_msg}, {"role": "user", "content": prompt}]
        )
        script_text = response.choices[0].message.content
        st.text_area("Generált szöveg:", script_text)

        # 2. Lépés: Hang
        status.info("🔊 2/4: Hang generálása (ElevenLabs)...")
        # Figyelem: Itt egy alapértelmezett Voice ID-t használok, ezt cseréld a sajátodra!
        try:
            audio = el_client.generate(text=script_text, voice="pNInz6obpgDQGcFmaJgB", model="eleven_multilingual_v2")
            with open("audio.mp3", "wb") as f:
                for chunk in audio:
                    f.write(chunk)
            st.audio("audio.mp3")
        except Exception as e:
            st.error(f"Hiba a hangnál: {e}")
            return

        # 3. Lépés: Kép (DALL-E 3)
        status.info("🎨 3/4: Borítókép generálása...")
        img_response = client.images.generate(
            model="dall-e-3",
            prompt=f"Cinematic, mysterious, high quality vertical image about: {selected_topic}",
            size="1024x1792"
        )
        img_url = img_response.data[0].url
        st.image(img_url, caption="Generált háttér")
        
        # Itt lenne a 4. Lépés (MoviePy vágás)
        # Mivel a felhőben a vágás bonyolult a telepítések miatt,
        # az MVP (első verzió) itt megáll és kiadja neked az elemeket (Hang + Kép + Szöveg).
        # Ha a weboldal stabil, a vágást is bekapcsolhatjuk.
        
        status.success("✅ KÉSZ! Töltsd le a hangot és a képet, és a CapCut-ban egy kattintás összerakni (amíg nincs laptopod).")

# --- INDÍTÁS ---
if "logged_in" not in st.session_state:
    st.session_state["logged_in"] = False

if st.session_state["logged_in"]:
    dashboard()
else:
    login()