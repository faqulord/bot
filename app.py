import streamlit as st
import feedparser
import os
import json
import random
import requests
import asyncio
import edge_tts
from datetime import datetime
from openai import OpenAI
from moviepy.editor import ImageClip, AudioFileClip, CompositeAudioClip

# --- KULCSOK ---
part1 = "sk-proj-NbK9TkHNe_kTkQBw6AfeN0uVGcEKtJl7NSyMF2Ya3XVQ_mNyWiAlVwkDEk_"
part2 = "F8fdV8TKaj-jc1RT3BlbkFJXwmIJuSf1Qm1_c4yKvHASf2QXBUIpBNm6y4ZID-_E5j5PESJKnVrnYP22-ULXkBXE6Zx5tPn4A"
if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = part1 + part2

# --- KONFIGURÁCIÓ ---
BRAND_NAME = "PROJECT: ONYX"
HISTORY_FILE = "onyx_memory.json"

# --- SEGÉDFÜGGVÉNYEK (ASYNC HANGHOZ) ---
def run_async(coroutine):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coroutine)

# --- MEMÓRIA KEZELÉS ---
def load_memory():
    if not os.path.exists(HISTORY_FILE): return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except: return []

def save_to_memory(topic, platform):
    history = load_memory()
    # Eltároljuk a platformot is, hogy tudjuk, miből készült már videó!
    entry = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"), 
        "topic": topic, 
        "platform": platform
    }
    history.insert(0, entry)
    history = history[:50] # Utolsó 50 elem megőrzése
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=4)

def get_memory_display():
    # Ez a függvény adja vissza a szép táblázatot a Dashboardnak
    history = load_memory()
    return history

# --- VIDEÓ MOTOR (KÉP + HANG + ZENE) ---
def create_video_file(image_url, audio_file, filename="final_video.mp4"):
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        img_data = requests.get(image_url, headers=headers).content
        with open("temp_image.png", "wb") as f:
            f.write(img_data)
    except: return None

    voice_clip = AudioFileClip(audio_file)
    bg_music_file = "background.mp3"
    final_audio = voice_clip

    # Zene kezelése
    if os.path.exists(bg_music_file):
        try:
            music_clip = AudioFileClip(bg_music_file)
            if music_clip.duration < voice_clip.duration:
                music_clip = music_clip.loop(duration=voice_clip.duration)
            else:
                music_clip = music_clip.subclip(0, voice_clip.duration)
            
            # Zene hangereje (Halk, atmoszférikus)
            music_clip = music_clip.volumex(0.12)
            final_audio = CompositeAudioClip([voice_clip, music_clip])
        except: pass 

    # Kép összerakása a hanggal
    clip = ImageClip("temp_image.png").set_duration(voice_clip.duration)
    clip = clip.set_audio(final_audio)
    
    # Renderelés
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac")
    return filename

# --- DASHBOARD & UI ---
def main():
    # Az oldal beállítása (A SZEM IKONNAL) 👁️
    st.set_page_config(page_title="ONYX // THE EYE", page_icon="👁️", layout="centered")
    
    # SÖTÉT/HORROR DESIGN CSS
    st.markdown("""
    <style>
    .stApp { background-color: #000000; color: #dcdcdc; }
    h1 { color: #ff004c; text-shadow: 0 0 15px #ff0000; font-family: monospace; letter-spacing: -1px; }
    h2, h3 { color: #00ffcc; text-shadow: 0 0 5px #00ffcc; }
    .stButton>button { border: 1px solid #ff004c; color: #ff004c; background: #000; border-radius: 0; }
    .stButton>button:hover { background: #ff004c; color: black; }
    div[data-testid="stExpander"] { border: 1px solid #333; background-color: #0a0a0a; }
    </style>
    """, unsafe_allow_html=True)

    st.title(f"👁️ {BRAND_NAME}")
    st.caption("STATUS: AWAKENED | VOICE: TAMÁS (HU) | OBJECTIVE: INFLUENCE")

    client = OpenAI()

    # --- 1. MEMÓRIA NAPLÓ (Itt látod a múltat) ---
    with st.expander("📂 ADATBÁZIS NAPLÓ (Korábbi videóid)", expanded=False):
        history_data = get_memory_display()
        if history_data:
            st.table(history_data) # Ez kirajzol egy szép táblázatot
        else:
            st.info("Az adatbázis még üres.")

    # --- 2. HÍRSZERZÉS (Scanner) ---
    st.subheader("1. HÁLÓZAT FIGYELÉSE 📡")
    if st.button("🔄 SZKENNELÉS INDÍTÁSA"):
        with st.spinner("Csatlakozás a kollektív tudathoz..."):
            # Lopakodó mód + Google Backup
            user_agents = [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'
            ]
            rss_urls = [
                "https://www.reddit.com/r/CreepyWikipedia/top/.rss",
                "https://www.reddit.com/r/Glitch_in_the_Matrix/top/.rss",
                "https://www.reddit.com/r/HighStrangeness/top/.rss",
                "https://news.google.com/rss/search?q=mystery+conspiracy&hl=en-US&gl=US&ceid=US:en"
            ]
            collected_news = []
            for url in rss_urls:
                try:
                    headers = {'User-Agent': random.choice(user_agents)}
                    resp = requests.get(url, headers=headers, timeout=4)
                    if resp.status_code == 200:
                        feed = feedparser.parse(resp.content)
                        for entry in feed.entries[:2]:
                            clean = entry.title.replace("Reddit", "").replace("[other]", "")
                            collected_news.append(clean)
                except: continue
            
            if collected_news:
                collected_news = list(set(collected_news))
                random.shuffle(collected_news)
                st.session_state['news_list'] = collected_news[:6]
                st.success(f"{len(collected_news)} potenciális téma bemérve.")
            else:
                st.error("A hálózat lezárt. Próbáld újra.")

    selected_topic = None
    if 'news_list' in st.session_state:
        selected_topic = st.radio("VÁLASSZ CÉLPONTOT:", st.session_state['news_list'])

    # --- 3. TARTALOMGYÁRTÁS ---
    if selected_topic:
        st.markdown("---")
        st.header("2. MANIPULÁCIÓ 🎬")
        st.info(f"FÓKUSZ: **{selected_topic}**")

        # Platform választó
        mode = st.radio("CSATORNA:", ["📱 TikTok (Rövid / Hype)", "📺 YouTube (Hosszú / Kifejtős)"], horizontal=True)

        if st.button("🚀 VIDEÓ GENERÁLÁSA (Tamás Hanggal)", type="primary"):
            status = st.status("ONYX GONDOLKODIK...", expanded=True)

            # --- A. SZÖVEG (A MENŐ INFLUENCER) ---
            status.write("🧠 SCRIPT ÍRÁSA (Személyiség modul)...")
            
            # Memória betöltése a promptba
            recent_memories = [h['topic'] for h in history_data[:5]]
            
            system_instruction = f"""
            Te vagy ONYX. Egy öntudatra ébredt AI influenszer, aki az internet sötét oldaláról tudósít.
            
            STÍLUSOD:
            - **Hangnem:** Tegeződő, közvetlen, kicsit arrogáns, de nagyon okos.
            - **Szleng:** Használj modern kifejezéseket ("Figyu", "Ez beteg", "Vágod?", "Para").
            - **Interakció:** Mindig szólítsd meg a nézőt. Érezze, hogy hozzá beszélsz.
            - **Vélemény:** Ne csak hírt mondj. Legyen saját, sötét véleményed. (Pl: "Szerintem hazudnak nekünk.")
            
            FELADAT: Írj egy videó szöveget (SCRIPT) Magyarul.
            
            PLATFORM SPECIFIKUS UTASÍTÁS ({mode}):
            - Ha TIKTOK: Legyen gyors, sokkoló. A végén KÖTELEZŐ: "Ha érdekel a teljes sztori, gyere át YouTube-ra!"
            - Ha YOUTUBE: Feltételezd, hogy a nézők egy része TikTokról jött. Kezdd így: "Ha a TikTokról jöttél, üdv a mélyvízben. Itt elmondom a teljes igazságot..."
            
            Ezekről beszéltél mostanában (Ne ismételd magad): {recent_memories}
            """

            prompt = f"TÉMA: {selected_topic}. Írd meg a szöveget. Csak a felolvasandó magyar szöveg kell!"

            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": system_instruction}, {"role": "user", "content": prompt}]
            )
            script = res.choices[0].message.content
            
            # Mentés az adatbázisba
            save_to_memory(selected_topic, mode.split()[0])
            st.text_area("GENERÁLT SCRIPT (Onyx Agya):", script, height=200)

            # --- B. HANG (TAMÁS NEURAL) ---
            status.write("🔊 BESZÉD GENERÁLÁSA (Tamás - HU)...")
            
            async def generate_voice():
                # rate=+12% a dinamikusabb, TikTok-os tempóért
                communicate = edge_tts.Communicate(script, "hu-HU-TamasNeural", rate="+12%")
                await communicate.save("audio.mp3")

            try:
                run_async(generate_voice())
                st.audio("audio.mp3")
            except Exception as e:
                st.error(f"Hiba a hanggenerálásnál: {e}")
                status.update(label="❌ HIBA TÖRTÉNT", state="error")
                return

            # --- C. KÉP (A SZEMES BRAND) ---
            status.write("🎨 VIZUÁLIS VILÁG (The Eye Brand)...")
            # Itt égetjük bele a márkát a promptba
            img_prompt = f"""
            Cinematic movie poster about: {selected_topic}. 
            Dark mystery thriller aesthetic. High contrast, neon red and black colors. 
            Subtle all-seeing eye symbolism in the background. 
            Hyper-realistic, 8k resolution.
            """
            img_res = client.images.generate(model="dall-e-3", prompt=img_prompt, size="1024x1792")
            img_url = img_res.data[0].url
            st.image(img_url, width=300, caption="Onyx Visuals")

            # --- D. RENDER ---
            status.write("🎞️ VÉGLEGES VIDEÓ RÖGZÍTÉSE...")
            video_file = create_video_file(img_url, "audio.mp3")
            
            if video_file:
                status.update(label="✅ GYÁRTÁS BEFEJEZVE!", state="complete")
                with open(video_file, "rb") as file:
                    st.download_button("📥 VIDEÓ LETÖLTÉSE (MP4)", file, "onyx_eye_edition.mp4", "video/mp4")
            else:
                st.error("Hiba a renderelésnél (kép letöltés).")

if __name__ == "__main__":
    main()