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
from moviepy.editor import *
from moviepy.video.fx.all import resize

# --- 1. KONFIGURÁCIÓ & DESIGN ---
st.set_page_config(page_title="ONYX // OS V5.0", page_icon="👁️", layout="wide")

st.markdown("""
<style>
    .stApp { background-color: #050505; color: #e0e0e0; }
    h1, h2, h3 { color: #00ffcc; font-family: 'Courier New'; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 10px #00ffcc; }
    .stButton>button { background: linear-gradient(45deg, #004433, #000000); color: #00ffcc; border: 1px solid #00ffcc; width: 100%; font-weight: bold; transition: 0.3s; }
    .stButton>button:hover { background: #00ffcc; color: black; box-shadow: 0 0 15px #00ffcc; }
    .stat-box { border: 1px solid #333; padding: 15px; border-radius: 5px; background: rgba(255, 255, 255, 0.05); text-align: center; margin-bottom: 10px; }
    .stat-num { font-size: 24px; font-weight: bold; color: #ff004c; }
</style>
""", unsafe_allow_html=True)

# API Kulcs
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

# --- 2. LOGIKA ---
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

def save_to_memory(topic, platform, stance, script):
    history = load_memory()
    entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "topic": topic,
        "platform": platform,
        "stance": stance
    }
    history.insert(0, entry)
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history[:50], f, ensure_ascii=False, indent=4)

def clean_script_for_speech(text):
    text = re.sub(r'\s*\(.*?\)\s*', ' ', text)
    text = re.sub(r'\*\*.*?\*\*:', '', text)
    text = re.sub(r'(HOOK|SCENE|CUT|B-ROLL|INTRO|OUTRO):', '', text, flags=re.IGNORECASE)
    return text.strip()

# --- 3. ONYX INTELLIGENCIA ---
def analyze_trends(rss_url):
    try:
        feed = feedparser.parse(requests.get(rss_url, headers={'User-Agent': 'ONYX-BOT'}).content)
        return [entry for entry in feed.entries[:6]]
    except: return []

def get_onyx_opinion(topic, history):
    recent_context = " | ".join([h['topic'] for h in history[:3]])
    prompt = f"""
    Te vagy ONYX. Identitás: Sötét, cinikus, technokrata.
    Téma: "{topic}"
    Múlt: {recent_context}
    Alkoss egy ÉLES, MEGOSZTÓ véleményt. Támadd a naivitást. Max 2 mondat.
    """
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
    return res.choices[0].message.content

def generate_pro_script(topic, platform, opinion):
    if platform == "TikTok (Csali)":
        sys_prompt = "CÉL: TikTok videó. Rövid, sokkoló, átterel YouTube-ra. Nincs köszönés, csak a lényeg."
    else:
        sys_prompt = "CÉL: YouTube tartalom. Mély, filozófiai elemzés."
    
    user_prompt = f"Téma: {topic}. Vélemény: {opinion}. Írd meg a szöveget magyarul."
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": sys_prompt}, {"role": "user", "content": user_prompt}])
    return clean_script_for_speech(res.choices[0].message.content)

# --- 4. MASTER VISUAL GENERÁTOR (BRANDING) ---
def generate_onyx_image(topic):
    # EZ A LÉNYEG: A MASTER PROMPT
    prompt = f"""
    A mysterious hacker figure in a black hoodie standing in the center, 
    face completely hidden in deep shadow, NO facial features visible.
    The figure is looking at a large holographic data projection showing: {topic}.
    Dark cinematic lighting, neon green and black color palette, 
    cyberpunk atmosphere, highly detailed, 8k resolution, vertical 9:16 aspect ratio.
    """
    img_res = client.images.generate(model="dall-e-3", prompt=prompt, size="1024x1792", quality="hd")
    return img_res.data[0].url

def render_video(image_url, audio_file, filename="onyx_render.mp4"):
    with open("temp_img.png", "wb") as f: f.write(requests.get(image_url).content)
    audio = AudioFileClip(audio_file)
    duration = audio.duration + 0.5
    
    clip = ImageClip("temp_img.png").set_duration(duration)
    w, h = clip.size
    
    # 9:16 Crop
    if w > h: clip = clip.crop(x1=w/2 - 540, y1=0, width=1080, height=1920)
    else: clip = clip.resize(height=1920).crop(x1=clip.w/2 - 540, width=1080, height=1920)
    
    # Zoom
    clip = clip.resize(lambda t : 1 + 0.03 * (t / duration))
    clip = clip.set_position(('center', 'center')).crop(width=1080, height=1920)
    
    # Audio
    final_audio = audio
    if os.path.exists(BG_MUSIC):
        try:
            bg = AudioFileClip(BG_MUSIC).volumex(0.08).set_duration(duration)
            final_audio = CompositeAudioClip([audio, bg])
        except: pass
        
    clip = clip.set_audio(final_audio)
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac", threads=2, preset="ultrafast")
    return filename

# --- 5. UI ---
def main():
    st.title(f"👁️ PROJECT: ONYX // V5.0")
    history = load_memory()
    
    # SCANNER
    rss_url = "https://www.reddit.com/r/Futurology/top/.rss"
    if st.button("📡 SCAN NETWORK"):
        entries = analyze_trends(rss_url)
        st.session_state['scan'] = entries
        
    if 'scan' in st.session_state:
        opts = {e.title: e.title for e in st.session_state['scan']}
        topic = st.selectbox("CÉLPONT:", list(opts.keys()))
        platform = st.radio("PLATFORM:", ["TikTok (Csali)", "YouTube"])
        
        if st.button("🔥 EXECUTE PROTOCOL"):
            with st.spinner("Generálás..."):
                # 1. Vélemény & Script
                op = get_onyx_opinion(topic, history)
                script = generate_pro_script(topic, platform, op)
                st.info(f"Vélemény: {op}")
                
                # 2. Hang
                async def gv():
                    rate = "+15%" if "TikTok" in platform else "+5%"
                    c = edge_tts.Communicate(script, "hu-HU-TamasNeural", rate=rate)
                    await c.save("temp.mp3")
                run_async(gv())
                
                # 3. Kép (BRANDING)
                img_url = generate_onyx_image(topic)
                
                # 4. Render
                v_file = render_video(img_url, "temp.mp3")
                st.video(v_file)
                save_to_memory(topic, platform, op, script)
                with open(v_file, "rb") as f: st.download_button("📥 LETÖLTÉS", f, "onyx_v5.mp4")

if __name__ == "__main__":
    main()