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

# --- 🛠️ HACKER JAVÍTÁS (MOVIEPY FIX) ---
import PIL.Image
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = PIL.Image.LANCZOS
# ---------------------------------------

from moviepy.editor import *

# --- 1. DESIGN: ULTIMATE PURPLE ---
st.set_page_config(page_title="ONYX // V13.1 STABLE", page_icon="🟣", layout="wide")

st.markdown("""
<style>
    /* ALAP BEÁLLÍTÁSOK */
    .stApp { background-color: #05000a; color: #e0e0e0; font-family: 'Verdana', sans-serif; }
    
    /* CÍMSOROK */
    h1 { 
        color: #b829ff; text-align: center; text-transform: uppercase; letter-spacing: 8px; 
        text-shadow: 0 0 30px #b829ff; border-bottom: 2px solid #b829ff; padding-bottom: 20px; 
    }
    h2, h3 { color: #fff; text-shadow: 0 0 10px #b829ff; }
    
    /* GOMBOK */
    .stButton>button { 
        background: #000; color: #b829ff; border: 1px solid #b829ff; 
        font-weight: bold; font-size: 16px; padding: 15px; width: 100%; transition: 0.3s; text-transform: uppercase;
    }
    .stButton>button:hover { background: #b829ff; color: #fff; box-shadow: 0 0 40px #b829ff; transform: scale(1.02); }
    
    /* STÁTUSZ KÁRTYÁK */
    .stat-card { background: #1a0026; border: 1px solid #5a0080; padding: 15px; border-radius: 5px; text-align: center; color: #fff; box-shadow: 0 0 10px rgba(184, 41, 255, 0.2); }
    
    /* SIDEBAR (ELŐZMÉNYEK) */
    [data-testid="stSidebar"] { background-color: #0a0014; border-right: 1px solid #b829ff; }
    .history-item { padding: 10px; border-bottom: 1px solid #333; font-size: 0.8em; color: #aaa; margin-bottom: 5px; }
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
MASTER_IMG = "onyx_master_v13.png" 
OUTRO_IMG = "onyx_outro_v13.png"

# --- 2. MEMÓRIA & ELŐZMÉNYEK (JAVÍTVA) ---
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

def save_to_memory(topic):
    history = load_memory()
    entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"), 
        "topic": topic, 
        "status": "DUAL RENDER COMPLETED"
    }
    history.insert(0, entry)
    with open(HISTORY_FILE, "w", encoding="utf-8") as f: json.dump(history[:50], f, ensure_ascii=False, indent=4)

def clear_memory():
    if os.path.exists(HISTORY_FILE):
        os.remove(HISTORY_FILE)

# --- 3. MASTER ASSET GENERÁTOR (4D LILA STÍLUS) ---
def generate_master_assets():
    prompt_intro = """
    A futuristic 4D render masterpiece of a mysterious character named ONYX. 
    A figure in a high-tech black hoodie sits in a command center in front of supercomputers.
    The room is illuminated by aggressive PURPLE and BLACK neon lights.
    The figure's face is hidden in shadow.
    The text "ONYX" is visible on a screen in the background in glowing neon letters.
    Style: Hyper-realistic, Octane Render, Cyberpunk, 8k resolution. Vertical 9:16.
    """
    
    prompt_outro = """
    Vertical 9:16 aspect ratio.
    A dark, glitchy background in PURPLE and BLACK aesthetics.
    In the center, large glowing neon text: "ONYX".
    Below it, a red "SUBSCRIBE" button graphic.
    Style: Cyberpunk, high contrast digital art.
    """
    
    try:
        res_intro = client.images.generate(model="dall-e-3", prompt=prompt_intro, size="1024x1792", quality="hd")
        with open(MASTER_IMG, "wb") as f: f.write(requests.get(res_intro.data[0].url).content)
        
        res_outro = client.images.generate(model="dall-e-3", prompt=prompt_outro, size="1024x1792", quality="hd")
        with open(OUTRO_IMG, "wb") as f: f.write(requests.get(res_outro.data[0].url).content)
        return True
    except Exception as e:
        st.error(f"Kép hiba: {e}")
        return False

# --- 4. DEEP BRAIN & SZKRIPT (KUTATÓ MÓD) ---
def deep_research(topic):
    prompt = f"""
    Téma: "{topic}"
    FELADAT: Elemezd ezt a hírt.
    1. Mi a sötét háttér?
    2. Mi a technológiai veszély?
    3. Vonj párhuzamot egy disztópikus filmmel vagy könyvvel.
    Írj 3 rövid vázlatpontot.
    """
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
    return res.choices[0].message.content

def generate_script(topic, research, source_name, platform):
    if platform == "TikTok":
        length_instr = "Rövid, ütős, max 120 szó."
        structure = "Horog -> A Tény -> A Veszély -> Konklúzió."
    else: # YouTube
        length_instr = "Podcast stílus, minimum 350 szó. Legyen mély és elemző."
        structure = "Intro -> Részletes Tények -> Háttérhatalom/Okok -> Elemzés (Research alapján) -> Lezárás."

    prompt = f"""
    Te vagy ONYX. Sötét, lila neonfényben élő AI entitás.
    Téma: "{topic}"
    Forrás: {source_name}
    Kutatás: {research}
    
    FELADAT: {length_instr}
    {structure}
    
    STÍLUS:
    - Említsd meg a forrást ("A {source_name} szerint...").
    - Használj szüneteket (...) a feszültségkeltéshez.
    - Légy tárgyilagos, de félelmetes.
    
    Írd meg a narrációt magyarul.
    """
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": "Te vagy ONYX."}, {"role": "user", "content": prompt}])
    return re.sub(r'\*+', '', res.choices[0].message.content).strip()

# --- 5. HANG GENERÁLÁS (MODDED TAMÁS) ---
async def generate_voice(text, filename):
    communicate = edge_tts.Communicate(text, "hu-HU-TamasNeural", rate="-8%", pitch="-20Hz")
    await communicate.save(filename)

# --- 6. RENDER MOTOR (DUAL CORE) ---
def render_video(topic_img_url, script, platform):
    if not os.path.exists("temp_topic.png"):
        with open("temp_topic.png", "wb") as f: f.write(requests.get(topic_img_url).content)
    
    audio_file = f"temp_audio_{platform}.mp3"
    run_async(generate_voice(script, audio_file))
    
    audio = AudioFileClip(audio_file)
    duration = audio.duration + 1.0
    
    intro_dur = 4.0
    topic_dur = duration - intro_dur
    if topic_dur < 1: topic_dur = 1
    
    clip_intro = ImageClip(MASTER_IMG).set_duration(intro_dur)
    clip_intro = clip_intro.resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960)
    
    clip_topic = ImageClip("temp_topic.png").set_duration(topic_dur)
    clip_topic = clip_topic.resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960)
    
    clips = [clip_intro, clip_topic]
    
    if platform == "YouTube" and os.path.exists(OUTRO_IMG):
        clip_outro = ImageClip(OUTRO_IMG).set_duration(4.0).resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960)
        clips.append(clip_outro)
    
    final_video = concatenate_videoclips(clips)
    
    if os.path.exists(BG_MUSIC):
        bg = AudioFileClip(BG_MUSIC).volumex(0.08)
        if bg.duration < final_video.duration:
            bg = afx.audio_loop(bg, duration=final_video.duration)
        else:
            bg = bg.set_duration(final_video.duration)
        final_audio = CompositeAudioClip([audio, bg])
        final_video = final_video.set_audio(final_audio)
    else:
        final_video = final_video.set_audio(audio)

    out_file = f"onyx_{platform}_v13.mp4"
    final_video.write_videofile(out_file, fps=24, codec="libx264", audio_codec="aac", threads=2, preset="ultrafast")
    return out_file

# --- 7. VEZÉRLŐPULT (MAIN UI) ---
def main():
    # --- SIDEBAR: MEMÓRIA (JAVÍTVA) ---
    with st.sidebar:
        st.header("🗄️ MEMÓRIA BANK")
        if st.button("🗑️ MEMÓRIA TÖRLÉSE"):
            clear_memory()
            st.rerun()
            
        history = load_memory()
        if not history:
            st.write("Az adatbázis üres.")
        else:
            for item in history:
                # GOLYÓÁLLÓ VÉDELEM: Ha hiányzik adat, nem omlik össze
                ts = item.get('timestamp', 'Ismeretlen idő')
                tp = item.get('topic', 'Ismeretlen téma')
                st.markdown(f"""
                <div class="history-item">
                    <b>{ts}</b><br>
                    {tp[:30]}...
                </div>
                """, unsafe_allow_html=True)
            
    # --- MAIN PAGE ---
    st.title("🟣 PROJECT: ONYX // V13.1 STABLE")
    
    if not os.path.exists(MASTER_IMG):
        st.warning("⚠️ AZ ÚJ RENDSZER TELEPÍTÉST IGÉNYEL!")
        if st.button("🛠️ SETUP: ONYX 4D LILA RENDSZER ÉLESÍTÉSE"):
            with st.spinner("Gemini utasítása küldése a DALL-E-nek..."):
                if generate_master_assets():
                    st.success("✅ Rendszer élesítve!")
                    st.rerun()
        st.stop()
    
    c1, c2, c3 = st.columns(3)
    c1.image(MASTER_IMG, width=120)
    c2.markdown('<div class="stat-card">🧠 DUAL CORE<br>ONLINE</div>', unsafe_allow_html=True)
    c3.markdown('<div class="stat-card">🎨 STÍLUS<br>LILA / FEKETE</div>', unsafe_allow_html=True)
    
    st.write("---")
    
    rss_url = "https://www.reddit.com/r/Futurology/top/.rss"
    if st.button("🔄 HÁLÓZAT SZKENNELÉSE (RSS)"):
        feed = feedparser.parse(requests.get(rss_url, headers={'User-Agent': 'ONYX'}).content)
        news_items = []
        for e in feed.entries[:6]:
            source = "Reddit"
            try: source = e.link.split('/')[2].replace('www.', '')
            except: pass
            date_str = e.updated[:10] if hasattr(e, 'updated') else "Ma"
            label = f"[{date_str}] {e.title} ({source})"
            news_items.append({"label": label, "title": e.title, "source": source})
        st.session_state['news'] = news_items
            
    if 'news' in st.session_state:
        opts = {i['label']: i for i in st.session_state['news']}
        sel = st.selectbox("Válassz hírt:", list(opts.keys()))
        selected_item = opts[sel]
        
        st.write("---")
        st.subheader("🔥 AUTOMATIKUS GYÁRTÁS (DUAL MODE)")
        st.write("Ez a gomb egyszerre gyártja le a TikTok és YouTube verziót.")
        
        if st.button("🚀 EXECUTE FULL PROTOCOL"):
            status = st.status("ONYX dolgozik...", expanded=True)
            
            status.write("🧠 Mély kutatás (Deep Research)...")
            research = deep_research(selected_item['title'])
            
            status.write("🎨 Téma kép generálása (Lila esztétika)...")
            t_prompt = f"Cyberpunk illustration of {selected_item['title']}. Purple and black neon lighting, dark atmosphere, 4D render style. No text."
            t_res = client.images.generate(model="dall-e-3", prompt=t_prompt, size="1024x1792", quality="hd")
            t_url = t_res.data[0].url
            
            status.write("📝 Forgatókönyvek írása...")
            script_tk = generate_script(selected_item['title'], research, selected_item['source'], "TikTok")
            script_yt = generate_script(selected_item['title'], research, selected_item['source'], "YouTube")
            
            status.write("🎞️ TikTok verzió renderelése...")
            file_tk = render_video(t_url, script_tk, "TikTok")
            
            status.write("🎞️ YouTube verzió renderelése (Hosszú)...")
            file_yt = render_video(t_url, script_yt, "YouTube")
            
            save_to_memory(selected_item['title'])
            
            status.update(label="✅ GYÁRTÁS BEFEJEZŐDÖTT!", state="complete")
            
            st.write("---")
            col_a, col_b = st.columns(2)
            
            with col_a:
                st.markdown("### 📱 TIKTOK VERZIÓ")
                st.video(file_tk)
                with open(file_tk, "rb") as f:
                    st.download_button("📥 TIKTOK LETÖLTÉS", f, "onyx_tiktok_final.mp4")
            
            with col_b:
                st.markdown("### 📺 YOUTUBE VERZIÓ")
                st.video(file_yt)
                with open(file_yt, "rb") as f:
                    st.download_button("📥 YOUTUBE LETÖLTÉS", f, "onyx_youtube_final.mp4")

if __name__ == "__main__":
    main()