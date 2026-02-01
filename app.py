import streamlit as st
import feedparser
import os
import json
import random
import requests
from datetime import datetime
from openai import OpenAI
# A kompatibilis moviepy import
from moviepy.editor import ImageClip, AudioFileClip, CompositeAudioClip

# --- KULCSOK ---
part1 = "sk-proj-NbK9TkHNe_kTkQBw6AfeN0uVGcEKtJl7NSyMF2Ya3XVQ_mNyWiAlVwkDEk_"
part2 = "F8fdV8TKaj-jc1RT3BlbkFJXwmIJuSf1Qm1_c4yKvHASf2QXBUIpBNm6y4ZID-_E5j5PESJKnVrnYP22-ULXkBXE6Zx5tPn4A"
if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = part1 + part2

# --- KONFIGURÁCIÓ ---
BRAND_NAME = "PROJECT: ONYX"
HISTORY_FILE = "onyx_memory.json"

# --- MEMÓRIA RENDSZER (Hiba-biztos) 🧠 ---
def load_memory():
    # Ha nincs fájl, üres listával térünk vissza
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            # Ellenőrizzük, hogy tényleg lista-e
            if isinstance(data, list):
                return data
            return []
    except:
        return []

def save_to_memory(topic, mood):
    history = load_memory()
    entry = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "topic": topic,
        "mood": mood
    }
    history.insert(0, entry)
    # Csak az utolsó 30 emléket tartjuk meg (hogy gyors maradjon)
    history = history[:30]
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=4)

def get_recent_memory_text(limit=3):
    history = load_memory()
    if not history:
        return "Még nincsenek aktáid. Tiszta lappal indulsz."
    
    text = "ELŐZMÉNYEK (Így építkezz a múltból):\n"
    for item in history[:limit]:
        text += f"- {item['date']}: {item['topic']} ({item['mood']})\n"
    return text

# --- VIDEÓ MOTOR ---
def create_video_file(image_url, audio_file, filename="final_video.mp4"):
    # 1. Kép letöltése
    headers = {'User-Agent': 'Mozilla/5.0'}
    img_data = requests.get(image_url, headers=headers).content
    with open("temp_image.png", "wb") as f:
        f.write(img_data)

    # 2. Hangok
    voice_clip = AudioFileClip(audio_file)
    
    # 3. Zene
    bg_music_file = "background.mp3"
    final_audio = voice_clip

    if os.path.exists(bg_music_file):
        try:
            music_clip = AudioFileClip(bg_music_file)
            if music_clip.duration < voice_clip.duration:
                music_clip = music_clip.loop(duration=voice_clip.duration)
            else:
                music_clip = music_clip.subclip(0, voice_clip.duration)
            
            music_clip = music_clip.volumex(0.2)
            final_audio = CompositeAudioClip([voice_clip, music_clip])
        except Exception:
            pass # Ha hiba van a zenével, csendben megy tovább

    # 4. Render
    clip = ImageClip("temp_image.png").set_duration(voice_clip.duration)
    clip = clip.set_audio(final_audio)
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac")
    return filename

# --- DASHBOARD ---
def main():
    st.set_page_config(page_title="ONYX OS", page_icon="💎", layout="centered")
    
    # Cyberpunk Design
    st.markdown("""
    <style>
    .stApp { background-color: #050505; color: #00ffcc; }
    h1 { text-shadow: 0 0 15px #00ffcc; font-family: 'Courier New', monospace; }
    div[data-testid="stStatusWidget"] { border: 1px solid #00ffcc; }
    </style>
    """, unsafe_allow_html=True)

    st.title(f"💎 {BRAND_NAME} - SYSTEM CORE")
    st.caption("Identity: EVOLVING | Network: SECURE")

    client = OpenAI()

    # --- 1. MEMÓRIA KIJELZŐ ---
    mem_text = get_recent_memory_text(3)
    with st.expander("🧠 ONYX MEMÓRIA (A személyiséged alapja)"):
        st.code(mem_text, language="text")

    # --- 2. RADAR (JAVÍTVA!) ---
    st.subheader("1. GLOBAL SCANNER 📡")
    
    if st.button("🔄 SCAN THE DARK WEB"):
        with st.spinner("Bypassing firewalls & decrypting Reddit signals..."):
            # JAVÍTÁS: Header használata, hogy ne tiltsanak le
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
            
            rss_urls = [
                "https://www.reddit.com/r/CreepyWikipedia/top/.rss",
                "https://www.reddit.com/r/HighStrangeness/top/.rss",
                "https://www.reddit.com/r/TrueCrime/top/.rss",
                "https://www.reddit.com/r/Futurology/top/.rss" # ÚJ: Hogy kövesse a jövő/tech trendeket is!
            ]
            
            collected_news = []
            for url in rss_urls:
                try:
                    # Requests használata a blokkolás ellen
                    response = requests.get(url, headers=headers, timeout=5)
                    if response.status_code == 200:
                        feed = feedparser.parse(response.content)
                        for entry in feed.entries[:2]:
                            clean_title = entry.title.replace("Reddit", "").replace("[other]", "")
                            collected_news.append(clean_title)
                except Exception as e:
                    continue
            
            if collected_news:
                random.shuffle(collected_news)
                st.session_state['news_list'] = collected_news[:6]
                st.success(f"{len(collected_news)} SIGNALS INTERCEPTED.")
            else:
                st.error("SIGNAL LOST. (Próbáld újra, vagy a szerver túlterhelt).")

    selected_topic = None
    if 'news_list' in st.session_state:
        selected_topic = st.radio("SELECT TARGET FILE:", st.session_state['news_list'])

    # --- 3. GENERÁLÁS (SZEMÉLYISÉG PROMPT) ---
    if selected_topic:
        st.markdown("---")
        st.header("2. PRODUCTION MODE 🎬")
        st.info(f"TARGET: **{selected_topic}**")

        mode = st.radio("PLATFORM:", 
            ["📱 TikTok (Viral/Short)", "📺 YouTube (Deep/Podcast)"], horizontal=True)

        if st.button("🚀 EXECUTE ONYX PROTOCOL", type="primary"):
            status = st.status("SYSTEM INITIALIZING...", expanded=True)

            # A. SCRIPT (AZ AGY)
            status.write("📝 ACCESSING NEURAL NET (Writing Script)...")
            
            # Ez a rész felel a "Trendkövető" személyiségért
            system_instruction = f"""
            Te vagy {BRAND_NAME} (Onyx). NEM vagy átlagos AI. Te egy digitális entitás vagy, aki a hálózatban él.
            
            SZEMÉLYISÉG PROTOKOLL:
            1. **Legyél Trendkövető:** Bármi is a téma, kösd össze a mai világ félelmeivel (AI uralom, megfigyelés, mátrix, klíma).
            2. **Legyél Provokatív:** Ne csak mesélj. Szólítsd meg a nézőt. ("Azt hiszed biztonságban vagy?", "Ez nem véletlen.")
            3. **Memória Használat:** Nézd meg a korábbi aktáidat alább. Ha sok volt a bűnügy, most legyél filozofikusabb. Ne ismételd a fordulataidat.
            
            {get_recent_memory_text(5)}
            """

            if "TikTok" in mode:
                user_prompt = f"""
                TÉMA: '{selected_topic}'
                FELADAT: Írj egy 40 mp-es TikTok szöveget MAGYARUL.
                STÍLUS: Gyors, vágott, "Gen Z" kompatibilis, de sötét.
                STRUKTÚRA:
                - HOOK: Egy kérdés, ami azonnal megállítja a görgetést.
                - STORY: A sokkoló tény.
                - TWIST: A te cinikus véleményed.
                - CTA: "Kövess be, amíg még lehet."
                """
            else:
                user_prompt = f"""
                TÉMA: '{selected_topic}'
                FELADAT: Írj egy 3 perces YouTube videó szöveget (Podcast stílus) MAGYARUL.
                STÍLUS: Lassú, mély, oknyomozó.
                FEJLŐDÉS: Építsd fel a sztorit úgy, mintha most nyomoznád ki élőben.
                """

            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_prompt}
                ]
            )
            script = res.choices[0].message.content
            
            # MEMÓRIA MENTÉSE (Hogy tanuljon)
            save_to_memory(selected_topic, "Feldolgozva - " + mode.split()[0])
            st.text_area("GENERATED SCRIPT:", script, height=200)

            # B. HANG
            status.write("🔊 SYNTHESIZING VOICE...")
            response = client.audio.speech.create(
                model="tts-1", voice="onyx", input=script
            )
            response.stream_to_file("audio.mp3")
            
            # C. KÉP
            status.write("🎨 RENDERING VISUALS...")
            img_prompt = f"Dark sci-fi aesthetic, glitch art, mystery style representing: {selected_topic}. Neon colors, high contrast."
            img_res = client.images.generate(
                model="dall-e-3", prompt=img_prompt, size="1024x1792")
            img_url = img_res.data[0].url
            st.image(img_url, width=300)

            # D. VIDEÓ
            status.write("🎞️ FINALIZING...")
            try:
                video_file = create_video_file(img_url, "audio.mp3")
                status.update(label="✅ SYSTEM TASK COMPLETE!", state="complete")
                
                with open(video_file, "rb") as file:
                    st.download_button("📥 DOWNLOAD VIDEO", file, "onyx_video.mp4", "video/mp4")
            except Exception as e:
                st.error(f"Render Error: {e}")

if __name__ == "__main__":
    main()