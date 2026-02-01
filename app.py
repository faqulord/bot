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

# --- ASYNC HELPER A HANGHOZ ---
# Ez a trükk kell, hogy a Streamlitben fusson az Edge TTS
def run_async(coroutine):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coroutine)

# --- MEMÓRIA ---
def load_memory():
    if not os.path.exists(HISTORY_FILE): return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except: return []

def save_to_memory(topic, mood):
    history = load_memory()
    entry = {"date": datetime.now().strftime("%Y-%m-%d"), "topic": topic, "mood": mood}
    history.insert(0, entry)
    history = history[:30]
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=4)

def get_recent_memory_text(limit=3):
    history = load_memory()
    if not history: return "Nincs előzmény."
    text = "Ezekről már volt szó (ne ismételd, csak utalj rá):\n"
    for item in history[:limit]:
        text += f"- {item['topic']}\n"
    return text

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
            
            # Halk zene (15%)
            music_clip = music_clip.volumex(0.15)
            final_audio = CompositeAudioClip([voice_clip, music_clip])
        except: pass 

    clip = ImageClip("temp_image.png").set_duration(voice_clip.duration)
    clip = clip.set_audio(final_audio)
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac")
    return filename

# --- DASHBOARD ---
def main():
    st.set_page_config(page_title="ONYX HUNGARY", page_icon="🇭🇺", layout="centered")
    
    st.markdown("""
    <style>
    .stApp { background-color: #000000; color: #e0e0e0; }
    h1 { color: #ffffff; text-shadow: 0 0 10px #00ffcc; }
    </style>
    """, unsafe_allow_html=True)

    st.title(f"💎 {BRAND_NAME} // NATIVE HUNGARIAN")
    st.caption("VOICE ENGINE: Tamás Neural (No Accent) | STATUS: ONLINE")

    client = OpenAI()

    # --- 1. SCANNER ---
    st.subheader("1. TÉMA VADÁSZAT 📡")
    if st.button("🔄 HÍREK LEKÉRÉSE"):
        with st.spinner("Reddit szkennelése..."):
            user_agents = ['Mozilla/5.0', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)']
            rss_urls = [
                "https://www.reddit.com/r/CreepyWikipedia/top/.rss",
                "https://www.reddit.com/r/HighStrangeness/top/.rss",
                "https://www.reddit.com/r/TrueCrime/top/.rss",
                "https://news.google.com/rss/search?q=mystery&hl=en-US&gl=US&ceid=US:en"
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
                st.success(f"{len(collected_news)} téma betöltve.")
            else:
                st.error("Nincs jel. Próbáld újra.")

    selected_topic = None
    if 'news_list' in st.session_state:
        selected_topic = st.radio("VÁLASSZ:", st.session_state['news_list'])

    # --- 2. PRODUKCIÓ ---
    if selected_topic:
        st.markdown("---")
        st.header("2. GYÁRTÁS 🎬")
        st.info(f"TÉMA: **{selected_topic}**")

        mode = st.radio("PLATFORM:", ["📱 TikTok (Pörgős)", "📺 YouTube (Mély)"], horizontal=True)

        if st.button("🚀 VIDEÓ GENERÁLÁSA (Tamás Hanggal)", type="primary"):
            status = st.status("ONYX DOLGOZIK...", expanded=True)

            # --- A. SZÖVEG ---
            status.write("📝 SZÖVEGÍRÁS (Influencer mód)...")
            
            system_instruction = f"""
            Te vagy ONYX, Magyarország legrejtélyesebb influenszere.
            
            A HANGOD / STÍLUSOD:
            - **Teljesen természetes:** Úgy írj, ahogy egy fiatal magyar youtuber beszél.
            - **Szleng:** Használhatsz: "srácok", "durva", "para", "kamu", "figyu".
            - **Élőbeszéd:** Nem felolvasol! Mesélsz.
            - **Interakció:** Kérdezz sokat. "Ti mit gondoltok?", "Szerintetek ez igaz?"
            
            FELÉPÍTÉS:
            1. **HOOK:** "Most figyelj...", "Ezt nem fogod elhinni..."
            2. **SZTORY:** Rövid, tömör, lényegre törő.
            3. **VÉLEMÉNY:** A te saját (cinikus/sötét) gondolatod.
            4. **CTA:** "Dobd be kommentbe a véleményed, és kövess be még több ilyenért!"
            
            TÉMA ELŐZMÉNYEK:
            {get_recent_memory_text(5)}
            """

            prompt = f"TÉMA: {selected_topic}. Írj egy {mode.split()[0]} videó szöveget. Csak a magyar szöveg kell!"

            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": system_instruction}, {"role": "user", "content": prompt}]
            )
            script = res.choices[0].message.content
            save_to_memory(selected_topic, "Kész")
            st.text_area("MAGYAR SZÖVEG:", script, height=200)

            # --- B. HANG (EDGE TTS - TAMÁS) ---
            status.write("🔊 HANG GENERÁLÁSA (Natív Magyar - Tamás)...")
            
            async def generate_voice():
                # hu-HU-TamasNeural a legjobb férfi hang
                # rate=+10% kicsit gyorsítja, hogy pörgősebb legyen
                communicate = edge_tts.Communicate(script, "hu-HU-TamasNeural", rate="+10%")
                await communicate.save("audio.mp3")

            try:
                run_async(generate_voice())
                st.audio("audio.mp3") # Hallgasd meg!
            except Exception as e:
                st.error(f"Hang hiba: {e}")
                return
            
            # --- C. KÉP ---
            status.write("🎨 KÉP GENERÁLÁSA...")
            img_prompt = f"Hyper-realistic cinematic shot regarding: {selected_topic}. Dark mystery thriller style, 8k, dramatic lighting."
            img_res = client.images.generate(model="dall-e-3", prompt=img_prompt, size="1024x1792")
            img_url = img_res.data[0].url
            st.image(img_url, width=300)

            # --- D. VIDEÓ ---
            status.write("🎞️ ÖSSZEFŰZÉS...")
            video_file = create_video_file(img_url, "audio.mp3")
            status.update(label="✅ KÉSZ A VIDEÓ!", state="complete")
            
            with open(video_file, "rb") as file:
                st.download_button("📥 LETÖLTÉS (Akcentus nélkül)", file, "onyx_hungarian.mp4", "video/mp4")

if __name__ == "__main__":
    main()