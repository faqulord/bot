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
from bs4 import BeautifulSoup

# --- 🛠️ HACKER JAVÍTÁS ---
import PIL.Image
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = PIL.Image.LANCZOS
# -------------------------

from moviepy.editor import *

# --- 1. DESIGN: VIRAL PURPLE V15 ---
st.set_page_config(page_title="ONYX // V15 VIRAL", page_icon="🟣", layout="wide")

st.markdown("""
<style>
    .stApp { background-color: #05000a; color: #e0e0e0; font-family: 'Verdana', sans-serif; }
    h1 { color: #b829ff; text-align: center; letter-spacing: 8px; text-shadow: 0 0 30px #b829ff; border-bottom: 2px solid #b829ff; padding-bottom: 20px; }
    .stButton>button { background: #000; color: #b829ff; border: 1px solid #b829ff; font-weight: bold; padding: 15px; width: 100%; transition: 0.3s; text-transform: uppercase; }
    .stButton>button:hover { background: #b829ff; color: #fff; box-shadow: 0 0 40px #b829ff; }
    .viral-box { border: 2px solid #00ffff; background: #002222; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center; color: #00ffff; font-weight: bold; }
    .history-item { padding: 8px; border-bottom: 1px solid #333; font-size: 0.8em; color: #888; }
    [data-testid="stSidebar"] { background-color: #0a0014; border-right: 1px solid #b829ff; }
</style>
""", unsafe_allow_html=True)

api_key = st.secrets["OPENAI_API_KEY"] if "OPENAI_API_KEY" in st.secrets else os.getenv("OPENAI_API_KEY")
if not api_key: st.stop()

client = OpenAI(api_key=api_key)
HISTORY_FILE = "onyx_memory.json"
BG_MUSIC = "background.mp3"
MASTER_IMG = "onyx_master_v13.png"
OUTRO_IMG = "onyx_outro_v13.png"

# --- 2. INTELLIGENCIA (VIRAL SCOUT) ---
def analyze_viral_pick(news_list):
    # Ez a függvény kiválasztja a legjobbat
    titles = "\n".join([f"- {n['title']}" for n in news_list])
    prompt = f"""
    Te vagy a TikTok algoritmus szakértője. Itt van 6 hír:
    {titles}
    
    Melyiknek van a legnagyobb esélye, hogy VIRÁLIS legyen (félelem, pénz, jövő)?
    Válassz ki EGYET.
    Válasz formátum: Csak a hír címe, semmi más.
    """
    try:
        res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
        return res.choices[0].message.content.strip()
    except:
        return "Nem sikerült elemezni."

def scrape_article(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        title = soup.find('h1').get_text().strip() if soup.find('h1') else "Cím nem található"
        paragraphs = soup.find_all('p')
        text = " ".join([p.get_text() for p in paragraphs[:10]])
        return {"title": title, "content": text, "source": url.split('/')[2]}
    except:
        return {"title": "Hiba", "content": "", "source": "Error"}

# --- 3. ALAPOK ---
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
        with open(HISTORY_FILE, "r") as f: return json.load(f)
    except: return []

def save_to_memory(topic):
    history = load_memory()
    history.insert(0, {"timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"), "topic": topic})
    with open(HISTORY_FILE, "w") as f: json.dump(history[:50], f, indent=4)

# --- 4. GENERÁTOROK ---
def deep_research_from_text(topic, context_text):
    prompt = f"Téma: {topic}\nSzöveg: {context_text[:1500]}\nElemezd: 1. Sötét háttér? 2. Technológiai veszély? 3. Disztópikus párhuzam?"
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
    return res.choices[0].message.content

def generate_script(topic, research, source_name, platform):
    length = "120 szó" if platform == "TikTok" else "400 szó"
    structure = "Horog -> Tény -> Veszély -> Konklúzió" if platform == "TikTok" else "Intro -> Részletek -> Háttér -> Elemzés -> Lezárás"
    prompt = f"Te vagy ONYX.\nTéma: {topic} ({source_name})\nKutatás: {research}\nPlatform: {platform} ({length})\nStílus: Sötét, cinikus. Említsd a forrást."
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
    return re.sub(r'\*+', '', res.choices[0].message.content).strip()

async def generate_voice(text, filename):
    communicate = edge_tts.Communicate(text, "hu-HU-TamasNeural", rate="-8%", pitch="-20Hz")
    await communicate.save(filename)

def render_video(topic_img_url, script, platform):
    if not os.path.exists("temp_topic.png"):
        with open("temp_topic.png", "wb") as f: f.write(requests.get(topic_img_url).content)
    
    run_async(generate_voice(script, f"temp_audio_{platform}.mp3"))
    audio = AudioFileClip(f"temp_audio_{platform}.mp3")
    duration = audio.duration + 1.0
    
    intro_dur = 4.0
    clips = [
        ImageClip(MASTER_IMG).set_duration(intro_dur).resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960),
        ImageClip("temp_topic.png").set_duration(max(1, duration - intro_dur)).resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960)
    ]
    
    if platform == "YouTube" and os.path.exists(OUTRO_IMG):
        clips.append(ImageClip(OUTRO_IMG).set_duration(4.0).resize(height=1920).crop(width=1080, height=1920, x_center=540, y_center=960))
    
    final = concatenate_videoclips(clips)
    
    if os.path.exists(BG_MUSIC):
        bg = AudioFileClip(BG_MUSIC).volumex(0.08)
        if bg.duration < final.duration: bg = afx.audio_loop(bg, duration=final.duration)
        else: bg = bg.set_duration(final.duration)
        final = final.set_audio(CompositeAudioClip([audio, bg]))
    else:
        final = final.set_audio(audio)

    out_file = f"onyx_{platform}_v15.mp4"
    final.write_videofile(out_file, fps=24, codec="libx264", audio_codec="aac", threads=2, preset="ultrafast")
    return out_file

# --- 5. VEZÉRLŐPULT ---
def main():
    st.sidebar.header("🗄️ MEMÓRIA")
    if st.sidebar.button("🗑️ TÖRLÉS"):
        if os.path.exists(HISTORY_FILE): os.remove(HISTORY_FILE)
        st.rerun()
    for i in load_memory(): 
        st.sidebar.text(f"{i.get('timestamp','?')} - {i.get('topic','?')[:15]}...")

    st.title("🟣 PROJECT: ONYX // V15 VIRAL")
    
    # State init
    if 'selected_data' not in st.session_state: st.session_state['selected_data'] = None
    if 'viral_tip' not in st.session_state: st.session_state['viral_tip'] = None

    if not os.path.exists(MASTER_IMG):
        st.warning("⚠️ SETUP SZÜKSÉGES!")
        st.stop()

    # --- FORRÁS VÁLASZTÓ ---
    tab1, tab2 = st.tabs(["📡 AUTO SCANNER (AI TIPPEL)", "🔗 MANUÁLIS LINK"])
    
    with tab1:
        rss_sources = {
            "Futurology": "https://www.reddit.com/r/Futurology/top/.rss",
            "AI News": "https://www.reddit.com/r/ArtificialInteligence/top/.rss",
            "TechCrunch": "https://techcrunch.com/feed/",
            "CoinDesk": "https://www.coindesk.com/arc/outboundfeeds/rss/"
        }
        src = st.selectbox("Forrás:", list(rss_sources.keys()))
        if st.button("Szkennelés és Elemzés"):
            with st.spinner("Hírek letöltése és AI virális elemzés..."):
                feed = feedparser.parse(requests.get(rss_sources[src], headers={'User-Agent': 'ONYX'}).content)
                items = [{"title": e.title, "source": src, "content": e.summary if hasattr(e,'summary') else e.title} for e in feed.entries[:6]]
                st.session_state['rss_results'] = items
                
                # ITT A HIÁNYZÓ LÁNCSZEM: AZ AI ELEMZÉS
                pick = analyze_viral_pick(items)
                st.session_state['viral_tip'] = pick
            
        # MEGJELENÍTÉS
        if st.session_state['viral_tip']:
            st.markdown(f"""
            <div class="viral-box">
                🤖 AZ AI EZT AJÁNLJA (VIRAL SCORE: MAGAS):<br>
                {st.session_state['viral_tip']}
            </div>
            """, unsafe_allow_html=True)
            
        if 'rss_results' in st.session_state:
            opts = {i['title']: i for i in st.session_state['rss_results']}
            sel = st.selectbox("Hírek listája:", list(opts.keys()))
            if st.button("EZT VÁLASZTOM ✅"):
                st.session_state['selected_data'] = opts[sel]
                st.success(f"Kiválasztva: {opts[sel]['title']}")

    with tab2:
        url_input = st.text_input("Cikk linkje:")
        if st.button("Link Betöltése") and url_input:
            article = scrape_article(url_input)
            if article['title'] != "Hiba":
                st.session_state['selected_data'] = article
                st.success(f"Betöltve: {article['title']}")
            else:
                st.error("Nem sikerült elolvasni.")

    # --- GYÁRTÁS ---
    data = st.session_state['selected_data']
    
    if data:
        st.write("---")
        st.header(f"🔥 CÉLPONT: {data['title']}")
        
        if st.button("🚀 EXECUTE DUAL PROTOCOL (V15)"):
            status = st.status("ONYX dolgozik...", expanded=True)
            
            status.write("🧠 Kutatás...")
            research = deep_research_from_text(data['title'], data.get('content', ''))
            
            status.write("🎨 Kép generálása...")
            t_prompt = f"Cyberpunk illustration of {data['title']}. Purple neon, dark. 4D render."
            t_res = client.images.generate(model="dall-e-3", prompt=t_prompt, size="1024x1792", quality="hd")
            t_url = t_res.data[0].url
            
            status.write("📝 Szkriptek...")
            s_tk = generate_script(data['title'], research, data['source'], "TikTok")
            s_yt = generate_script(data['title'], research, data['source'], "YouTube")
            
            status.write("🎞️ Renderelés...")
            f_tk = render_video(t_url, s_tk, "TikTok")
            f_yt = render_video(t_url, s_yt, "YouTube")
            
            save_to_memory(data['title'])
            status.update(label="✅ KÉSZ!", state="complete")
            
            c1, c2 = st.columns(2)
            with c1: 
                st.video(f_tk)
                st.download_button("📥 TIKTOK", open(f_tk,"rb"), "onyx_tk.mp4")
            with c2: 
                st.video(f_yt)
                st.download_button("📥 YOUTUBE", open(f_yt,"rb"), "onyx_yt.mp4")

if __name__ == "__main__":
    main()