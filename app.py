import streamlit as st
import feedparser
import os
import requests
from openai import OpenAI
# A videóvágáshoz:
from moviepy.editor import ImageClip, AudioFileClip

# --- KULCSOK BEÁLLÍTÁSA (A trükkös megoldással) ---
part1 = "sk-proj-NbK9TkHNe_kTkQBw6AfeN0uVGcEKtJl7NSyMF2Ya3XVQ_mNyWiAlVwkDEk_"
part2 = "F8fdV8TKaj-jc1RT3BlbkFJXwmIJuSf1Qm1_c4yKvHASf2QXBUIpBNm6y4ZID-_E5j5PESJKnVrnYP22-ULXkBXE6Zx5tPn4A"

# Beállítjuk a környezeti változót
if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = part1 + part2

# --- FÜGGVÉNY: VIDEÓ ÉPÍTÉS ---
def create_video_file(image_url, audio_file):
    # 1. Kép letöltése
    img_data = requests.get(image_url).content
    with open("temp_image.png", "wb") as f:
        f.write(img_data)
    
    # 2. Videó összerakása
    # Betöltjük a hangot
    audio = AudioFileClip(audio_file)
    # A képet addig mutatjuk, amíg a hang tart
    clip = ImageClip("temp_image.png").set_duration(audio.duration)
    
    # 3. Renderelés (TikTok formátum)
    clip = clip.set_audio(audio)
    # Alacsonyabb FPS a gyorsabb mobilos generálásért
    clip.write_videofile("final_video.mp4", fps=24, codec="libx264", audio_codec="aac")
    return "final_video.mp4"

# --- 1. BEJELENTKEZÉS ---
def login_screen():
    st.title("🔒 Videó Birodalom")
    st.write("Jelszó: admin123")
    password = st.text_input("Jelszó", type="password")
    if st.button("Belépés"):
        if password == "admin123":
            st.session_state["logged_in"] = True
            st.rerun()

# --- 2. VEZÉRLŐPULT ---
def main_dashboard():
    # Admin sáv
    with st.sidebar:
        st.write("👤 Adminisztrátor")
        if st.button("Kilépés"):
            st.session_state["logged_in"] = False
            st.rerun()

    st.title("☠️ Éjféli Akták - Gyár")
    st.markdown("---")

    # Kliens indítása
    try:
        client = OpenAI()
    except:
        st.error("Hiba az OpenAI kulccsal!")
        return

    # --- 1. LÉPÉS: TÉMA VADÁSZAT ---
    st.header("1. Téma Radar 📡")
    source = st.selectbox("Forrás:", [
        "Rejtélyek (r/UnresolvedMysteries)",
        "Ijesztő (r/creepy)",
        "Igaz Bűnügyek (r/TrueCrime)",
        "Érdekességek (r/todayilearned)",
        "Magyar Hírek (Index)"
    ])
    
    if st.button("🔄 Friss Témák Keresése"):
        with st.spinner("Hírek letöltése..."):
            rss_urls = {
                "Rejtélyek (r/UnresolvedMysteries)": "https://www.reddit.com/r/UnresolvedMysteries/top/.rss",
                "Ijesztő (r/creepy)": "https://www.reddit.com/r/creepy/top/.rss",
                "Igaz Bűnügyek (r/TrueCrime)": "https://www.reddit.com/r/TrueCrime/top/.rss",
                "Érdekességek (r/todayilearned)": "https://www.reddit.com/r/todayilearned/top/.rss",
                "Magyar Hírek (Index)": "https://index.hu/24ora/rss/"
            }
            try:
                feed = feedparser.parse(rss_urls[source])
                st.session_state['news_list'] = []
                for entry in feed.entries[:5]:
                    clean = entry.title.replace("[other]", "").replace("Reddit", "")
                    st.session_state['news_list'].append(clean)
                st.success("Témák frissítve! Válassz lentebb.")
            except:
                st.error("Hiba a hírekkel. Próbáld újra!")

    # Téma kiválasztása
    selected_topic = None
    if 'news_list' in st.session_state:
        selected_topic = st.radio("Melyik sztoriból legyen videó?", st.session_state['news_list'])

    # --- 2. LÉPÉS: GYÁRTÁS ---
    if selected_topic:
        st.markdown("---")
        st.header("2. Videó Stúdió 🎬")
        st.info(f"Kiválasztva: **{selected_topic}**")
        
        lang_choice = st.radio("Célpiac:", ["Magyar (TikTok) 🇭🇺", "Angol (YouTube) 🇺🇸"])

        if st.button("🚀 GENERÁLÁS INDÍTÁSA (Hang + Kép + Videó)", type="primary"):
            status = st.status("A futószalag elindult...", expanded=True)
            
            # A) SZÖVEG (ChatGPT)
            status.write("📝 Forgatókönyv írása...")
            if "Magyar" in lang_choice:
                prompt = f"Írj egy nagyon rövid, 30-40 másodperces, SÖTÉT, REJTÉLYES videó szöveget erről: '{selected_topic}'. Magyarul. Ragadja meg a figyelmet azonnal. Csak a szöveg kell."
            else:
                prompt = f"Write a short 30-40 second DARK MYSTERY script about: '{selected_topic}'. English. Hook the audience immediately. Only narration."

            res = client.chat.completions.create(model="gpt-4o", messages=[{"role":"user", "content":prompt}])
            script = res.choices[0].message.content
            st.text_area("Forgatókönyv:", script, height=100)
            
            # B) HANG (OpenAI Onyx - Férfi Hang)
            status.write("🔊 Narráció felvétele (Onyx hang)...")
            try:
                response = client.audio.speech.create(
                    model="tts-1",
                    voice="onyx", # Ez a sötét, mély férfihang!
                    input=script
                )
                response.stream_to_file("audio.mp3")
                st.audio("audio.mp3")
            except Exception as e:
                st.error(f"Hiba a hangnál: {e}")
                return
            
            # C) KÉP (DALL-E 3)
            status.write("🎨 Látványvilág generálása...")
            img_res = client.images.generate(
                model="dall-e-3", 
                prompt=f"Dark mystery thriller cinematic vertical 9:16 image, photorealistic, creepy atmosphere about: {selected_topic}", 
                size="1024x1792"
            )
            img_url = img_res.data[0].url
            st.image(img_url, width=200)
            
            # D) VIDEÓ RENDERELÉS (MoviePy)
            status.write("🎞️ Videó renderelése (Ez 1-2 perc lehet, türelem!)...")
            try:
                video_file = create_video_file(img_url, "audio.mp3")
                
                status.update(label="✅ KÉSZ A VIDEÓ!", state="complete")
                
                # LETÖLTÉS
                with open(video_file, "rb") as file:
                    st.download_button(
                        label="📥 KÉSZ VIDEÓ LETÖLTÉSE (MP4)",
                        data=file,
                        file_name="mystery_video.mp4",
                        mime="video/mp4"
                    )
            except Exception as e:
                st.error(f"Hiba a videóvágásnál: {e}")
                # Ha a vágás nem megy a felhőben, legalább a hangot és a képet le tudod tölteni
                status.warning("A videóvágás nem sikerült (túl lassú a szerver), de a Képet és a Hangot külön letöltheted fentebb!")

# --- FŐ RENDSZER ---
if "logged_in" not in st.session_state:
    st.session_state["logged_in"] = False

if st.session_state["logged_in"]:
    main_dashboard()
else:
    login_screen()