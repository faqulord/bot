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

# --- 🛠️ RENDSZER JAVÍTÁS (MONKEY PATCH) ---
# Ez kötelező, hogy a V6/V7 óta működjön a videóvágó
import PIL.Image
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = PIL.Image.LANCZOS
# ------------------------------------------

from moviepy.editor import *

# --- 1. DESIGN & KONFIGURÁCIÓ ---
st.set_page_config(page_title="ONYX // OS V9.0", page_icon="👁️", layout="wide")

st.markdown("""
<style>
    .stApp { background-color: #000000; color: #e0e0e0; }
    h1 { color: #00ffcc; text-align: center; font-family: 'Courier New'; letter-spacing: 4px; text-shadow: 0 0 15px #00ffcc; }
    h3 { color: #fff; border-bottom: 2px solid #00ffcc; padding-bottom: 10px; }
    .stButton>button { 
        background: linear-gradient(90deg, #000, #002211); 
        color: #00ffcc; 
        border: 1px solid #00ffcc; 
        font-weight: bold; 
        font-size: 20px; 
        padding: 15px;
        transition: 0.3s;
    }
    .stButton>button:hover { background: #00ffcc; color: #000; box-shadow: 0 0 20px #00ffcc; }
    .stat-card { background: #0a0a0a; border: 1px solid #333; padding: 15px; border-radius: 8px; text-align: center; }
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
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except: return []

def save_to_memory(topic, platform):
    history = load_memory()
    entry = {"timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"), "topic": topic, "platform": platform}
    history.insert(0, entry)
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history[:50], f, ensure_ascii=False, indent=4)

# --- 3. INTELLIGENS ADATGYŰJTÉS ---
def analyze_trends(rss_url):
    try:
        feed = feedparser.parse(requests.get(rss_url, headers={'User-Agent': 'ONYX-BOT'}).content)
        results = []
        now = datetime.now()
        for entry in feed.entries[:10]:
            is_fresh = False
            if hasattr(entry, 'published_parsed') and entry.published_parsed:
                pub_dt = datetime.fromtimestamp(time.mktime(entry.published_parsed))
                if now - pub_dt < timedelta(hours=24): is_fresh = True
            
            tag = "⚡ FRISS" if is_fresh else "Old Data"
            label = f"[{tag}] {entry.title[:80]}..."
            results.append({"label": label, "title": entry.title, "is_fresh": is_fresh})
        return results
    except: return []

# --- 4. HUMANIZÁLT SZKRIPT ÍRÁS ---
def generate_human_script(topic, platform):
    style_guide = """
    STÍLUS: Sötét, cinikus, magyar anyanyelvi beszélő.
    SZABÁLYOK:
    1. Kerüld a bonyolult körmondatokat.
    2. Használj rövid tőmondatokat a hatáskeltéshez.
    3. Használj szüneteket jelző írásjeleket (pont, gondolatjel).
    4. Legyél provokatív.
    """
    
    context = "Platform: TikTok. Hossz: Max 400 karakter." if platform == "TikTok" else "Platform: YouTube. Hossz: Max 800 karakter."
    prompt = f"{style_guide}\n{context}\nTéma: {topic}\nÍrd meg a szöveget magyarul."
    
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": "Te vagy ONYX."}, {"role": "user", "content": prompt}])
    return res.choices[0].message.content

# --- 5. VIZUÁLIS GENERÁTOR ---
def generate_image(topic):
    prompt = f"""
    Vertical 9:16 aspect ratio. A mysterious hooded hacker figure in silhouette, 
    standing in front of a giant digital screen displaying data about: {topic}. 
    Cyberpunk style, neon green and black, glitched aesthetics, dark atmosphere. 
    High detail, 8k resolution.
    """
    try:
        img_res = client.images.generate(model="dall-e-3", prompt=prompt, size="1024x1792", quality="hd")
        return img_res.data[0].url
    except: return None

# --- 6. HANG MOTOR (MODDED TAMÁS) ---
async def generate_deep_voice(text, filename, platform):
    # ITT A TRÜKK: Pitch és Rate módosítás
    # pitch="-25Hz": Mélyebbé teszi a hangot (mint Onyx)
    # rate="-10%": Lassítja, hogy drámai legyen
    
    rate = "-5%" if platform == "TikTok" else "-10%" 
    communicate = edge_tts.Communicate(text, "hu-HU-TamasNeural", rate=rate, pitch="-25Hz")
    await communicate.save(filename)

# --- 7. RENDER MOTOR ---
def render_engine(img_url, script, platform):
    if img_url:
        with open("temp_img.png", "wb") as f: 
            f.write(requests.get(img_url).content)
    
    out_audio = f"audio_{platform}.mp3"
    
    # Aszinkron hívás a módosított hanghoz
    run_async(generate_deep_voice(script, out_audio, platform))
    
    try:
        audio_clip = AudioFileClip(out_audio)
        duration = audio_clip.duration + 1.0
        
        clip = ImageClip("temp_img.png").set_duration(duration)
        clip = clip.resize(height=1920)
        clip = clip.crop(width=1080, height=1920, x_center=clip.w/2, y_center=clip.h/2)
        
        if os.path.exists(BG_MUSIC):
            bg = AudioFileClip(BG_MUSIC).volumex(0.08).set_duration(duration)
            final_audio = CompositeAudioClip([audio_clip, bg])
            clip = clip.set_audio(final_audio)
        else:
            clip = clip.set_audio(audio_clip)
            
        out_file = f"onyx_{platform}.mp4"
        clip.write_videofile(out_file, fps=24, codec="libx264", audio_codec="aac", threads=2, preset="ultrafast")
        return out_file
    except Exception as e:
        return str(e)

# --- 8. VEZÉRLŐPULT ---
def main():
    st.title("👁️ PROJECT: ONYX // V9.0")
    
    c1, c2, c3 = st.columns(3)
    c1.markdown('<div class="stat-card">🧠 TUDAT<br><span style="color:#0f0">AKTÍV</span></div>', unsafe_allow_html=True)
    c2.markdown('<div class="stat-card">📡 HÁLÓZAT<br><span style="color:#0f0">KAPCSOLÓDVA</span></div>', unsafe_allow_html=True)
    c3.markdown('<div class="stat-card">🔊 HANG<br><span style="color:#00ffcc">MÉLY MAGYAR (MODDED)</span></div>', unsafe_allow_html=True)
    
    st.write("---")
    
    rss_options = {
        "Futurology": "https://www.reddit.com/r/Futurology/top/.rss",
        "AI News": "https://www.reddit.com/r/ArtificialInteligence/top/.rss",
        "Crypto": "https://www.reddit.com/r/CryptoCurrency/top/.rss"
    }
    
    col_scan, col_select = st.columns([1, 2])
    
    with col_scan:
        source = st.selectbox("FORRÁS:", list(rss_options.keys()))
        if st.button("📡 SCAN"):
            with st.spinner("Keresés..."):
                items = analyze_trends(rss_options[source])
                st.session_state['feed'] = items
    
    selected_topic = None
    if 'feed' in st.session_state:
        with col_select:
            opts = {i['label']: i['title'] for i in st.session_state['feed']}
            sel = st.selectbox("TALÁLATOK:", list(opts.keys()))
            selected_topic = opts[sel]
            if "Old Data" in sel:
                st.warning("⚠️ 24 óránál régebbi hír!")
            else:
                st.success("⚡ Friss adat!")

    if selected_topic:
        st.write("---")
        st.subheader("🔥 TARTALOM GYÁRTÁS (DUAL CORE)")
        
        if st.button("🚀 INDÍTÁS: TIKTOK + YOUTUBE"):
            progress = st.progress(0)
            status = st.empty()
            
            status.text("🎨 Kép generálása...")
            img_url = generate_image(selected_topic)
            progress.progress(20)
            
            status.text("📝 Szövegek írása (Humanizált)...")
            script_tk = generate_human_script(selected_topic, "TikTok")
            script_yt = generate_human_script(selected_topic, "YouTube")
            progress.progress(40)
            
            status.text("🔊 HANG MODULÁLÁSA (Mélyítés + Lassítás)...")
            
            status.text("🎞️ TikTok render...")
            file_tk = render_engine(img_url, script_tk, "TikTok")
            progress.progress(70)
            
            status.text("🎞️ YouTube render...")
            file_yt = render_engine(img_url, script_yt, "YouTube")
            progress.progress(100)
            status.success("✅ KÉSZ!")
            
            st.write("---")
            res_col1, res_col2 = st.columns(2)
            
            with res_col1:
                st.markdown("### 📱 TIKTOK")
                st.video(file_tk)
                with open(file_tk, "rb") as f:
                    st.download_button("📥 TIKTOK LETÖLTÉS", f, "onyx_tiktok.mp4", key="dl_tk")
            
            with res_col2:
                st.markdown("### 📺 YOUTUBE")
                st.video(file_yt)
                with open(file_yt, "rb") as f:
                    st.download_button("📥 YOUTUBE LETÖLTÉS", f, "onyx_youtube.mp4", key="dl_yt")
            
            save_to_memory(selected_topic, "Dual")

if __name__ == "__main__":
    main()