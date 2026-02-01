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

# --- 🛠️ HACKER JAVÍTÁS (MONKEY PATCH) ---
# Ez kötelező, hogy a MoviePy elinduljon
import PIL.Image
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = PIL.Image.LANCZOS
# ----------------------------------------

from moviepy.editor import *
# Nem importáljuk a resize-t, hogy véletlenül se használjuk hibásan
# from moviepy.video.fx.all import resize 

# --- 1. KONFIGURÁCIÓ ---
st.set_page_config(page_title="ONYX // OS V6.2", page_icon="👁️", layout="wide")

st.markdown("""
<style>
    .stApp { background-color: #000000; color: #e0e0e0; }
    h1, h2, h3 { color: #00ffcc; font-family: 'Courier New'; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 10px #00ffcc; }
    .stButton>button { background: #111; color: #00ffcc; border: 1px solid #00ffcc; width: 100%; font-weight: bold; }
    .stButton>button:hover { background: #00ffcc; color: black; }
    .stat-box { border: 1px solid #333; padding: 15px; border-radius: 5px; background: #0a0a0a; text-align: center; margin-bottom: 10px; }
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
    st.error("⚠️ RENDKÍVÜLI HIBA: NINCS API KULCS! Állítsd be a Secrets-ben!")
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
        results = []
        for entry in feed.entries[:8]:
            date_str = "FRISS ADAT"
            if hasattr(entry, 'published'): date_str = entry.published[:16]
            elif hasattr(entry, 'updated'): date_str = entry.updated[:16]
            results.append({"title": entry.title, "date": date_str})
        return results
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
        sys_prompt = "CÉL: TikTok videó. Rövid, sokkoló, átterel YouTube-ra. Nincs köszönés, csak a lényeg. 3 mondat."
    else:
        sys_prompt = "CÉL: YouTube tartalom. Mély, filozófiai elemzés. 8 mondat."
    
    user_prompt = f"Téma: {topic}. Vélemény: {opinion}. Írd meg a szöveget magyarul."
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": sys_prompt}, {"role": "user", "content": user_prompt}])
    return clean_script_for_speech(res.choices[0].message.content)

# --- 4. BRANDING & STABIL RENDER (V6.2) ---
def generate_onyx_image(topic):
    # MASTER PROMPT: Kapucnis alak + Hologram
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
    # 1. Kép letöltése
    headers = {'User-Agent': 'Mozilla/5.0'}
    with open("temp_img.png", "wb") as f: 
        f.write(requests.get(image_url, headers=headers).content)
        
    audio = AudioFileClip(audio_file)
    duration = audio.duration + 0.5 
    
    # 2. Kép betöltése
    clip = ImageClip("temp_img.png").set_duration(duration)
    
    # 3. FIX MÉRETEZÉS (Nincs dinamikus zoom, ami a hibát okozta)
    # Biztonságos méretezés egész számokkal
    target_height = 1920
    target_width = 1080
    
    # Átméretezés magasságra (int() használata a biztonságért)
    clip = clip.resize(height=target_height)
    
    # Középre vágás
    x_center = int(clip.w / 2)
    y_center = int(clip.h / 2)
    clip = clip.crop(width=target_width, height=target_height, x_center=x_center, y_center=y_center)
    
    # 4. Audio összefűzés
    final_audio = audio
    if os.path.exists(BG_MUSIC):
        try:
            bg = AudioFileClip(BG_MUSIC).volumex(0.08).set_duration(duration)
            final_audio = CompositeAudioClip([audio, bg])
        except: pass
        
    clip = clip.set_audio(final_audio)
    
    # 5. Renderelés (Biztonságos módban)
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac", threads=2, preset="ultrafast")
    return filename

# --- 5. VEZÉRLŐPULT ---
def main():
    st.title(f"👁️ PROJECT: ONYX // SYSTEM V6.2")
    history = load_memory()
    
    # ANALITIKA
    c1, c2 = st.columns(2)
    with c1: st.markdown(f'<div class="stat-box"><span class="stat-num">{len(history)}</span><br>MEMÓRIA BEJEGYZÉS</div>', unsafe_allow_html=True)
    with c2: st.markdown(f'<div class="stat-box"><span class="stat-num">STABIL</span><br>RENDER MOTOR</div>', unsafe_allow_html=True)
    
    st.write("---")

    # SCANNER
    rss_options = {
        "Futurizmus (Futurology)": "https://www.reddit.com/r/Futurology/top/.rss",
        "Mesterséges Intelligencia": "https://www.reddit.com/r/ArtificialInteligence/top/.rss",
        "Kripto & Pénz": "https://www.reddit.com/r/CryptoCurrency/top/.rss"
    }
    
    source = st.selectbox("FORRÁS:", list(rss_options.keys()))
    
    if st.button("📡 SCAN NETWORK"):
        with st.spinner("Adatcsomagok elemzése..."):
            entries = analyze_trends(rss_options[source])
            st.session_state['scan'] = entries
        
    if 'scan' in st.session_state:
        # Dátumozott lista
        options = {f"[{i['date']}] {i['title']}": i['title'] for i in st.session_state['scan']}
        sel = st.selectbox("CÉLPONT:", list(options.keys()))
        topic = options[sel]
        
        st.write("---")
        platform = st.radio("PLATFORM:", ["TikTok (Csali)", "YouTube"], horizontal=True)
        
        if st.button("🔥 GENERÁLÁS INDÍTÁSA"):
            status = st.status("ONYX dolgozik...", expanded=True)
            
            # 1. Script
            status.write("🧠 Stratégia...")
            op = get_onyx_opinion(topic, history)
            script = generate_pro_script(topic, platform, op)
            st.info(f"{op}")
            
            # 2. Hang
            status.write("🔊 Hang...")
            async def gv():
                rate = "+15%" if "TikTok" in platform else "+5%"
                c = edge_tts.Communicate(script, "hu-HU-TamasNeural", rate=rate)
                await c.save("temp.mp3")
            run_async(gv())
            
            # 3. Kép
            status.write("🎨 Vizuál...")
            img = generate_onyx_image(topic)
            
            # 4. Render
            status.write("🎞️ Renderelés (Biztonságos mód)...")
            try:
                v_file = render_video(img, "temp.mp3")
                status.update(label="✅ KÉSZ!", state="complete")
                st.video(v_file)
                save_to_memory(topic, platform, op, script)
                with open(v_file, "rb") as f: st.download_button("📥 MP4 LETÖLTÉSE", f, "onyx_v6_2.mp4")
            except Exception as e:
                st.error(f"Kritikus hiba: {e}")

if __name__ == "__main__":
    main()