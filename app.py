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
from datetime import datetime
from openai import OpenAI

# --- 🛠️ RENDSZER JAVÍTÁS (MONKEY PATCH) ---
# Ez a rész elhiteti a rendszerrel, hogy a régi parancsok léteznek.
# Így a legújabb Pythonon is fut a régi MoviePy.
import PIL.Image
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = PIL.Image.LANCZOS
# ------------------------------------------

from moviepy.editor import *
from moviepy.video.fx.all import resize

# --- 1. KONFIGURÁCIÓ & DESIGN ---
st.set_page_config(page_title="ONYX // OS V6.0", page_icon="👁️", layout="wide")

st.markdown("""
<style>
    .stApp { background-color: #050505; color: #e0e0e0; }
    h1, h2, h3 { color: #00ffcc; font-family: 'Courier New'; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 10px #00ffcc; }
    .stButton>button { background: linear-gradient(45deg, #004433, #000000); color: #00ffcc; border: 1px solid #00ffcc; width: 100%; font-weight: bold; transition: 0.3s; }
    .stButton>button:hover { background: #00ffcc; color: black; box-shadow: 0 0 15px #00ffcc; }
    .stat-box { border: 1px solid #333; padding: 15px; border-radius: 5px; background: rgba(255, 255, 255, 0.05); text-align: center; margin-bottom: 10px; }
    .stat-num { font-size: 24px; font-weight: bold; color: #ff004c; }
    .news-item { padding: 10px; border-bottom: 1px solid #333; font-size: 0.9em; }
    .news-date { color: #888; font-size: 0.8em; font-family: 'Courier New'; }
</style>
""", unsafe_allow_html=True)

# API Kulcs kezelés
api_key = None
try:
    api_key = st.secrets["OPENAI_API_KEY"]
except:
    api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    st.error("⚠️ RENDKÍVÜLI HIBA: NINCS API KULCS! Állítsd be a Secrets-ben!")
    st.stop()

client = OpenAI(api_key=api_key)
HISTORY_FILE = "onyx_memory.json"
BG_MUSIC = "background.mp3"

# --- 2. ADATKEZELÉS ---
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

# --- 3. INTELLIGENCIA & DÁTUMOZÁS ---
def analyze_trends(rss_url):
    try:
        feed = feedparser.parse(requests.get(rss_url, headers={'User-Agent': 'ONYX-BOT'}).content)
        results = []
        for entry in feed.entries[:8]: # Top 8 hír
            # Dátum keresése (többféle formátum lehet)
            date_str = "MAI HÍR"
            if hasattr(entry, 'published'):
                date_str = entry.published[:16] # Levágjuk a felesleget
            elif hasattr(entry, 'updated'):
                date_str = entry.updated[:16]
            
            results.append({"title": entry.title, "date": date_str})
        return results
    except Exception as e:
        st.error(f"Hiba a szkennelésnél: {e}")
        return []

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
        sys_prompt = "CÉL: TikTok videó. Rövid, sokkoló, átterel YouTube-ra. Nincs köszönés, csak a lényeg. 3 mondat."
    else:
        sys_prompt = "CÉL: YouTube tartalom. Mély, filozófiai elemzés. 8 mondat."
    
    user_prompt = f"Téma: {topic}. Vélemény: {opinion}. Írd meg a szöveget magyarul."
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": sys_prompt}, {"role": "user", "content": user_prompt}])
    return clean_script_for_speech(res.choices[0].message.content)

# --- 4. BRANDING & RENDER ---
def generate_onyx_image(topic):
    # A MÁRKA: Kapucnis alak + Téma hologram
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
    headers = {'User-Agent': 'Mozilla/5.0'}
    with open("temp_img.png", "wb") as f: 
        f.write(requests.get(image_url, headers=headers).content)
        
    audio = AudioFileClip(audio_file)
    duration = audio.duration + 0.5
    
    # Kép betöltése
    clip = ImageClip("temp_img.png").set_duration(duration)
    w, h = clip.size
    
    # 9:16 Crop
    if w > h: clip = clip.crop(x1=w/2 - 540, y1=0, width=1080, height=1920)
    else: clip = clip.resize(height=1920).crop(x1=clip.w/2 - 540, width=1080, height=1920)
    
    # Zoom effekt
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
    
    # Gyors renderelés (Ultrafast preset a szerver kímélése érdekében)
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac", threads=2, preset="ultrafast")
    return filename

# --- 5. VEZÉRLŐPULT ---
def main():
    st.title(f"👁️ PROJECT: ONYX // SYSTEM V6.0")
    history = load_memory()
    
    # ANALITIKA
    c1, c2 = st.columns(2)
    with c1: st.markdown(f'<div class="stat-box"><span class="stat-num">{len(history)}</span><br>MEMÓRIA BEJEGYZÉS</div>', unsafe_allow_html=True)
    with c2: st.markdown(f'<div class="stat-box"><span class="stat-num">ONLINE</span><br>NEURÁLIS KAPCSOLAT</div>', unsafe_allow_html=True)
    
    st.write("---")

    # SCANNER
    rss_options = {
        "Futurizmus (Futurology)": "https://www.reddit.com/r/Futurology/top/.rss",
        "Mesterséges Intelligencia": "https://www.reddit.com/r/ArtificialInteligence/top/.rss",
        "Kripto & Pénz": "https://www.reddit.com/r/CryptoCurrency/top/.rss"
    }
    
    selected_source = st.selectbox("FORRÁS KIVÁLASZTÁSA:", list(rss_options.keys()))
    
    if st.button("📡 SCAN NETWORK"):
        with st.spinner("Adatcsomagok elemzése..."):
            entries = analyze_trends(rss_options[selected_source])
            st.session_state['scan'] = entries
        
    if 'scan' in st.session_state:
        # Dátumozott lista megjelenítése
        options_map = {f"[{item['date']}] {item['title']}": item['title'] for item in st.session_state['scan']}
        selected_label = st.selectbox("CÉLPONT KIVÁLASZTÁSA:", list(options_map.keys()))
        topic = options_map[selected_label]
        
        st.write("---")
        platform = st.radio("PLATFORM:", ["TikTok (Csali)", "YouTube"], horizontal=True)
        
        if st.button("🔥 EXECUTE PROTOCOL (GENERÁLÁS)"):
            status = st.status("ONYX dolgozik...", expanded=True)
            
            # 1. Vélemény & Script
            status.write("🧠 Stratégia alkotása...")
            op = get_onyx_opinion(topic, history)
            script = generate_pro_script(topic, platform, op)
            st.info(f"**VÉLEMÉNY:** {op}")
            
            # 2. Hang
            status.write("🔊 Hangszintézis...")
            async def gv():
                rate = "+15%" if "TikTok" in platform else "+5%"
                c = edge_tts.Communicate(script, "hu-HU-TamasNeural", rate=rate)
                await c.save("temp.mp3")
            run_async(gv())
            
            # 3. Kép (BRANDING)
            status.write("🎨 Vizuális manifesztáció...")
            img_url = generate_onyx_image(topic)
            
            # 4. Render
            status.write("🎞️ Videó renderelése...")
            v_file = render_video(img_url, "temp.mp3")
            
            status.update(label="✅ KÉSZ!", state="complete")
            st.video(v_file)
            
            save_to_memory(topic, platform, op, script)
            with open(v_file, "rb") as f: st.download_button("📥 MP4 LETÖLTÉSE", f, "onyx_v6.mp4")

if __name__ == "__main__":
    main()