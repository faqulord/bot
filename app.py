import streamlit as st
import feedparser
import os
import json
import random
import requests
import asyncio
import edge_tts
import re
import time
from datetime import datetime, timedelta
from openai import OpenAI

# --- HACKER JAVÍTÁS (Kötelező a MoviePy-hez) ---
import PIL.Image
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = PIL.Image.LANCZOS
# -----------------------------------------------

from moviepy.editor import *

# --- 1. DESIGN & KONFIGURÁCIÓ ---
st.set_page_config(page_title="ONYX // OS V10 (GOD MODE)", page_icon="👁️", layout="wide")

st.markdown("""
<style>
    .stApp { background-color: #000000; color: #e0e0e0; font-family: 'Roboto Mono', monospace; }
    h1 { color: #00ffcc; text-align: center; letter-spacing: 5px; text-shadow: 0 0 20px #00ffcc; text-transform: uppercase; }
    .stButton>button { 
        background: #111; color: #00ffcc; border: 1px solid #00ffcc; 
        font-weight: bold; font-size: 18px; padding: 12px; transition: 0.3s; 
    }
    .stButton>button:hover { background: #00ffcc; color: #000; box-shadow: 0 0 25px #00ffcc; }
    .stat-card { background: #080808; border: 1px solid #333; padding: 15px; border-radius: 5px; text-align: center; }
    .console-log { font-family: 'Courier New'; color: #0f0; background: #000; padding: 10px; border: 1px solid #333; height: 150px; overflow-y: scroll; font-size: 0.8em; }
</style>
""", unsafe_allow_html=True)

# API KULCS
api_key = None
try:
    api_key = st.secrets["OPENAI_API_KEY"]
except:
    api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    st.error("⚠️ NINCS API KULCS! Állítsd be a Secrets-ben!")
    st.stop()

client = OpenAI(api_key=api_key)
HISTORY_FILE = "onyx_memory.json"
BG_MUSIC = "background.mp3"
MASTER_IMG = "onyx_master_v10.png"
OUTRO_IMG = "onyx_outro_v10.png"

# --- 2. SEGÉD FÜGGVÉNYEK ---
def run_async(coroutine):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coroutine)

def load_memory():
    if not os.path.exists(HISTORY_FILE): return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f: return json.load(f)
    except: return []

def save_to_memory(topic, platform):
    history = load_memory()
    entry = {"timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"), "topic": topic, "platform": platform}
    history.insert(0, entry)
    with open(HISTORY_FILE, "w", encoding="utf-8") as f: json.dump(history[:50], f, ensure_ascii=False, indent=4)

# --- 3. MASTER ASSET GENERATOR (AZ ALAPOK) ---
def generate_master_assets():
    # 1. ONYX MASTER INTRO KÉP (A Kapucnis Alak)
    prompt_intro = """
    A hyper-realistic close-up portrait of a mysterious figure in a high-tech black hoodie. 
    The face is completely hidden in deep shadow, pitch black void inside the hood.
    The figure is holding a glowing green holographic data orb in front of the chest.
    Background is a dark server room with green matrix code rain. 
    Cinematic lighting, 8k resolution, photorealistic, cyberpunk, vertical 9:16 aspect ratio.
    """
    
    # 2. YOUTUBE OUTRO KÉP
    prompt_outro = """
    Vertical 9:16 aspect ratio. A dark screen with a glowing neon green glitch text: 
    "AZ IGAZSÁG FÁJ. DE SZÜKSÉGED VAN RÁ." 
    Below it, a "SUBSCRIBE" button graphic in cyberpunk style.
    Background is abstract dark data flow. 
    """
    
    try:
        # Intro Generálás
        res_intro = client.images.generate(model="dall-e-3", prompt=prompt_intro, size="1024x1792", quality="hd")
        with open(MASTER_IMG, "wb") as f: f.write(requests.get(res_intro.data[0].url).content)
        
        # Outro Generálás
        res_outro = client.images.generate(model="dall-e-3", prompt=prompt_outro, size="1024x1792", quality="hd")
        with open(OUTRO_IMG, "wb") as f: f.write(requests.get(res_outro.data[0].url).content)
        
        return True
    except Exception as e:
        st.error(f"Hiba az assetek generálásakor: {e}")
        return False

# --- 4. INTELLIGENS KUTATÁS (DEEP BRAIN) ---
def deep_research(topic):
    # Ez a lépés "gondolkodik" a híren, mielőtt írna róla
    prompt = f"""
    Te vagy ONYX agya. Kapsz egy hírt: "{topic}".
    
    FELADAT: 
    1. Keresd meg a téma sötét oldalát. Mi az, amit a média elhallgat?
    2. Keress történelmi párhuzamot (pl. Római birodalom bukása, 1984, Skynet).
    3. Fogalmazz meg egy radikális, technokrata konklúziót.
    
    Kimenet: Csak a kutatási jegyzeteket írd le vázlatpontokban.
    """
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
    return res.choices[0].message.content

# --- 5. SZKRIPT ÍRÁS (PODCAST & STORYTELLING) ---
def generate_script(topic, research, platform):
    if platform == "TikTok":
        structure = "Szerkezet: HOOK (Sokkoló tény) -> MAGYARÁZAT (Miért veszélyes ez?) -> CTA (Nézd meg a YouTube-on a teljes sztorit)."
        length = "Max 50 szó."
    else: # YouTube
        structure = "Szerkezet: INTRO (Filozófiai kérdés) -> MÉLYELEMZÉS (A kutatás alapján) -> TÖRTÉNELMI PÉLDA -> SÖTÉT JÖVŐKÉP -> OUTRO."
        length = "Kb. 150 szó. Legyen részletes, mint egy mini-dokumentumfilm."

    prompt = f"""
    SZEREP: Te vagy ONYX. Sötét, cinikus, de választékos mesélő.
    FORRÁS ADATOK: {research}
    PLATFORM: {platform}
    {structure}
    HOSSZ: {length}
    
    FONTOS: Írj úgy, mintha egy titkot osztanál meg. Használj rövid szüneteket (pontok).
    Ne használd a "Szia" vagy "Üdv" szavakat. Csapjunk a közepébe.
    """
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": "Te vagy ONYX."}, {"role": "user", "content": prompt}])
    text = res.choices[0].message.content
    # Tisztítás
    return re.sub(r'\*+', '', text).strip()

# --- 6. HANG & VIDEÓ ENGINE ---
async def generate_voice(text, filename):
    # MÉLYÍTETT HANG (Onyx Vibe)
    communicate = edge_tts.Communicate(text, "hu-HU-TamasNeural", rate="-5%", pitch="-20Hz")
    await communicate.save(filename)

def create_segment(img_path, audio_path):
    # Egy videó szegmens létrehozása (Kép + Hang)
    audio = AudioFileClip(audio_path)
    # Biztonságos méret (nem zoomolunk a hiba elkerülése miatt)
    clip = ImageClip(img_path).set_duration(audio.duration).resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960)
    clip = clip.set_audio(audio)
    return clip

def render_full_video(topic_img_url, script, platform):
    # 1. Assetek előkészítése
    # Téma képe (Topic Image)
    with open("temp_topic.png", "wb") as f: f.write(requests.get(topic_img_url).content)
    
    # Hang
    run_async(generate_voice(script, "temp_audio.mp3"))
    
    # 2. Szegmensek összeállítása
    clips = []
    
    # A) INTRO (Minden videó elején az alap Onyx kép, de a szöveg első mondata alatt)
    # A trükk: A hangot generáljuk, és a Master képet rakjuk alá
    
    # B) MAIN CONTENT
    # Itt most egyszerűsítünk: A teljes hang alatt váltakozik a Master kép és a Téma képe
    # Hogy ne legyen unalmas.
    
    main_audio = AudioFileClip("temp_audio.mp3")
    full_duration = main_audio.duration
    
    # Vágjuk ketté az időt: 30% Master kép, 70% Téma kép
    switch_time = 3.0 # Az első 3 másodperc mindig a Master Onyx (Intro)
    
    if full_duration > switch_time:
        # Clip 1: Intro (Master Kép)
        clip1 = ImageClip(MASTER_IMG).set_duration(switch_time).resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960)
        
        # Clip 2: Téma (Topic Kép)
        clip2 = ImageClip("temp_topic.png").set_duration(full_duration - switch_time).resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960)
        
        final_video = concatenate_videoclips([clip1, clip2])
    else:
        # Ha nagyon rövid, csak Master kép
        final_video = ImageClip(MASTER_IMG).set_duration(full_duration).resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960)
    
    # C) OUTRO (Csak YouTube-nál)
    if platform == "YouTube" and os.path.exists(OUTRO_IMG):
        outro_clip = ImageClip(OUTRO_IMG).set_duration(4.0).resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960)
        final_video = concatenate_videoclips([final_video, outro_clip])
    
    # Hang hozzáadása
    # Outro alatt nincs duma, csak zene (ha lenne külön zenesáv, de most egyszerűsítünk)
    # A fő hangot rárakjuk a fő videóra
    if platform == "YouTube":
        # A videó hosszabb lett az Outroval, de a beszéd csak az elején van
        final_audio = CompositeAudioClip([main_audio.set_start(0)])
        # Ha van háttérzene, az megy végig
        if os.path.exists(BG_MUSIC):
             bg = AudioFileClip(BG_MUSIC).volumex(0.1).set_duration(final_video.duration)
             final_audio = CompositeAudioClip([main_audio.set_start(0), bg])
        final_video = final_video.set_audio(final_audio)
    else:
        # TikTok
        if os.path.exists(BG_MUSIC):
             bg = AudioFileClip(BG_MUSIC).volumex(0.1).set_duration(final_video.duration)
             final_audio = CompositeAudioClip([main_audio, bg])
             final_video = final_video.set_audio(final_audio)
        else:
            final_video = final_video.set_audio(main_audio)

    output_filename = f"onyx_{platform}_v10.mp4"
    final_video.write_videofile(output_filename, fps=24, codec="libx264", audio_codec="aac", threads=2, preset="ultrafast")
    return output_filename

# --- 7. VEZÉRLŐPULT ---
def main():
    st.title("👁️ PROJECT: ONYX // V10 (GOD MODE)")
    
    # ELLENŐRZÉS: Vannak-e Master Assetek?
    if not os.path.exists(MASTER_IMG) or not os.path.exists(OUTRO_IMG):
        st.warning("⚠️ A RENDSZER MÉG NINCS KONFIGURÁLVA!")
        st.info("Kérlek, nyomd meg a SETUP gombot, hogy legeneráljuk az ONYX Mester-Képet és az Outrót. Ezt csak egyszer kell megtenni.")
        if st.button("🛠️ SETUP INITIALIZATION (GENERATE ASSETS)"):
            with st.spinner("Az Onyx entitás vizuális létrehozása..."):
                if generate_master_assets():
                    st.success("✅ Rendszer élesítve! A képek elmentve.")
                    st.rerun()
                else:
                    st.error("Hiba a generálásnál.")
        st.stop() # Ne engedje tovább, amíg nincs meg a kép
    
    # HA MEGVANNAK AZ ASSETEK, MEHET A MENET
    c1, c2 = st.columns(2)
    c1.image(MASTER_IMG, caption="MASTER INTRO", width=150)
    c2.image(OUTRO_IMG, caption="YOUTUBE OUTRO", width=150)
    
    st.write("---")
    
    # HÍR KERESŐ
    rss_url = "https://www.reddit.com/r/Futurology/top/.rss"
    col_input, col_act = st.columns([3, 1])
    with col_input:
        custom_topic = st.text_input("Vagy írj be egy témát manuálisan:", placeholder="Pl. A mesterséges intelligencia öntudatra ébredése")
    
    if st.button("📡 ADATGYŰJTÉS (RSS)"):
        feed = feedparser.parse(requests.get(rss_url, headers={'User-Agent': 'ONYX'}).content)
        st.session_state['feed'] = [e.title for e in feed.entries[:5]]
    
    topic = custom_topic
    if 'feed' in st.session_state and not topic:
        topic = st.selectbox("Válassz a hírekből:", st.session_state['feed'])
    
    if topic:
        st.write("---")
        st.subheader("🔥 TARTALOM GYÁRTÁS")
        if st.button("🚀 EXECUTE DUAL PROTOCOL"):
            status = st.status("Feldolgozás...", expanded=True)
            
            # 1. KUTATÁS
            status.write("🧠 Mély kutatás (Deep Research)...")
            research_data = deep_research(topic)
            st.text_area("Kutatási jegyzetek:", research_data, height=100)
            
            # 2. KÉP
            status.write("🎨 Téma-specifikus kép generálása...")
            # A téma képe mindig a hírhez kapcsolódik (Hologram stílusban)
            topic_prompt = f"Cyberpunk style digital art, showing a holographic representation of: {topic}. Dark, green, glitchy. 9:16 vertical."
            res_img = client.images.generate(model="dall-e-3", prompt=topic_prompt, size="1024x1792", quality="hd")
            topic_img_url = res_img.data[0].url
            
            # 3. SZKRIPTEK
            status.write("📝 Forgatókönyvek írása...")
            script_tk = generate_script(topic, research_data, "TikTok")
            script_yt = generate_script(topic, research_data, "YouTube")
            
            # 4. RENDER
            status.write("🎞️ Videók renderelése...")
            file_tk = render_full_video(topic_img_url, script_tk, "TikTok")
            file_yt = render_full_video(topic_img_url, script_yt, "YouTube")
            
            status.update(label="✅ KÉSZ!", state="complete")
            
            # EREDMÉNY
            c_tk, c_yt = st.columns(2)
            with c_tk:
                st.video(file_tk)
                st.download_button("📥 TIKTOK LETÖLTÉS", open(file_tk, "rb"), "onyx_tiktok.mp4")
            with c_yt:
                st.video(file_yt)
                st.download_button("📥 YOUTUBE LETÖLTÉS", open(file_yt, "rb"), "onyx_youtube.mp4")

if __name__ == "__main__":
    main()