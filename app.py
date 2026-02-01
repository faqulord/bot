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
from bs4 import BeautifulSoup # AZ ÚJ FEGYVER: Weboldal olvasó

# --- 🛠️ HACKER JAVÍTÁS ---
import PIL.Image
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = PIL.Image.LANCZOS
# -------------------------

from moviepy.editor import *

# --- 1. DESIGN: ULTIMATE PURPLE V14 ---
st.set_page_config(page_title="ONYX // V14 INTELLIGENCE", page_icon="🟣", layout="wide")

st.markdown("""
<style>
    .stApp { background-color: #05000a; color: #e0e0e0; font-family: 'Verdana', sans-serif; }
    h1 { color: #b829ff; text-align: center; letter-spacing: 8px; text-shadow: 0 0 30px #b829ff; border-bottom: 2px solid #b829ff; padding-bottom: 20px; }
    .stButton>button { background: #000; color: #b829ff; border: 1px solid #b829ff; font-weight: bold; padding: 15px; width: 100%; transition: 0.3s; text-transform: uppercase; }
    .stButton>button:hover { background: #b829ff; color: #fff; box-shadow: 0 0 40px #b829ff; }
    .stat-card { background: #1a0026; border: 1px solid #5a0080; padding: 15px; border-radius: 5px; text-align: center; color: #fff; }
    .viral-score { font-size: 0.8em; color: #0f0; font-weight: bold; border: 1px solid #0f0; padding: 2px 5px; border-radius: 3px; margin-left: 10px; }
    [data-testid="stSidebar"] { background-color: #0a0014; border-right: 1px solid #b829ff; }
</style>
""", unsafe_allow_html=True)

api_key = st.secrets["OPENAI_API_KEY"] if "OPENAI_API_KEY" in st.secrets else os.getenv("OPENAI_API_KEY")
if not api_key: st.stop()

client = OpenAI(api_key=api_key)
HISTORY_FILE = "onyx_memory.json"
BG_MUSIC = "background.mp3"
MASTER_IMG = "onyx_master_v13.png" # Megtartjuk a jó képet
OUTRO_IMG = "onyx_outro_v13.png"

# --- 2. WEBOLDAL OLVASÓ (SCRAPER) ---
def scrape_article(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Cím kinyerése
        title = soup.find('h1').get_text().strip() if soup.find('h1') else "Ismeretlen Cikk"
        
        # Szöveg kinyerése (csak a p tagek)
        paragraphs = soup.find_all('p')
        text = " ".join([p.get_text() for p in paragraphs[:10]]) # Csak az első 10 bekezdés elég
        
        return {"title": title, "content": text, "source": url.split('/')[2]}
    except Exception as e:
        return {"title": "Hiba az olvasáskor", "content": str(e), "source": "Error"}

# --- 3. ALAP FÜGGVÉNYEK ---
def run_async(coroutine):
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

# --- 4. VIRAL EDITOR (AI PONTOZÁS) ---
def analyze_viral_potential(headlines):
    # Ez a funkció megkéri a GPT-t, hogy válassza ki a legdurvább hírt
    headlines_text = "\n".join([f"- {h['title']}" for h in headlines])
    prompt = f"""
    Te vagy a TikTok algoritmus szakértője. Itt van pár hír:
    {headlines_text}
    
    Válaszd ki azt az EGYET, amelyiknek a legnagyobb a virális potenciálja (félelem, sokk, pénz).
    Csak a címét írd vissza.
    """
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
    return res.choices[0].message.content

# --- 5. GENERÁTOROK (MARAD A V13 ERŐSSÉGE) ---
def deep_research_from_text(topic, context_text):
    prompt = f"""
    Téma: "{topic}"
    Forrás szöveg: "{context_text[:2000]}..." 
    
    FELADAT: Elemezd ezt a szöveget.
    1. Mi a rejtett veszély?
    2. Mi a technokrata olvasat?
    Írj 3 rövid, sötét vázlatpontot.
    """
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
    return res.choices[0].message.content

def generate_script(topic, research, source_name, platform):
    length = "Rövid, 120 szó" if platform == "TikTok" else "Podcast, 400 szó"
    structure = "Horog -> Tény -> Veszély -> Konklúzió" if platform == "TikTok" else "Intro -> Részletek -> Háttér -> Elemzés -> Lezárás"
    
    prompt = f"""
    Te vagy ONYX.
    Téma: {topic} ({source_name})
    Kutatás: {research}
    Platform: {platform} ({length})
    
    Stílus: Sötét, cinikus, tényfeltáró. Használj szüneteket (...).
    Említsd a forrást.
    """
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": "Te vagy ONYX."}, {"role": "user", "content": prompt}])
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
    
    # Klipek (4mp Intro + Téma)
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

    out_file = f"onyx_{platform}_v14.mp4"
    final.write_videofile(out_file, fps=24, codec="libx264", audio_codec="aac", threads=2, preset="ultrafast")
    return out_file

# --- 6. VEZÉRLŐPULT (INTELLIGENCE) ---
def main():
    st.sidebar.header("🗄️ MEMÓRIA")
    if st.sidebar.button("🗑️ TÖRLÉS"):
        if os.path.exists(HISTORY_FILE): os.remove(HISTORY_FILE)
        st.rerun()
    for i in load_memory(): st.sidebar.text(f"{i.get('timestamp','?')}\n{i.get('topic','?')[:20]}...")

    st.title("🟣 PROJECT: ONYX // V14 INTELLIGENCE")
    
    if not os.path.exists(MASTER_IMG):
        st.warning("⚠️ SETUP SZÜKSÉGES!")
        # Itt lenne a setup gomb (a kód egyszerűsítése miatt most kihagytam, feltételezzük, hogy megvan a V13-ból)
        # Ha nincs, másold át a generate_master_assets függvényt a V13-ból.
        st.stop()

    # --- FORRÁS VÁLASZTÓ ---
    tab1, tab2 = st.tabs(["📡 AUTO SCANNER (RSS)", "🔗 MANUÁLIS LINK (URL)"])
    
    selected_data = None # Ez lesz a kiválasztott hír objektum
    
    with tab1:
        rss_sources = {
            "Futurology (Reddit)": "https://www.reddit.com/r/Futurology/top/.rss",
            "AI News (Reddit)": "https://www.reddit.com/r/ArtificialInteligence/top/.rss",
            "TechCrunch (Tech)": "https://techcrunch.com/feed/",
            "CoinDesk (Crypto)": "https://www.coindesk.com/arc/outboundfeeds/rss/"
        }
        src = st.selectbox("Forrás választása:", list(rss_sources.keys()))
        if st.button("Szkennelés"):
            feed = feedparser.parse(requests.get(rss_sources[src], headers={'User-Agent': 'ONYX'}).content)
            items = [{"title": e.title, "source": src, "content": e.summary if hasattr(e,'summary') else e.title} for e in feed.entries[:6]]
            st.session_state['rss_results'] = items
            
            # AI Elemzés
            viral_pick = analyze_viral_potential(items)
            st.info(f"🤖 AI TIPP: {viral_pick}")
            
        if 'rss_results' in st.session_state:
            opts = {i['title']: i for i in st.session_state['rss_results']}
            sel = st.selectbox("Válassz hírt:", list(opts.keys()))
            if st.button("Ezt dolgozzuk fel"):
                selected_data = opts[sel]

    with tab2:
        url_input = st.text_input("Másold be a cikk linkjét (Bármilyen oldal):")
        if st.button("Link Elemzése") and url_input:
            with st.spinner("Weboldal olvasása..."):
                article = scrape_article(url_input)
                if article['title'] != "Hiba az olvasáskor":
                    st.success(f"Sikeres olvasás: {article['title']}")
                    selected_data = article
                    st.session_state['manual_data'] = article
                else:
                    st.error("Nem sikerült elolvasni a cikket. Próbálj másik linket.")
        
        if 'manual_data' in st.session_state and not selected_data:
            selected_data = st.session_state['manual_data']

    # --- GYÁRTÁS ---
    if selected_data:
        st.write("---")
        st.header(f"🔥 CÉLPONT: {selected_data['title']}")
        st.write(f"Forrás: {selected_data['source']}")
        
        if st.button("🚀 EXECUTE DUAL PROTOCOL (V14)"):
            status = st.status("ONYX dolgozik...", expanded=True)
            
            # 1. KUTATÁS
            status.write("🧠 Szövegkörnyezet elemzése...")
            # Itt a teljes cikk szövegét adjuk át a kutatónak!
            research = deep_research_from_text(selected_data['title'], selected_data.get('content', ''))
            
            # 2. KÉP
            status.write("🎨 Kép generálása...")
            t_prompt = f"Cyberpunk illustration of {selected_data['title']}. Purple neon, dark. 4D render."
            t_res = client.images.generate(model="dall-e-3", prompt=t_prompt, size="1024x1792", quality="hd")
            t_url = t_res.data[0].url
            
            # 3. SZKRIPT
            status.write("📝 Szkriptek írása...")
            s_tk = generate_script(selected_data['title'], research, selected_data['source'], "TikTok")
            s_yt = generate_script(selected_data['title'], research, selected_data['source'], "YouTube")
            
            # 4. RENDER
            status.write("🎞️ Renderelés...")
            f_tk = render_video(t_url, s_tk, "TikTok")
            f_yt = render_video(t_url, s_yt, "YouTube")
            
            save_to_memory(selected_data['title'])
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