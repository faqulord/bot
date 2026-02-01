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
from moviepy.editor import ImageClip, AudioFileClip, CompositeAudioClip

# --- KONFIGURÁCIÓ & KULCSOK ---
part1 = "sk-proj-NbK9TkHNe_kTkQBw6AfeN0uVGcEKtJl7NSyMF2Ya3XVQ_mNyWiAlVwkDEk_"
part2 = "F8fdV8TKaj-jc1RT3BlbkFJXwmIJuSf1Qm1_c4yKvHASf2QXBUIpBNm6y4ZID-_E5j5PESJKnVrnYP22-ULXkBXE6Zx5tPn4A"
if "OPENAI_API_KEY" not in os.environ:
    os.environ["OPENAI_API_KEY"] = part1 + part2

BRAND_NAME = "PROJECT: ONYX"
HISTORY_FILE = "onyx_memory.json"

# --- CORE ENGINE FUNKCIÓK ---
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

def save_to_memory(topic, platform, style):
    history = load_memory()
    entry = {"date": datetime.now().strftime("%Y-%m-%d %H:%M"), "topic": topic, "platform": platform, "style": style}
    history.insert(0, entry)
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history[:50], f, ensure_ascii=False, indent=4)

def clean_script_for_speech(text):
    # Eltávolítja a technikai jelölőket, de megtartja a SSML-barát szerkezetet
    text = re.sub(r'\s*\(.*?\)\s*', ' ', text)
    text = re.sub(r'\*\*.*?\*\*:', '', text)
    text = re.sub(r'(HOOK|BODY|INTRO|OUTRO|VÁGÁS|KÉP|SZÜNET):', '', text, flags=re.IGNORECASE)
    return text.strip()

# --- VIDEÓ MOTOR ---
def create_video_file(image_url, audio_file, filename="onyx_v9_output.mp4"):
    headers = {'User-Agent': 'Mozilla/5.0'}
    img_data = requests.get(image_url, headers=headers).content
    with open("temp_img.png", "wb") as f: f.write(img_data)
    
    voice_clip = AudioFileClip(audio_file)
    bg_music = "background.mp3"
    final_audio = voice_clip
    
    if os.path.exists(bg_music):
        m_clip = AudioFileClip(bg_music).volumex(0.12).set_duration(voice_clip.duration)
        final_audio = CompositeAudioClip([voice_clip, m_clip])
        
    clip = ImageClip("temp_img.png").set_duration(voice_clip.duration)
    
    # Vízjel/Logo kezelése
    if os.path.exists("logo.png"):
        from moviepy.editor import ImageClip as ImgClip, CompositeVideoClip
        logo = ImgClip("logo.png").set_duration(voice_clip.duration).resize(height=80).set_pos(("right","bottom")).margin(right=20, bottom=20, opacity=0)
        clip = CompositeVideoClip([clip, logo])
        
    clip.set_audio(final_audio).write_videofile(filename, fps=24, codec="libx264")
    return filename

# --- DASHBOARD UI ---
def main():
    st.set_page_config(page_title="ONYX // OS V9", page_icon="👁️", layout="wide")
    
    # PROFI CYBER-MARKETING UI
    st.markdown("""
    <style>
    .stApp { background: radial-gradient(circle, #0f0f0f 0%, #000000 100%); color: #e0e0e0; }
    .main-card { background: rgba(255, 255, 255, 0.05); border-radius: 15px; padding: 20px; border: 1px solid rgba(0, 255, 204, 0.1); margin-bottom: 20px; }
    h1 { font-family: 'Orbitron', sans-serif; color: #00ffcc; text-shadow: 0 0 20px #00ffcc; text-align: center; text-transform: uppercase; }
    .stButton>button { background: linear-gradient(45deg, #ff004c, #ff0080); color: white; border: none; border-radius: 5px; font-weight: bold; width: 100%; transition: 0.3s; }
    .stButton>button:hover { transform: scale(1.02); box-shadow: 0 0 15px #ff004c; }
    </style>
    """, unsafe_allow_html=True)

    st.markdown(f"<h1>👁️ {BRAND_NAME} // DIGITAL ENTITY</h1>", unsafe_allow_html=True)
    
    client = OpenAI()
    history = load_memory()

    # --- TOP BAR: ONYX AGYÁNAK ÁLLAPOTA ---
    col_a, col_b, col_c = st.columns(3)
    with col_a:
        st.markdown('<div class="main-card"><b>🧠 MEMÓRIA ÁLLAPOT</b><br>Aktív (50/50 szlot)</div>', unsafe_allow_html=True)
    with col_b:
        st.markdown(f'<div class="main-card"><b>📈 STRATÉGIA</b><br>Viral-Loop Engine v9.0</div>', unsafe_allow_html=True)
    with col_c:
        st.markdown(f'<div class="main-card"><b>🔊 HANG MOTOR</b><br>Tamás Neural + SSML</div>', unsafe_allow_html=True)

    # --- 1. KUTATÓ MODUL ---
    st.subheader("📡 GLOBÁLIS ANOMÁLIA SZKENNER")
    if st.button("RENDSZER-SZINTŰ KERESÉS INDÍTÁSA"):
        with st.spinner("Onyx éppen a hálózat sötét rétegeit fésüli át..."):
            rss_urls = ["https://www.reddit.com/r/CreepyWikipedia/top/.rss", "https://www.reddit.com/r/HighStrangeness/top/.rss"]
            news = []
            for url in rss_urls:
                f = feedparser.parse(requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}).content)
                for e in f.entries[:3]: news.append(e.title)
            st.session_state['news'] = list(set(news))
            st.success("Célpontok bemérve.")

    if 'news' in st.session_state:
        selected = st.selectbox("VÁLASSZ EGYET AZ IGAZSÁGOK KÖZÜL:", st.session_state['news'])
        
        # --- 2. GYÁRTÓ MODUL ---
        st.markdown("---")
        st.subheader("🎬 KAMPÁNY-KONSTRUKTOR")
        
        c1, c2 = st.columns(2)
        with c1: platform = st.selectbox("PLATFORM", ["TikTok (A Horog)", "YouTube (A Teljes Igazság)"])
        with c2: style = st.selectbox("STÍLUS", ["Sötét/Misztikus", "Aggasztó/Tudományos", "Cinikus/Leleplező"])

        if st.button("🚀 ONYX PROTOKOLL VÉGREHAJTÁSA"):
            status = st.status("ONYX ÉBREDÉSE...", expanded=True)
            
            # --- PROFESSZIONÁLIS SCRIPT GENERÁLÁS ---
            status.write("📝 Forgatókönyv írása (MrBeast & Hormozi elvek alapján)...")
            system_p = f"""Te vagy ONYX, a legmagasabb szintű AI influenszer. 
            SZABÁLYOK: 
            - Használj SSML-szerű drámai szüneteket (pontok és vesszők stratégiai helyén).
            - Alkalmazz 'Pattern Interrupt' kezdést. 
            - Ne írj le technikai szavakat mint 'Hook'. 
            - Platform: {platform}, Stílus: {style}. 
            - Utalj a múltbeli sikereidre, ha releváns."""
            
            res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": system_p}, {"role": "user", "content": f"Téma: {selected}"}])
            script = clean_script_for_speech(res.choices[0].message.content)
            
            # SEO Generálás
            seo = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": f"Írj SEO címet és hashtageket ehhez: {script}"}]).choices[0].message.content
            
            st.markdown(f'<div class="main-card"><b>PROFI SZÖVEG:</b><br>{script}</div>', unsafe_allow_html=True)
            st.markdown(f'<div class="main-card"><b>SEO & META:</b><br>{seo}</div>', unsafe_allow_html=True)

            # --- HANG & KÉP ---
            status.write("🔊 Hangszintézis folyamatban (Tamás)...")
            async def gen_voice():
                c = edge_tts.Communicate(script, "hu-HU-TamasNeural", rate="+12%")
                await c.save("v9_audio.mp3")
            run_async(gen_voice())
            
            status.write("🎨 Vizuális manifesztáció...")
            img = client.images.generate(model="dall-e-3", prompt=f"Cinematic masterpiece, dark mystery, {selected}, {style} aesthetic, high contrast, 8k, onyx eye symbol hidden.").data[0].url
            
            # --- RENDER ---
            status.write("🎞️ Valóság rögzítése (Render)...")
            v_file = create_video_file(img, "v9_audio.mp3")
            save_to_memory(selected, platform, style)
            
            status.update(label="✅ FELADAT TELJESÍTVE!", state="complete")
            with open(v_file, "rb") as f: st.download_button("📥 VIDEÓ LETÖLTÉSE", f, "onyx_v9.mp4")

    # MEMÓRIA TÁBLÁZAT ALUL
    st.markdown("---")
    st.subheader("📂 HISTÓRIA")
    st.dataframe(history)

if __name__ == "__main__": main()