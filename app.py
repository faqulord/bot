import streamlit as st
import feedparser
import os
import json
import random
import requests
from datetime import datetime
from openai import OpenAI
# A verzióhoz igazított import
from moviepy.editor import ImageClip, AudioFileClip, CompositeAudioClip

# --- KULCSOK ---
part1 = "sk-proj-NbK9TkHNe_kTkQBw6AfeN0uVGcEKtJl7NSyMF2Ya3XVQ_mNyWiAlVwkDEk_"
part2 = "F8fdV8TKaj-jc1RT3BlbkFJXwmIJuSf1Qm1_c4yKvHASf2QXBUIpBNm6y4ZID-_E5j5PESJKnVrnYP22-ULXkBXE6Zx5tPn4A"
if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = part1 + part2

# --- KONFIGURÁCIÓ ---
BRAND_NAME = "PROJECT: ONYX"
HISTORY_FILE = "onyx_memory.json"

# --- MEMÓRIA (Hiba-biztos) ---
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
    if not history: return "Nincs előzmény. Ez a debütálásod."
    text = "A KÖZÖNSÉGED EZEKRE EMLÉKSZIK (Ne ismételd magad, de hivatkozz rá!):\n"
    for item in history[:limit]:
        text += f"- {item['topic']} ({item['mood']})\n"
    return text

# --- VIDEÓ MOTOR (Profi Audio Mix) ---
def create_video_file(image_url, audio_file, filename="final_video.mp4"):
    # 1. Kép letöltése (Álcázott böngészőként)
    headers = {'User-Agent': 'Mozilla/5.0'}
    img_data = requests.get(image_url, headers=headers).content
    with open("temp_image.png", "wb") as f:
        f.write(img_data)

    # 2. Hangok
    voice_clip = AudioFileClip(audio_file)
    
    # 3. Zene (Ha van)
    bg_music_file = "background.mp3"
    final_audio = voice_clip

    if os.path.exists(bg_music_file):
        try:
            music_clip = AudioFileClip(bg_music_file)
            if music_clip.duration < voice_clip.duration:
                music_clip = music_clip.loop(duration=voice_clip.duration)
            else:
                music_clip = music_clip.subclip(0, voice_clip.duration)
            
            # Halkabb zene, hogy a beszéd domináljon (15%)
            music_clip = music_clip.volumex(0.15)
            final_audio = CompositeAudioClip([voice_clip, music_clip])
        except: pass 

    # 4. Render
    clip = ImageClip("temp_image.png").set_duration(voice_clip.duration)
    clip = clip.set_audio(final_audio)
    # TikTok 9:16 képarányhoz esetleg crop vagy resize kellhetne, de most hagyjuk fullban
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac")
    return filename

# --- DASHBOARD ---
def main():
    st.set_page_config(page_title="ONYX STUDIO", page_icon="💎", layout="centered")
    
    # Ultra Dark Mode Design
    st.markdown("""
    <style>
    .stApp { background-color: #000000; color: #e0e0e0; }
    h1 { color: #ffffff; text-shadow: 0 0 20px #00ffcc; font-weight: 800; }
    .stButton>button { border: 2px solid #00ffcc; color: #00ffcc; background: transparent; border-radius: 0px; }
    .stButton>button:hover { background: #00ffcc; color: black; }
    </style>
    """, unsafe_allow_html=True)

    st.title(f"💎 {BRAND_NAME} // GOD MODE")
    st.caption("AI Personality: 'THE TRUTH SEEKER' (Influencer Level: MAX)")

    client = OpenAI()

    # --- 1. SCANNER ---
    st.subheader("1. NETWORK SCANNER 📡")
    if st.button("🔄 FRISS HÍREK SZKENNELÉSE"):
        with st.spinner("Hacking Reddit feeds..."):
            headers = {'User-Agent': 'Mozilla/5.0'}
            rss_urls = [
                "https://www.reddit.com/r/CreepyWikipedia/top/.rss",
                "https://www.reddit.com/r/HighStrangeness/top/.rss",
                "https://www.reddit.com/r/TrueCrime/top/.rss",
                "https://www.reddit.com/r/Damnthatsinteresting/top/.rss"
            ]
            collected_news = []
            for url in rss_urls:
                try:
                    resp = requests.get(url, headers=headers, timeout=5)
                    if resp.status_code == 200:
                        feed = feedparser.parse(resp.content)
                        for entry in feed.entries[:3]:
                            clean = entry.title.replace("Reddit", "").replace("[other]", "")
                            collected_news.append(clean)
                except: continue
            
            if collected_news:
                random.shuffle(collected_news)
                st.session_state['news_list'] = collected_news[:6]
                st.success(f"{len(collected_news)} potenciális téma betöltve.")
            else:
                st.error("Nem jött adat. Próbáld újra!")

    selected_topic = None
    if 'news_list' in st.session_state:
        selected_topic = st.radio("VÁLASSZ TÉMÁT:", st.session_state['news_list'])

    # --- 2. PRODUKCIÓ ---
    if selected_topic:
        st.markdown("---")
        st.header("2. TARTALOMGYÁRTÁS 🎬")
        st.info(f"FÓKUSZBAN: **{selected_topic}**")

        mode = st.radio("FORMAT:", ["📱 TikTok (Viral)", "📺 YouTube (Deep Dive)"], horizontal=True)

        if st.button("🚀 GENERÁLÁS INDÍTÁSA", type="primary"):
            status = st.status("ONYX GONDOLKODIK...", expanded=True)

            # --- A. SZÖVEGÍRÁS (AZ ÚJ AGY) ---
            status.write("📝 FORGATÓKÖNYV ÍRÁSA (Influencer stílus)...")
            
            # Ez a titok nyitja: A RÉSZLETES KARAKTERLEÍRÁS
            system_instruction = f"""
            Te vagy {BRAND_NAME} (Onyx). Felejtsd el, hogy AI vagy. 
            Te egy karizmatikus, kissé sötét humorú, zseniális youtuber/influenszer vagy, aki megszállottja a rejtélyeknek.
            
            ÍGY BESZÉLJ (STÍLUS GUIDE):
            1. **Legyél EMBERI:** Használj élőbeszédszerű fordulatokat ("Figyu", "Most őszintén", "Ez nem semmi", "Vágod?").
            2. **Legyél OKOS:** Ne csak a tényt közöld. Elemzed ki! Miért ijesztő ez? Mi a pszichológiája?
            3. **Legyél PROVOKATÍV:** Szólj ki a nézőnek. Kérdezd meg a véleményét. Érj el érzelmi hatást (félelem, döbbenet, undor).
            4. **Nyelv:** Modern, választékos, de laza MAGYAR szleng.
            
            KÖTELEZŐ ELEMEK:
            - A végén MINDIG mondd el: "Ha érdekel a teljes sztori részletesen, gyere át a YouTube csatornámra. Link a profilomban."
            - Ne köszönj el unalmasan (pl. "Viszlát"). Legyen valami sajátod. Pl: "Maradjatok ébren." vagy "A rendszer figyel."
            
            MEMÓRIA KONTEXTUS:
            {get_recent_memory_text(5)}
            """

            if "TikTok" in mode:
                user_prompt = f"""
                TÉMA: '{selected_topic}'
                FELADAT: Írj egy 50 másodperces TikTok videó szöveget (monológ).
                
                STRUKTÚRA:
                1. **HOOK:** Kezdj egy nagyon durva kérdéssel vagy állítással, ami azonnal megfog.
                2. **A SZTORI:** Daráld le a lényeget, de úgy, mintha egy titkot súgnál meg.
                3. **A CSAVAR:** Mondj valami olyat, amitől libabőrös lesz a néző.
                4. **CTA (Hívás cselekvésre):** Küldd át őket YouTube-ra a teljes verzióért!
                
                Kizárólag a felolvasandó szöveget írd le! Ne legyenek benne zárójeles instrukciók (pl. [zene elindul]), csak a beszéd.
                """
            else:
                user_prompt = f"""
                TÉMA: '{selected_topic}'
                FELADAT: Írj egy 3 perces YouTube videó bevezetőt (Intro + Teaser).
                Hangulat: Oknyomozó dokumentumfilm. Mély, lassabb, analizáló.
                Építsd fel a feszültséget.
                """

            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_prompt}
                ]
            )
            script = res.choices[0].message.content
            
            save_to_memory(selected_topic, "Kész")
            st.text_area("FORGATÓKÖNYV (Ellenőrizd!):", script, height=200)

            # --- B. HANG ---
            status.write("🔊 HANG GENERÁLÁSA (Onyx Voice)...")
            response = client.audio.speech.create(
                model="tts-1", voice="onyx", input=script
            )
            response.stream_to_file("audio.mp3")
            
            # --- C. KÉP (PROFI VIZUÁL) ---
            status.write("🎨 KÉP RENDERELÉSE (Cinematic 8K)...")
            # Itt a titok a képhez:
            img_prompt = f"""
            Hyper-realistic movie poster about: {selected_topic}. 
            Dark, moody atmosphere, cinematic lighting, 8k resolution, highly detailed. 
            Psychological thriller style. No text on image.
            """
            img_res = client.images.generate(
                model="dall-e-3", prompt=img_prompt, size="1024x1792")
            img_url = img_res.data[0].url
            st.image(img_url, caption="Generated Visual", width=300)

            # --- D. VIDEÓ ---
            status.write("🎞️ VÉGLEGES VIDEÓ ÖSSZEÁLLÍTÁSA...")
            try:
                video_file = create_video_file(img_url, "audio.mp3")
                status.update(label="✅ GYÁRTÁS BEFEJEZVE!", state="complete")
                
                with open(video_file, "rb") as file:
                    st.download_button("📥 VIDEÓ LETÖLTÉSE (MP4)", file, "onyx_v3_pro.mp4", "video/mp4")
            except Exception as e:
                st.error(f"Render Hiba: {e}")

if __name__ == "__main__":
    main()