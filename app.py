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

# --- HACKER JAVÍTÁS (Kötelező) ---
import PIL.Image
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = PIL.Image.LANCZOS
# ---------------------------------

from moviepy.editor import *

# --- 1. DESIGN: LILA & FEKETE (PURPLE HAZE) ---
st.set_page_config(page_title="ONYX // OS V12", page_icon="🟣", layout="wide")

st.markdown("""
<style>
    .stApp { background-color: #05000a; color: #d0d0d0; font-family: 'Verdana', sans-serif; }
    h1 { 
        color: #b829ff; 
        text-align: center; 
        text-transform: uppercase; 
        letter-spacing: 6px; 
        text-shadow: 0 0 25px #b829ff; 
        border-bottom: 2px solid #b829ff; 
        padding-bottom: 20px; 
    }
    h3 { color: #fff; }
    .stButton>button { 
        background: #000; 
        color: #b829ff; 
        border: 1px solid #b829ff; 
        font-weight: bold; 
        font-size: 16px; 
        padding: 15px; 
        width: 100%; 
        transition: 0.3s; 
        text-transform: uppercase;
    }
    .stButton>button:hover { background: #b829ff; color: #fff; box-shadow: 0 0 30px #b829ff; }
    .news-box { border-left: 3px solid #b829ff; padding-left: 10px; margin-bottom: 10px; background: #12001a; }
    .source-tag { color: #888; font-size: 0.8em; font-style: italic; }
    .stat-card { background: #1a0026; border: 1px solid #5a0080; padding: 15px; border-radius: 5px; text-align: center; color: #fff; }
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
MASTER_IMG = "onyx_master_v12.png" 
OUTRO_IMG = "onyx_outro_v12.png"

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

# --- 3. MASTER IMAGE GENERÁTOR (GEMINI PROMPTJA) ---
def generate_master_assets():
    # EZ AZ A PROMPT, AMIT ÉN ÍRTAM NEKED:
    prompt_intro = """
    A futuristic 4D render masterpiece. 
    A mysterious figure in a high-tech black hoodie sits in a gaming chair in front of a massive supercomputer setup.
    The room is dark, illuminated only by aggressive PURPLE and BLACK neon lights.
    The figure's face is hidden in shadow.
    On the back of the hoodie or on the main screen, the text "ONYX" is clearly visible in glowing neon letters.
    Style: Hyper-realistic, Octane Render, Cyberpunk, 8k resolution, highly detailed.
    Vertical 9:16 aspect ratio.
    """
    
    prompt_outro = """
    Vertical 9:16 aspect ratio.
    A dark, glitchy background in PURPLE and BLACK aesthetics.
    In the center, a large glowing neon text says: "ONYX".
    Below it, a "SUBSCRIBE" graphic.
    Style: Cyberpunk, high contrast, digital art.
    """
    
    try:
        # Intro
        res_intro = client.images.generate(model="dall-e-3", prompt=prompt_intro, size="1024x1792", quality="hd")
        with open(MASTER_IMG, "wb") as f: f.write(requests.get(res_intro.data[0].url).content)
        
        # Outro
        res_outro = client.images.generate(model="dall-e-3", prompt=prompt_outro, size="1024x1792", quality="hd")
        with open(OUTRO_IMG, "wb") as f: f.write(requests.get(res_outro.data[0].url).content)
        return True
    except Exception as e:
        st.error(f"Kép hiba: {e}")
        return False

# --- 4. SZKRIPT ÍRÁS (FORRÁS MEGJELÖLÉSSEL) ---
def generate_long_script(topic, source_name, platform):
    
    if platform == "TikTok":
        length_instr = "Rövid, ütős, max 150 szó."
        structure = "Horog -> A Tény -> A Veszély -> Konklúzió."
    else:
        length_instr = "Podcast stílus, minimum 400 szó."
        structure = "Intro -> Tények -> Háttérhatalom/Okok -> Elemzés -> Lezárás."

    prompt = f"""
    Te vagy ONYX. Sötét, lila neonfényben élő AI entitás.
    Téma: "{topic}"
    Forrás: {source_name}
    
    FELADAT: {length_instr}
    {structure}
    
    STÍLUS:
    - Említsd meg a forrást a hitelességért (pl. "A {source_name} jelentése szerint...").
    - Használj szüneteket (...) a feszültségkeltéshez.
    - Légy tárgyilagos, de félelmetes.
    
    Írd meg a narrációt magyarul.
    """
    
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": "Te vagy ONYX."}, {"role": "user", "content": prompt}])
    text = res.choices[0].message.content
    return re.sub(r'\*+', '', text).strip()

# --- 5. HANG GENERÁLÁS ---
async def generate_voice(text, filename):
    communicate = edge_tts.Communicate(text, "hu-HU-TamasNeural", rate="-8%", pitch="-20Hz")
    await communicate.save(filename)

# --- 6. RENDER MOTOR ---
def render_full_video(topic_img_url, script, platform):
    with open("temp_topic.png", "wb") as f: f.write(requests.get(topic_img_url).content)
    run_async(generate_voice(script, "temp_audio.mp3"))
    
    audio = AudioFileClip("temp_audio.mp3")
    duration = audio.duration + 1.0
    
    # Klipek (Hosszú videónál váltogatunk)
    # Master Kép (Intro): 5 mp
    intro_dur = 5.0
    topic_dur = duration - intro_dur
    if topic_dur < 1: topic_dur = 1
    
    clip_intro = ImageClip(MASTER_IMG).set_duration(intro_dur)
    clip_intro = clip_intro.resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960)
    
    clip_topic = ImageClip("temp_topic.png").set_duration(topic_dur)
    clip_topic = clip_topic.resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960)
    
    final_video = concatenate_videoclips([clip_intro, clip_topic])
    
    # Outro YouTube-nál
    if platform == "YouTube" and os.path.exists(OUTRO_IMG):
        clip_outro = ImageClip(OUTRO_IMG).set_duration(4.0).resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960)
        final_video = concatenate_videoclips([final_video, clip_outro])
    
    # Hang
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

    out_file = f"onyx_{platform}_v12.mp4"
    final_video.write_videofile(out_file, fps=24, codec="libx264", audio_codec="aac", threads=2, preset="ultrafast")
    return out_file

# --- 7. VEZÉRLŐPULT ---
def main():
    st.title("🟣 PROJECT: ONYX // V12 PURPLE HAZE")
    
    # SETUP CHECK
    if not os.path.exists(MASTER_IMG):
        st.warning("⚠️ ÚJ STÍLUS (LILA/FEKETE) ÉSZLELVE!")
        st.info("Nyomd meg a gombot, hogy legeneráljam neked az Új 4D Onyx karaktert a gépe előtt.")
        if st.button("🛠️ SETUP: ÚJ 4D MASTER KÉP GENERÁLÁSA"):
            with st.spinner("Gemini utasítása küldése a DALL-E-nek..."):
                if generate_master_assets():
                    st.success("✅ Kész! Az új arculat elmentve.")
                    st.rerun()
        st.stop()
    
    c1, c2, c3 = st.columns(3)
    c1.image(MASTER_IMG, caption="4D ONYX MASTER", width=150)
    c2.markdown('<div class="stat-card">🧠 DEEP BRAIN<br>AKTÍV</div>', unsafe_allow_html=True)
    c3.markdown('<div class="stat-card">🎨 STÍLUS<br>LILA/FEKETE</div>', unsafe_allow_html=True)
    
    st.write("---")
    
    # HÍR FIGYELŐ (FORRÁSSAL)
    rss_url = "https://www.reddit.com/r/Futurology/top/.rss"
    
    if st.button("🔄 HÁLÓZAT SZKENNELÉSE"):
        feed = feedparser.parse(requests.get(rss_url, headers={'User-Agent': 'ONYX'}).content)
        news_items = []
        for e in feed.entries[:6]:
            # Forrás domain kinyerése (pl. reddit.com)
            source = "Reddit"
            if hasattr(e, 'link'):
                # Egyszerű domain levágás
                try: source = e.link.split('/')[2].replace('www.', '')
                except: pass
                
            date_str = "Ma"
            if hasattr(e, 'updated'): date_str = e.updated[:10]
            
            label = f"[{date_str}] {e.title} ({source})"
            news_items.append({"label": label, "title": e.title, "source": source, "date": date_str})
        st.session_state['news'] = news_items
            
    if 'news' in st.session_state:
        opts = {i['label']: i for i in st.session_state['news']}
        sel = st.selectbox("Válassz célpontot:", list(opts.keys()))
        selected_item = opts[sel]
        
        st.write("---")
        platform = st.radio("Mód:", ["TikTok", "YouTube (Podcast)"])
        
        if st.button("🔥 GENERÁLÁS (LILA MÓD)"):
            status = st.status("ONYX dolgozik...", expanded=True)
            
            # 1. KÉP
            status.write("🎨 Téma kép (Lila esztétika)...")
            t_prompt = f"Cyberpunk illustration of {selected_item['title']}. Purple and black neon lighting, dark atmosphere, 4D render style."
            t_res = client.images.generate(model="dall-e-3", prompt=t_prompt, size="1024x1792", quality="hd")
            t_url = t_res.data[0].url
            
            # 2. SZÖVEG
            status.write("📝 Szkript írása...")
            script = generate_long_script(selected_item['title'], selected_item['source'], platform)
            
            # 3. RENDER
            status.write("🎞️ Videó renderelése...")
            try:
                v_file = render_full_video(t_url, script, platform)
                status.update(label="✅ KÉSZ!", state="complete")
                
                c_res1, c_res2 = st.columns(2)
                c_res1.video(v_file)
                with open(v_file, "rb") as f:
                    c_res2.download_button("📥 VIDEÓ LETÖLTÉSE", f, "onyx_v12.mp4")
                    
            except Exception as e:
                st.error(f"Hiba: {e}")

if __name__ == "__main__":
    main()