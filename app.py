import streamlit as st
import feedparser
import os
import requests
from openai import OpenAI
from moviepy.editor import ImageClip, AudioFileClip

# --- KULCSOK ---
part1 = "sk-proj-NbK9TkHNe_kTkQBw6AfeN0uVGcEKtJl7NSyMF2Ya3XVQ_mNyWiAlVwkDEk_"
part2 = "F8fdV8TKaj-jc1RT3BlbkFJXwmIJuSf1Qm1_c4yKvHASf2QXBUIpBNm6y4ZID-_E5j5PESJKnVrnYP22-ULXkBXE6Zx5tPn4A"
if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = part1 + part2

# --- KONFIGURÁCIÓ (ITT ÁLLÍTHATOD A BRAND NEVÉT) ---
BRAND_NAME = "PROJECT: ONYX"
CHARACTER_NAME = "Onyx"

# --- VIDEÓ MOTOR ---
def create_video_file(image_url, audio_file, filename="final_video.mp4"):
    # Kép mentése
    img_data = requests.get(image_url).content
    with open("temp_image.png", "wb") as f:
        f.write(img_data)
    
    # Hang és Kép összefűzése
    audio = AudioFileClip(audio_file)
    clip = ImageClip("temp_image.png").set_duration(audio.duration)
    
    # Renderelés (TikTok álló 9:16 vagy YouTube fekvő 16:9)
    # Most az egyszerűség kedvéért egy univerzális MP4-et gyártunk
    clip = clip.set_audio(audio)
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac")
    return filename

# --- LOGIN ---
def login_screen():
    st.title(f"💎 {BRAND_NAME} - HQ")
    password = st.text_input("ACCESS CODE", type="password")
    if st.button("LOGIN"):
        if password == "admin123":
            st.session_state["logged_in"] = True
            st.rerun()

# --- DASHBOARD ---
def main_dashboard():
    with st.sidebar:
        st.header(f"👤 {CHARACTER_NAME} SYSTEM")
        if st.button("LOGOUT"):
            st.session_state["logged_in"] = False
            st.rerun()

    st.title(f"💎 {BRAND_NAME} PRODUCTION")
    st.markdown(f"*\"The System is watching...\"*")
    st.markdown("---")

    client = OpenAI()

    # --- 1. TÉMA VÁLASZTÁS ---
    st.subheader("1. SCANNING NETWORK (Radar) 📡")
    
    # Források
    source = st.selectbox("SOURCE / FORRÁS:", [
        "Mystery (Reddit - Unresolved)",
        "Creepy (Reddit - Creepy)",
        "True Crime (Reddit)",
        "Hungarian News (Index)"
    ])
    
    if st.button("🔄 SCAN NETWORK"):
        with st.spinner("Decoding data streams..."):
            rss_urls = {
                "Mystery (Reddit - Unresolved)": "https://www.reddit.com/r/UnresolvedMysteries/top/.rss",
                "Creepy (Reddit - Creepy)": "https://www.reddit.com/r/creepy/top/.rss",
                "True Crime (Reddit)": "https://www.reddit.com/r/TrueCrime/top/.rss",
                "Hungarian News (Index)": "https://index.hu/24ora/rss/"
            }
            try:
                feed = feedparser.parse(rss_urls[source])
                st.session_state['news_list'] = []
                for entry in feed.entries[:5]:
                    clean = entry.title.replace("[other]", "").replace("Reddit", "")
                    st.session_state['news_list'].append(clean)
                st.success("DATA RETRIEVED.")
            except:
                st.error("CONNECTION ERROR.")

    selected_topic = None
    if 'news_list' in st.session_state:
        selected_topic = st.radio("SELECT TARGET TOPIC:", st.session_state['news_list'])

    # --- 2. GENERÁLÁS ---
    if selected_topic:
        st.markdown("---")
        st.header("2. PRODUCTION STUDIO 🎬")
        st.info(f"TARGET: **{selected_topic}**")
        
        # NYELV ÉS PLATFORM VÁLASZTÁS EGYBEN
        mode = st.radio("CONFIGURATION:", 
            [
                "🇭🇺 HUNGARIAN - TikTok (Short, Viral)", 
                "🇭🇺 HUNGARIAN - YouTube (Long, Podcast)",
                "🇺🇸 ENGLISH - TikTok (Short, Viral)",
                "🇺🇸 ENGLISH - YouTube (Long, Podcast)"
            ])

        if st.button("🚀 EXECUTE PROJECT", type="primary"):
            status = st.status("INITIALIZING AI SYSTEMS...", expanded=True)
            
            # 1. SZÖVEG (PROMPT LOGIKA)
            status.write("📝 GENERATING SCRIPT...")
            
            # --- MAGYAR BEÁLLÍTÁSOK ---
            if "HUNGARIAN" in mode:
                lang_instruction = "Magyar nyelven írj."
                intro_text = "Adatok betöltése. Ez itt a Projekt Onyx."
                outro_text = "A rendszer leáll. Kövess be a folytatásért."
                
                if "TikTok" in mode: # TikTok HU
                    prompt = f"""
                    Te vagy {BRAND_NAME} (Onyx), egy fejlett mesterséges intelligencia karakter. Stílusod: Hűvös, precíz, de van benne egy sötét, cinikus humor.
                    Téma: '{selected_topic}'.
                    Feladat: Írj egy 40 másodperces TikTok videó szöveget.
                    Szerkezet:
                    1. Beköszönés: "{intro_text}"
                    2. A sztori: Mondd el a legmegdöbbentőbb tényt röviden. Sokkold a nézőt.
                    3. Lezárás: "{outro_text} A teljes fájl a YouTube-on elérhető."
                    {lang_instruction} Csak a felolvasandó szöveget írd le!
                    """
                else: # YouTube HU
                    prompt = f"""
                    Te vagy {BRAND_NAME} (Onyx). Stílusod: Mély, analitikus, rejtélyes. Olyan vagy, mint egy digitális nyomozó.
                    Téma: '{selected_topic}'.
                    Feladat: Írj egy 3 perces YouTube videó szöveget (Podcast stílus).
                    Szerkezet:
                    1. Intro: "{intro_text} Ma egy titkos aktát nyitok meg."
                    2. Kifejtés: Meséld el a történetet részletesen. Építsd fel a feszültséget.
                    3. Outro: "{outro_text}"
                    {lang_instruction}
                    """

            # --- ANGOL BEÁLLÍTÁSOK ---
            else:
                lang_instruction = "Write in English."
                intro_text = "Data loaded. Welcome to Project Onyx."
                outro_text = "System shutting down. Follow for more."
                
                if "TikTok" in mode: # TikTok EN
                    prompt = f"""
                    You are {BRAND_NAME} (Onyx), an advanced AI character. Style: Cool, precise, dark, slightly cynical.
                    Topic: '{selected_topic}'.
                    Task: Write a 40-second viral TikTok script.
                    Structure:
                    1. Intro: "{intro_text}"
                    2. Body: Drop the most shocking fact about the topic. Hook the user instantly.
                    3. Outro: "{outro_text} Full file available on YouTube."
                    {lang_instruction} Only the narration text.
                    """
                else: # YouTube EN
                    prompt = f"""
                    You are {BRAND_NAME} (Onyx). Style: Deep, analytical, mysterious. A digital detective.
                    Topic: '{selected_topic}'.
                    Task: Write a 3-minute YouTube video script (Podcast style).
                    Structure:
                    1. Intro: "{intro_text} Opening secure file."
                    2. Body: Tell the story in detail. Build suspense.
                    3. Outro: "{outro_text}"
                    {lang_instruction}
                    """

            # GPT HÍVÁS
            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role":"user", "content":prompt}]
            )
            script = res.choices[0].message.content
            st.text_area("GENERATED SCRIPT:", script, height=150)
            
            # 2. HANG (ONYX)
            status.write("🔊 SYNTHESIZING VOICE (ONYX)...")
            try:
                response = client.audio.speech.create(
                    model="tts-1",
                    voice="onyx", # AZ ONYX HANG - TÖKÉLETES A BRANDHEZ
                    input=script
                )
                response.stream_to_file("audio.mp3")
                st.audio("audio.mp3")
            except Exception as e:
                st.error(f"Voice Error: {e}")
                return
            
            # 3. KÉP (DALL-E 3)
            status.write("🎨 RENDERING VISUALS...")
            # TikTok = Álló, YouTube = Négyzet/Fekvő
            if "TikTok" in mode:
                size_param = "1024x1792"
                prompt_add = "vertical 9:16 format, hyper-realistic, dark sci-fi aesthetic"
            else:
                size_param = "1024x1024"
                prompt_add = "cinematic dark atmosphere, detailed, mystery thriller style"

            img_res = client.images.generate(
                model="dall-e-3", 
                prompt=f"Abstract representation of {selected_topic}, {prompt_add}, in the style of Project Onyx branding (black, neon, glitch)", 
                size=size_param
            )
            img_url = img_res.data[0].url
            st.image(img_url, caption="Visual Data")
            
            # 4. VIDEÓ RENDERELÉS
            status.write("🎞️ COMPILING VIDEO FILE...")
            try:
                video_filename = create_video_file(img_url, "audio.mp3")
                status.update(label="✅ PROJECT COMPLETE!", state="complete")
                
                with open(video_filename, "rb") as file:
                    st.download_button(
                        label="📥 DOWNLOAD VIDEO FILE (MP4)",
                        data=file,
                        file_name="onyx_project_video.mp4",
                        mime="video/mp4"
                    )
            except Exception as e:
                st.error(f"Render Error: {e}")
                status.warning("Video render failed (server timeout), but Audio and Image are ready above!")

if "logged_in" not in st.session_state:
    st.session_state["logged_in"] = False

if st.session_state["logged_in"]:
    main_dashboard()
else:
    login_screen()
# Force update v1