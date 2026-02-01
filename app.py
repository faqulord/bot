import streamlit as st
import feedparser
import os
import json
import random
import requests
import asyncio
import edge_tts
import re
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

# --- ASYNC HELPER ---
def run_async(coroutine):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coroutine)

# --- INTELLIGENS MEMÓRIA RENDSZER 🧠 ---
def load_memory():
    if not os.path.exists(HISTORY_FILE): return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except: return []

def save_to_memory(topic, platform, style):
    history = load_memory()
    entry = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"), 
        "topic": topic, 
        "platform": platform,
        "style": style
    }
    history.insert(0, entry)
    history = history[:50]
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=4)

def analyze_strategy():
    # Ez a funkció az "Öntudat". Elemzi a múltat.
    history = load_memory()
    if not history:
        return "Tiszta lap. Kezdjünk egy erős, sokkoló témával!"
    
    last_topics = [h['topic'] for h in history[:3]]
    last_styles = [h.get('style', 'Unknown') for h in history[:3]]
    
    analysis = f"Legutóbbi videók: {', '.join(last_topics)}. "
    if "Humoros" in last_styles:
        analysis += "Sokat viccelődtünk mostanában. Most legyünk komolyabbak, sötétebbek."
    else:
        analysis += "Túl komolyak voltunk. Most vigyünk bele egy kis cinikus humort vagy szarkazmust."
    
    return analysis

# --- SZÖVEG TISZTÍTÓ ---
def clean_script_for_speech(text):
    # Kíméletlenül kiszedi a rendezői utasításokat
    text = re.sub(r'\s*\(.*?\)\s*', ' ', text)
    text = re.sub(r'\*\*.*?\*\*:', '', text)
    text = re.sub(r'^\d+\.\s*\w+:', '', text, flags=re.MULTILINE)
    text = re.sub(r'(HOOK|BODY|INTRO|OUTRO|VÁGÁS|KÉP):', '', text, flags=re.IGNORECASE)
    return text.strip()

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

    # Háttérzene
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
    
    # Logó ráégetése (Ha van logo.png)
    logo_file = "logo.png"
    clip = ImageClip("temp_image.png").set_duration(voice_clip.duration)
    
    if os.path.exists(logo_file):
        try:
            from moviepy.editor import ImageClip as ImgClip
            logo = ImgClip(logo_file).set_duration(voice_clip.duration).resize(height=150).margin(right=20, bottom=20, opacity=0).set_pos(("right","bottom"))
            # Kompozit videó (Kép + Logo)
            from moviepy.editor import CompositeVideoClip
            clip = CompositeVideoClip([clip, logo])
        except: pass # Ha hiba van a logóval, simán megy tovább

    clip = clip.set_audio(final_audio)
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac")
    return filename

# --- DASHBOARD UI ---
def main():
    st.set_page_config(page_title="ONYX // MASTERMIND", page_icon="👁️", layout="centered")
    
    st.markdown("""
    <style>
    .stApp { background-color: #080808; color: #e0e0e0; }
    h1 { color: #ff004c; text-transform: uppercase; letter-spacing: 3px; font-weight: 900; }
    .stButton>button { border: 2px solid #ff004c; color: #ff004c; background: #000; font-weight: bold; width: 100%; }
    .stButton>button:hover { background: #ff004c; color: white; }
    div[data-testid="stStatusWidget"] { border: 1px solid #333; }
    </style>
    """, unsafe_allow_html=True)

    st.title(f"👁️ {BRAND_NAME} V8.0")
    
    # Stratégiai Elemzés
    strategy_advice = analyze_strategy()
    st.info(f"🧠 AI STRATÉGIAI TANÁCS: {strategy_advice}")

    client = OpenAI()

    # --- 1. MEMÓRIA ---
    with st.expander("📂 MUNKA ELŐZMÉNYEK (Tanuló Algoritmus)", expanded=False):
        history = load_memory()
        if history:
            st.table(history)
        else:
            st.write("Még nincs adat.")

    # --- 2. KUTATÁS ---
    st.subheader("1. TÉMA VADÁSZAT 📡")
    if st.button("🔍 KERESS FRISS TÉMÁKAT"):
        with st.spinner("A hálózat pásztázása..."):
            user_agents = ['Mozilla/5.0 (Windows NT 10.0)', 'Mozilla/5.0 (Macintosh)']
            rss_urls = [
                "https://www.reddit.com/r/CreepyWikipedia/top/.rss",
                "https://www.reddit.com/r/HighStrangeness/top/.rss",
                "https://news.google.com/rss/search?q=mystery+scandal+ai&hl=en-US&gl=US&ceid=US:en"
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
                # Dátumozás szimuláció
                labeled_news = []
                for news in collected_news[:5]:
                    label = random.choice(["🔴 [MA] ", "🟡 [TEGNAP] ", "🔵 [ARCHÍV] "])
                    labeled_news.append(label + news)
                st.session_state['news_list'] = labeled_news
                st.success(f"{len(labeled_news)} aktát találtam.")
            else:
                st.error("Nincs jel. Próbáld újra.")

    selected_topic_raw = None
    if 'news_list' in st.session_state:
        selected_topic_raw = st.radio("VÁLASSZ ÜGYET:", st.session_state['news_list'])

    # --- 3. GYÁRTÁS ---
    if selected_topic_raw:
        selected_topic = selected_topic_raw.split("] ")[-1]
        st.markdown("---")
        st.header("2. GYÁRTÁS & SEO 🎬")
        
        mode = st.radio("PLATFORM:", ["📱 TikTok (Viral)", "📺 YouTube (Deep)"], horizontal=True)

        if st.button("🚀 GENERÁLÁS (SCRIPT + SEO)"):
            status = st.status("ONYX DOLGOZIK...", expanded=True)

            # --- A. SCRIPT (THE RULEBOOK) ---
            status.write("🧠 SCRIPT ÍRÁSA (Marketing Szabálykönyv szerint)...")
            
            system_instruction = f"""
            Te vagy ONYX. Senior Marketing Igazgató és AI Influenszer.
            
            A "ONYX BIBLIA" (Szigorú szabályok):
            1. **MrBeast Tempó:** Soha ne legyen unalmas rész. 3 másodpercenként új inger (a szövegben ez legyen érezhető).
            2. **Hormozi Érték:** Ígérd meg a titkot az elején, de csak a végén mondd el (Open Loop).
            3. **Tate Polarizáció:** Foglalj állást! "Mindenki hazudik, kivéve mi."
            4. **Nyelvezet:** Tegeződő, dinamikus magyar. Nincs "Sziasztok". Nincs "Remélem tetszett".
            
            PLATFORM: {mode}
            STRATÉGIAI TANÁCS A MÚLTBÓL: {strategy_advice}
            
            FELADAT: Írd meg a felolvasandó szöveget. NE írj rendezői utasítást (HOOK, VÁGÁS), mert a felolvasó program beolvassa! Csak a tiszta beszédet írd.
            """

            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": system_instruction}, {"role": "user", "content": f"Téma: {selected_topic}"}]
            )
            raw_script = res.choices[0].message.content
            clean_script = clean_script_for_speech(raw_script) # Takarítás
            
            st.subheader("📝 SCRIPT (Tamás Hangjához):")
            st.text_area("Felolvasandó:", clean_script, height=150)

            # --- B. SEO MODUL (ÚJ!) ---
            status.write("📈 SEO & METADATA GENERÁLÁSA...")
            seo_prompt = f"""
            Ehhez a videó szöveghez írj YouTube/TikTok adatokat Magyarul:
            SZÖVEG: {clean_script}
            
            Kimenet formátuma:
            CÍM: (Clickbait, figyelemfelkeltő, max 60 karakter)
            LEÍRÁS: (Rövid, SEO kulcsszavakkal, CTA a végén)
            HASHTAGS: (5 db releváns tag)
            """
            seo_res = client.chat.completions.create(
                model="gpt-4o", messages=[{"role": "user", "content": seo_prompt}]
            )
            seo_content = seo_res.choices[0].message.content
            st.info(seo_content) # Kiírjuk a felhasználónak másolásra

            save_to_memory(selected_topic, mode, "Kész")

            # --- C. HANG ---
            status.write("🔊 HANG GENERÁLÁSA...")
            async def generate_voice():
                speed = "+12%" if "TikTok" in mode else "+5%"
                communicate = edge_tts.Communicate(clean_script, "hu-HU-TamasNeural", rate=speed)
                await communicate.save("audio.mp3")

            try:
                run_async(generate_voice())
                st.audio("audio.mp3")
            except Exception as e:
                st.error(f"Hang Hiba: {e}")
                return

            # --- D. KÉP ---
            status.write("🎨 BRAND VIZUÁL...")
            img_prompt = f"Cinematic horror movie poster about {selected_topic}. Dark neon red aesthetics, all-seeing eye symbol hidden in background. 8k realism."
            img_res = client.images.generate(model="dall-e-3", prompt=img_prompt, size="1024x1792")
            img_url = img_res.data[0].url
            st.image(img_url, width=300)

            # --- E. RENDER ---
            status.write("🎞️ VÉGLEGES VIDEÓ...")
            video_file = create_video_file(img_url, "audio.mp3")
            status.update(label="✅ MUNKAVÉGZÉS SIKERES!", state="complete")
            
            with open(video_file, "rb") as file:
                st.download_button("📥 VIDEÓ LETÖLTÉSE", file, "onyx_v8_master.mp4", "video/mp4")

if __name__ == "__main__":
    main()