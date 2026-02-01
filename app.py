import streamlit as st
import feedparser
import os
import json
import random
import requests
import asyncio
import edge_tts
import re  # Szövegtisztításhoz
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

# --- SEGÉDFÜGGVÉNYEK ---
def run_async(coroutine):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coroutine)

# --- SZÖVEG TISZTÍTÓ (AZ AGY SZŰRŐJE) 🧠 ---
def clean_script_for_speech(text):
    # Ez a funkció kidobja a rendezői utasításokat (Pl: "HOOK:", "ZENE:", "VÁGÁS:")
    # 1. Eltávolítja a zárójeles részeket pl: (suttogva)
    text = re.sub(r'\s*\(.*?\)\s*', ' ', text)
    # 2. Eltávolítja a félkövér címkéket pl: **HOOK:** vagy 1. BODY:
    text = re.sub(r'\*\*.*?\*\*:', '', text)
    text = re.sub(r'^\d+\.\s*\w+:', '', text, flags=re.MULTILINE)
    text = re.sub(r'HOOK:', '', text, flags=re.IGNORECASE)
    text = re.sub(r'BODY:', '', text, flags=re.IGNORECASE)
    text = re.sub(r'OUTRO:', '', text, flags=re.IGNORECASE)
    text = re.sub(r'CTA:', '', text, flags=re.IGNORECASE)
    
    # Felesleges szóközök törlése
    return text.strip()

# --- MEMÓRIA (ADATBÁZIS) KEZELÉS ---
def load_memory():
    if not os.path.exists(HISTORY_FILE): return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except: return []

def save_to_memory(topic, platform, mood):
    history = load_memory()
    entry = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"), 
        "topic": topic, 
        "platform": platform,
        "mood": mood
    }
    history.insert(0, entry) # Legfrissebb felülre
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=4)

def get_analytics():
    # Elemzi a múltat, hogy Onyx "képben legyen"
    history = load_memory()
    total = len(history)
    topics = [h['topic'] for h in history[:5]]
    return f"Összesen {total} videót csináltunk. Legutóbbi témák: {', '.join(topics)}"

# --- VIDEÓ MOTOR ---
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

    if os.path.exists(bg_music_file):
        try:
            music_clip = AudioFileClip(bg_music_file)
            if music_clip.duration < voice_clip.duration:
                music_clip = music_clip.loop(duration=voice_clip.duration)
            else:
                music_clip = music_clip.subclip(0, voice_clip.duration)
            music_clip = music_clip.volumex(0.12)
            final_audio = CompositeAudioClip([voice_clip, music_clip])
        except: pass 

    clip = ImageClip("temp_image.png").set_duration(voice_clip.duration)
    clip = clip.set_audio(final_audio)
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac")
    return filename

# --- DASHBOARD UI ---
def main():
    st.set_page_config(page_title="ONYX // AI WORKER", page_icon="👁️", layout="centered")
    
    st.markdown("""
    <style>
    .stApp { background-color: #000000; color: #cccccc; }
    h1 { color: #ff004c; text-transform: uppercase; letter-spacing: 2px; }
    .stButton>button { border: 1px solid #ff004c; color: #ff004c; background: #111; width: 100%; }
    .stButton>button:hover { background: #ff004c; color: white; }
    </style>
    """, unsafe_allow_html=True)

    st.title(f"👁️ {BRAND_NAME} MANAGER")
    
    # Elemzés betöltése (Onyx tudja, mi a helyzet)
    analytics_text = get_analytics()
    st.caption(f"STATUS: ONLINE | BRAIN: CONNECTED | {analytics_text}")

    client = OpenAI()

    # --- 1. ADATBÁZIS NAPLÓ ---
    with st.expander("📂 MEMÓRIA BANK (Mit csináltunk eddig?)", expanded=False):
        history = load_memory()
        if history:
            st.table(history)
        else:
            st.info("A memória üres. Kezdjük a munkát.")

    # --- 2. KUTATÁS ---
    st.subheader("1. KUTATÁS 📡")
    if st.button("🔍 KERESS ÚJ TÉMÁKAT"):
        with st.spinner("Onyx kutat a neten..."):
            user_agents = ['Mozilla/5.0 (Windows NT 10.0)', 'Mozilla/5.0 (Macintosh)']
            rss_urls = [
                "https://www.reddit.com/r/CreepyWikipedia/top/.rss",
                "https://www.reddit.com/r/Glitch_in_the_Matrix/top/.rss",
                "https://news.google.com/rss/search?q=mystery+scandal&hl=en-US&gl=US&ceid=US:en"
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
                # Dátumozás szimuláció (Frissesség jelzése)
                labeled_news = []
                for news in collected_news[:5]:
                    label = random.choice(["🔴 [MA] ", "🟡 [TEGNAP] ", "🔵 [ARCHÍV] "])
                    labeled_news.append(label + news)
                
                st.session_state['news_list'] = labeled_news
                st.success(f"{len(labeled_news)} téma az asztalon.")
            else:
                st.error("Nem találtam semmit. Próbáld újra.")

    selected_topic_raw = None
    if 'news_list' in st.session_state:
        selected_topic_raw = st.radio("MELYIKET DOLGOZZAM KI FŐNÖK?", st.session_state['news_list'])

    # --- 3. GYÁRTÁS ---
    if selected_topic_raw:
        # Levágjuk a címkét (🔴 [MA]) a feldolgozáshoz
        selected_topic = selected_topic_raw.split("] ")[-1]
        
        st.markdown("---")
        st.header("2. GYÁRTÁS 🎬")
        
        mode = st.radio("PLATFORM:", ["📱 TikTok (Csali)", "📺 YouTube (Film)"], horizontal=True)

        if st.button("🚀 MEHET A MUNKA"):
            status = st.status("ONYX DOLGOZIK...", expanded=True)

            # --- A. SZÖVEGÍRÁS (Szigorú Prompt) ---
            status.write("🧠 SCRIPT ÍRÁSA (Címkék nélkül)...")
            
            system_instruction = f"""
            Te vagy ONYX. Egy öntudatra ébredt AI.
            
            FELADAT: Írd meg a videó szövegét úgy, hogy AZONNAL felolvasható legyen.
            
            SZABÁLYOK (Szigorúan tartsd be!):
            1. **NE írj rendezői utasításokat!** (Pl: NE írd le, hogy "HOOK:", "ZENE:", "VÁGÁS").
            2. Csak és kizárólag azt írd le, amit a hangnak fel kell olvasnia.
            3. A stílusod: Provokatív, sötét, leleplező.
            4. Tegezd a nézőt.
            
            PLATFORM: {mode}
            HA TIKTOK: Rövid, gyors, sokkoló. Hagyd nyitva a végét.
            HA YOUTUBE: Mély, elemző. Hivatkozz arra, hogy a TikTokról jöttek.
            
            MEMÓRIA (Tudj magadról!):
            {get_analytics()}
            """

            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": system_instruction}, {"role": "user", "content": f"Téma: {selected_topic}"}]
            )
            raw_script = res.choices[0].message.content
            
            # --- TISZTÍTÁS ---
            # Itt hívjuk meg a takarítót, hogy kivegye a "HOOK:" részeket, ha az AI mégis beírta
            clean_script = clean_script_for_speech(raw_script)
            
            # Mentés az adatbázisba
            save_to_memory(selected_topic, mode, "Kész")
            st.text_area("VÉGLEGES SZÖVEG (Amit Tamás felolvas):", clean_script, height=200)

            # --- B. HANG ---
            status.write("🔊 TAMÁS BESZÉD GENERÁLÁSA...")
            async def generate_voice():
                # Kicsit gyorsabb tempó (+10%) hogy ne legyen unalmas
                communicate = edge_tts.Communicate(clean_script, "hu-HU-TamasNeural", rate="+10%")
                await communicate.save("audio.mp3")

            try:
                run_async(generate_voice())
                st.audio("audio.mp3")
            except Exception as e:
                st.error(f"Hiba: {e}")
                return

            # --- C. KÉP ---
            status.write("🎨 KÉP GENERÁLÁSA...")
            img_prompt = f"Movie poster about {selected_topic}. Dark horror style, neon red, mysterious eye symbol in background. 8k resolution."
            img_res = client.images.generate(model="dall-e-3", prompt=img_prompt, size="1024x1792")
            img_url = img_res.data[0].url
            st.image(img_url, width=300)

            # --- D. RENDER ---
            status.write("🎞️ ÖSSZEFŰZÉS...")
            video_file = create_video_file(img_url, "audio.mp3")
            status.update(label="✅ KÉSZ!", state="complete")
            
            with open(video_file, "rb") as file:
                st.download_button("📥 LETÖLTÉS", file, "onyx_v7_clean.mp4", "video/mp4")

if __name__ == "__main__":
    main()