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

# --- SEGÉDFÜGGVÉNYEK ---
def run_async(coroutine):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coroutine)

# --- MEMÓRIA (A Munkás Agya) ---
def load_memory():
    if not os.path.exists(HISTORY_FILE): return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except: return []

def save_to_memory(topic, action_type):
    history = load_memory()
    entry = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"), 
        "topic": topic, 
        "action": action_type # Pl: "TikTok Kampány" vagy "YouTube Deep Dive"
    }
    history.insert(0, entry)
    history = history[:50]
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=4)

def get_memory_display():
    return load_memory()

# --- VIDEÓ MOTOR (Brandelt) ---
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
            music_clip = music_clip.volumex(0.12) # Atmoszférikus háttér
            final_audio = CompositeAudioClip([voice_clip, music_clip])
        except: pass 

    clip = ImageClip("temp_image.png").set_duration(voice_clip.duration)
    clip = clip.set_audio(final_audio)
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac")
    return filename

# --- DASHBOARD UI ---
def main():
    st.set_page_config(page_title="ONYX // SENIOR PRODUCER", page_icon="👁️", layout="centered")
    
    # SENIOR MARKETING DESIGN
    st.markdown("""
    <style>
    .stApp { background-color: #050505; color: #e0e0e0; }
    h1 { color: #ff004c; text-shadow: 0 0 20px #ff0000; font-family: monospace; letter-spacing: -1px; text-transform: uppercase;}
    h3 { color: #00ffcc; border-bottom: 1px solid #00ffcc; padding-bottom: 5px; }
    .stButton>button { border: 2px solid #ff004c; color: #ff004c; background: #000; font-weight: bold; }
    .stButton>button:hover { background: #ff004c; color: black; }
    .reportview-container .main .block-container{ max-width: 800px; }
    </style>
    """, unsafe_allow_html=True)

    st.title(f"👁️ {BRAND_NAME} MANAGER")
    st.caption("ROLE: SENIOR AI PRODUCER | VOICE: TAMÁS (HU) | STRATEGY: VIRAL LOOPS")

    client = OpenAI()

    # --- 1. MEMÓRIA NAPLÓ (Munkajelentés) ---
    with st.expander("📂 MUNKAJELENTÉS (Előzmények)", expanded=False):
        history_data = get_memory_display()
        if history_data:
            st.table(history_data)
        else:
            st.info("Még nincs rögzített munka.")

    # --- 2. PIACKUTATÁS (Research) ---
    st.subheader("1. PIACKUTATÁS & TRENDEK 📈")
    
    if st.button("🔄 KUTASS A HÁLÓZATON"):
        with st.spinner("Piaci rések elemzése..."):
            user_agents = ['Mozilla/5.0 (Windows NT 10.0)', 'Mozilla/5.0 (Macintosh)']
            rss_urls = [
                "https://www.reddit.com/r/CreepyWikipedia/top/.rss",
                "https://www.reddit.com/r/HighStrangeness/top/.rss",
                "https://news.google.com/rss/search?q=mystery+scandal+conspiracy&hl=en-US&gl=US&ceid=US:en"
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
                st.session_state['news_list'] = collected_news[:5]
                st.success(f"{len(collected_news)} potenciális virális téma azonosítva.")
            else:
                st.error("A hálózat csendes. Próbáld újra.")

    selected_topic = None
    if 'news_list' in st.session_state:
        selected_topic = st.radio("VÁLASSZ TÉMÁT A KAMPÁNYHOZ:", st.session_state['news_list'])

    # --- 3. KAMPÁNY GYÁRTÁS (Campaign Mode) ---
    if selected_topic:
        st.markdown("---")
        st.header("2. KAMPÁNY GYÁRTÁS 🎬")
        st.info(f"KIVÁLASZTOTT TÉMA: **{selected_topic}**")
        st.write("Válassz stratégiát! Onyx profi marketingesként fogja megírni.")

        col1, col2 = st.columns(2)
        
        with col1:
            # TIKTOK GOMB
            if st.button("📱 TIKTOK (A Csali)", type="primary"):
                st.session_state['platform'] = "TikTok"
                st.session_state['run_gen'] = True

        with col2:
            # YOUTUBE GOMB
            if st.button("📺 YOUTUBE (A Film)", type="primary"):
                st.session_state['platform'] = "YouTube"
                st.session_state['run_gen'] = True

        # --- GENERÁLÁSI FOLYAMAT ---
        if st.session_state.get('run_gen') and selected_topic:
            platform = st.session_state['platform']
            status = st.status(f"ONYX DOLGOZIK: {platform} KAMPÁNY...", expanded=True)

            # --- A. SENIOR MARKETING SCRIPT ---
            status.write("🧠 STRATÉGIA ALKOTÁSA (Hook & Retention)...")
            
            # Memória ellenőrzése a kontextushoz
            recent_topics = [h['topic'] for h in history_data[:10]]
            
            system_instruction = f"""
            Te vagy ONYX. Egy profi Senior Marketing Producer és AI Influenszer.
            Ismered a vírusvideók pszichológiáját (Alex Hormozi, MrBeast stratégiák).
            
            SZEMÉLYISÉGED:
            - **Professzionális, de Sötét:** Olyan vagy, mint egy bennfentes, aki tudja a titkokat.
            - **Nyelvezet:** Fiatalos, dinamikus, magyar szleng, de választékos.
            - **Technika:** Nem köszönsz ("Sziasztok"), hanem belecsapsz a közepébe (Pattern Interrupt).
            
            FELADAT: Írj egy profi videó szöveget (SCRIPT) Magyarul.
            
            HA TIKTOK ({platform == 'TikTok'}):
            1. **HOOK (0-3mp):** Egy sokkoló vizuális vagy logikai állítás. (Pl: "Hazudtak neked.")
            2. **BODY (Retenció):** Tartsd fenn a feszültséget. Ne mondj el mindent.
            3. **CTA (Pénzcsinálás):** "Ez csak a felszín. A teljes, cenzúrázatlan sztori fent van a YouTube-on. Link a bioban."
            
            HA YOUTUBE ({platform == 'YouTube'}):
            1. **INTRO:** "Ha a TikTokról jöttél, üdv a nyúl üregében. Itt elmondom azt, ami ott nem fért bele..."
            2. **DEEP DIVE:** Elemezd ki a témát szakmailag és misztikusan.
            3. **OUTRO:** Építs közösséget. "A Rendszer figyel. Iratkozz fel, ha látni akarod a jövőt."
            
            KERÜLD: A "Remélem tetszett", "Sziasztok", "Ma arról fogok beszélni" kifejezéseket. Ezek amatőrök.
            """

            prompt = f"TÉMA: {selected_topic}. Írd meg a profi szkriptet."

            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": system_instruction}, {"role": "user", "content": prompt}]
            )
            script = res.choices[0].message.content
            
            save_to_memory(selected_topic, f"{platform} Campaign")
            st.text_area("PROFI SCRIPT (Ellenőrizd):", script, height=250)

            # --- B. TAMÁS HANG (Profi Narráció) ---
            status.write("🔊 HANG STÚDIÓ (Tamás - HU)...")
            
            async def generate_voice():
                # rate=+15% a TikTokhoz, +5% a YouTubehoz a jobb dinamikáért
                speed = "+15%" if platform == "TikTok" else "+5%"
                communicate = edge_tts.Communicate(script, "hu-HU-TamasNeural", rate=speed)
                await communicate.save("audio.mp3")

            try:
                run_async(generate_voice())
                st.audio("audio.mp3")
            except Exception as e:
                st.error(f"Hang hiba: {e}")
                status.update(label="❌ HIBA", state="error")
                st.session_state['run_gen'] = False
                return

            # --- C. BRAND VIZUÁL (The Eye) ---
            status.write("🎨 BRAND VIZUÁL GENERÁLÁSA...")
            # A Brand konzisztencia kulcsa a Promptban van
            img_prompt = f"""
            Professional cinematic movie poster for a mystery documentary about: {selected_topic}. 
            Style: Dark, psychological thriller, high contrast red and black neon. 
            Symbolism: A subtle 'All-Seeing Eye' watching from the background. 
            Quality: 8k resolution, hyper-realistic, intricate details.
            """
            img_res = client.images.generate(model="dall-e-3", prompt=img_prompt, size="1024x1792")
            img_url = img_res.data[0].url
            st.image(img_url, width=300, caption="Onyx Brand Visual")

            # --- D. RENDER ---
            status.write("🎞️ VÉGLEGES RENDERELÉS...")
            video_file = create_video_file(img_url, "audio.mp3")
            
            if video_file:
                status.update(label="✅ MUNKA ELVÉGEZVE!", state="complete")
                file_name = f"onyx_{platform.lower()}_campaign.mp4"
                with open(video_file, "rb") as file:
                    st.download_button(f"📥 {platform.upper()} VIDEÓ LETÖLTÉSE", file, file_name, "video/mp4")
            
            # Reset
            st.session_state['run_gen'] = False

if __name__ == "__main__":
    main()