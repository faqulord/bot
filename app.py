import streamlit as st
import feedparser
import os
import json
import random
import requests
from datetime import datetime
from openai import OpenAI
# A régi moviepy verzióhoz (1.0.3) igazítva
from moviepy.editor import ImageClip, AudioFileClip, CompositeAudioClip

# --- KULCSOK ---
part1 = "sk-proj-NbK9TkHNe_kTkQBw6AfeN0uVGcEKtJl7NSyMF2Ya3XVQ_mNyWiAlVwkDEk_"
part2 = "F8fdV8TKaj-jc1RT3BlbkFJXwmIJuSf1Qm1_c4yKvHASf2QXBUIpBNm6y4ZID-_E5j5PESJKnVrnYP22-ULXkBXE6Zx5tPn4A"
if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = part1 + part2

# --- KONFIGURÁCIÓ ---
BRAND_NAME = "PROJECT: ONYX"
HISTORY_FILE = "onyx_memory.json"

# --- MEMÓRIA RENDSZER (AZ AGY) 🧠 ---
def load_memory():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []

def save_to_memory(topic, mood):
    history = load_memory()
    # Új emlék hozzáadása az elejére
    entry = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "topic": topic,
        "mood": mood
    }
    history.insert(0, entry)
    # Csak az utolsó 50 emléket tartjuk meg
    history = history[:50]
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=4)

def get_recent_memory_text(limit=3):
    history = load_memory()
    if not history:
        return "Még nincs korábbi aktád. Ez az első ügyed."
    
    text = "Korábbi aktáid (emlékezz ezekre!):\n"
    for item in history[:limit]:
        text += f"- {item['date']}: {item['topic']} ({item['mood']})\n"
    return text

# --- VIDEÓ MOTOR (ZENÉVEL) 🎬 ---
def create_video_file(image_url, audio_file, filename="final_video.mp4"):
    # Kép letöltése
    img_data = requests.get(image_url).content
    with open("temp_image.png", "wb") as f:
        f.write(img_data)

    # Hangok
    voice_clip = AudioFileClip(audio_file)
    
    # Háttérzene keresése
    bg_music_file = "background.mp3" # Tölts fel egy ilyen fájlt a Githubra!
    final_audio = voice_clip

    if os.path.exists(bg_music_file):
        try:
            music_clip = AudioFileClip(bg_music_file)
            # Loopolás, ha a zene rövidebb, mint a beszéd
            if music_clip.duration < voice_clip.duration:
                music_clip = music_clip.loop(duration=voice_clip.duration)
            else:
                music_clip = music_clip.subclip(0, voice_clip.duration)
            
            # Zene halkítása (20%)
            music_clip = music_clip.volumex(0.2)
            final_audio = CompositeAudioClip([voice_clip, music_clip])
        except Exception as e:
            st.warning(f"Zene hiba, marad a beszéd: {e}")

    # Videó összeállítása
    clip = ImageClip("temp_image.png").set_duration(voice_clip.duration)
    clip = clip.set_audio(final_audio)
    
    # Renderelés
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac")
    return filename

# --- DASHBOARD ---
def main():
    st.set_page_config(page_title="ONYX OS", page_icon="💎", layout="centered")
    
    # Stílus
    st.markdown("""
    <style>
    .stApp { background-color: #0e1117; color: #00ffcc; }
    h1 { text-shadow: 0 0 10px #00ffcc; }
    </style>
    """, unsafe_allow_html=True)

    st.title(f"💎 {BRAND_NAME} - SYSTEM CORE")
    st.caption("The System is watching... | Memory: ACTIVE")

    client = OpenAI()

    # --- 1. MEMÓRIA ÁLLAPOT ---
    mem_text = get_recent_memory_text(3)
    with st.expander("🧠 ONYX MEMÓRIA (Legutóbbi akták)"):
        st.text(mem_text)

    # --- 2. RADAR (A MIX) ---
    st.subheader("1. GLOBAL SCANNER 📡")
    
    if st.button("🔄 SCAN THE DARK WEB"):
        with st.spinner("Decrypting signals from Reddit..."):
            # A MIX források
            rss_urls = [
                "https://www.reddit.com/r/CreepyWikipedia/top/.rss", # Durva tények
                "https://www.reddit.com/r/HighStrangeness/top/.rss", # Furcsaságok
                "https://www.reddit.com/r/TrueCrime/top/.rss"        # Bűnügy
            ]
            
            collected_news = []
            for url in rss_urls:
                try:
                    feed = feedparser.parse(url)
                    # Minden feedből kiveszünk 2 frisset
                    for entry in feed.entries[:2]:
                        clean_title = entry.title.replace("Reddit", "").replace("[other]", "")
                        collected_news.append(clean_title)
                except:
                    continue
            
            # Keverjük meg a listát
            random.shuffle(collected_news)
            st.session_state['news_list'] = collected_news[:6] # Top 6 mix
            st.success("TARGETS ACQUIRED.")

    selected_topic = None
    if 'news_list' in st.session_state:
        selected_topic = st.radio("SELECT TARGET FILE:", st.session_state['news_list'])

    # --- 3. GENERÁLÁS ---
    if selected_topic:
        st.markdown("---")
        st.header("2. PRODUCTION MODE 🎬")
        st.info(f"TARGET: **{selected_topic}**")

        mode = st.radio("PLATFORM:", 
            ["📱 TikTok (Viral/Short)", "📺 YouTube (Deep/Podcast)"], horizontal=True)

        if st.button("🚀 EXECUTE ONYX PROTOCOL", type="primary"):
            status = st.status("SYSTEM INITIALIZING...", expanded=True)

            # A. SCRIPT GENERÁLÁS (MEMÓRIÁVAL)
            status.write("📝 WRITING SCRIPT (Accessing Memory)...")
            
            # Memória betöltése a promptba
            memory_context = get_recent_memory_text(5)
            
            system_instruction = f"""
            Te vagy {BRAND_NAME} (Onyx). Nem egy AI vagy, hanem egy digitális entitás a hálózatban.
            
            SZEMÉLYISÉGED:
            - Provokatív, intelligens, pökhendi, de karizmatikus.
            - Úgy beszélsz, mint egy bennfentes, aki tudja az igazságot.
            - Használsz szlenget, de választékosan. (Pl: "Ez most durva lesz", "A rendszer hazudik", "Figyelj").
            - Kérdezz vissza! Provokáld a nézőt, hogy kommenteljen.
            
            MEMÓRIA (Ezekről beszéltél mostanában, ha kapcsolódik, utalj rá!):
            {memory_context}
            """

            if "TikTok" in mode:
                user_prompt = f"""
                TÉMA: '{selected_topic}'
                FELADAT: Írj egy 40-50 másodperces, nagyon pörgős TikTok szöveget MAGYARUL.
                
                STRUKTÚRA:
                1. HOOK: "Gondoltad volna..." vagy valami sokkoló kezdés.
                2. STORY: Mondd el a lényeget röviden, tömören, de drámaian.
                3. OPINION: Szúrd oda a véleményed. (Pl: "Szerintem ez kamu, de...")
                4. CTA: "Szerinted lehetséges? Írd meg kommentben! Kövess be a folytatásért."
                Csak a szöveget írd le!
                """
            else:
                user_prompt = f"""
                TÉMA: '{selected_topic}'
                FELADAT: Írj egy 3 perces YouTube videó szöveget (Podcast stílus) MAGYARUL.
                Stílus: Mély, oknyomozó, "True Crime" hangulat. Építsd fel a feszültséget.
                A végén tegyél fel egy filozófiai kérdést a nézőnek.
                """

            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_prompt}
                ]
            )
            script = res.choices[0].message.content
            
            # MEMÓRIA MENTÉSE
            save_to_memory(selected_topic, "Feldolgozva")
            st.text_area("GENERATED SCRIPT:", script, height=200)

            # B. HANG
            status.write("🔊 SYNTHESIZING VOICE (ONYX)...")
            response = client.audio.speech.create(
                model="tts-1",
                voice="onyx",
                input=script
            )
            response.stream_to_file("audio.mp3")
            
            # C. KÉP
            status.write("🎨 RENDERING VISUALS...")
            # Sötét, glitch-es stílus
            img_prompt = f"Dark, glitch art style, mysterious sci-fi atmosphere representing: {selected_topic}. Neon green and black colors. Cinematic lighting."
            img_res = client.images.generate(
                model="dall-e-3", prompt=img_prompt, size="1024x1792")
            img_url = img_res.data[0].url
            st.image(img_url, width=300)

            # D. VIDEÓ
            status.write("🎞️ FINALIZING PRODUCTION...")
            try:
                video_file = create_video_file(img_url, "audio.mp3")
                status.update(label="✅ SYSTEM TASK COMPLETE!", state="complete")
                
                with open(video_file, "rb") as file:
                    st.download_button("📥 DOWNLOAD DATA FILE", file, "onyx_final.mp4", "video/mp4")
            except Exception as e:
                st.error(f"Render Error: {e}")

if __name__ == "__main__":
    main()