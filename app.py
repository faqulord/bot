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

# --- KONFIGURÁCIÓ ---
st.set_page_config(page_title="ONYX // AI INFLUENCER", page_icon="👁️", layout="wide")

# ITT A VÁLTOZÁS: Nem írjuk ide a kulcsot, csak elkérjük a szervertől
api_key = st.secrets["OPENAI_API_KEY"]

client = OpenAI(api_key=api_key)
HISTORY_FILE = "onyx_memory.json"
BG_MUSIC = "background.mp3"

# --- ALAP FÜGGVÉNYEK ---
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

def save_to_memory(topic, platform, stance):
    history = load_memory()
    entry = {"date": datetime.now().strftime("%Y-%m-%d %H:%M"), "topic": topic, "platform": platform, "stance": stance}
    history.insert(0, entry)
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history[:50], f, ensure_ascii=False, indent=4)

def clean_script_for_speech(text):
    text = re.sub(r'\s*\(.*?\)\s*', ' ', text)
    text = re.sub(r'\*\*.*?\*\*:', '', text)
    return text.strip()

# --- ONYX AGY ---
def get_onyx_opinion(topic):
    prompt = f"Te vagy ONYX. Téma: '{topic}'. Alkoss provokatív, sötét, cinikus véleményt 1 mondatban."
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
    return res.choices[0].message.content

def generate_script(topic, platform, opinion):
    system_p = "Te vagy ONYX. Írj egy videó szöveget. Stílus: Sötét, provokatív."
    if platform == "TikTok": system_p += " Legyen rövid, figyelemfelkeltő, küldd át őket YouTube-ra."
    else: system_p += " Legyen mély, elemző, filozófiai."
    
    prompt = f"Téma: {topic}. Véleményed: {opinion}. Írd meg a szöveget."
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": system_p}, {"role": "user", "content": prompt}])
    return clean_script_for_speech(res.choices[0].message.content)

# --- VIDEÓ MOTOR ---
def create_video(image_url, audio_file, filename="onyx_video.mp4"):
    headers = {'User-Agent': 'Mozilla/5.0'}
    with open("temp_img.png", "wb") as f: f.write(requests.get(image_url, headers=headers).content)
    
    audio = AudioFileClip(audio_file)
    clip = ImageClip("temp_img.png").set_duration(audio.duration + 0.5)
    
    # 9:16 Vágás és Zoom
    w, h = clip.size
    if w > h: clip = clip.crop(x1=w/2 - 540, y1=0, width=1080, height=1920)
    else: clip = clip.resize(height=1920).crop(x1=clip.w/2 - 540, width=1080, height=1920)
    
    # Zoom effekt
    clip = clip.resize(lambda t : 1 + 0.04 * (t / clip.duration))
    clip = clip.set_position(('center', 'center')).crop(width=1080, height=1920)
    
    clip = clip.set_audio(audio)
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac")
    return filename

# --- UI ---
def main():
    st.title("👁️ ONYX // V3.0 (Mobile Edition)")
    
    rss_url = "https://www.reddit.com/r/Futurology/top/.rss"
    if st.button("📡 SCAN"):
        d = feedparser.parse(requests.get(rss_url, headers={'User-Agent': 'ONYX'}).content)
        st.session_state['topics'] = [e.title for e in d.entries[:5]]
        
    if 'topics' in st.session_state:
        topic = st.selectbox("Téma:", st.session_state['topics'])
        platform = st.radio("Platform:", ["TikTok", "YouTube"])
        
        if st.button("🎬 ACTION"):
            with st.spinner("Generálás..."):
                opinion = get_onyx_opinion(topic)
                script = generate_script(topic, platform, opinion)
                st.info(f"Vélemény: {opinion}")
                
                async def gen_voice():
                    rate = "+15%" if platform == "TikTok" else "+5%"
                    c = edge_tts.Communicate(script, "hu-HU-TamasNeural", rate=rate)
                    await c.save("temp.mp3")
                run_async(gen_voice())
                
                img_p = f"Dark cinematic vertical art, {topic}, mysterious, 8k"
                img = client.images.generate(model="dall-e-3", prompt=img_p, size="1024x1792").data[0].url
                
                video_file = create_video(img, "temp.mp3")
                st.video(video_file)
                with open(video_file, "rb") as f: st.download_button("Letöltés", f, "onyx.mp4")

if __name__ == "__main__":
    main()