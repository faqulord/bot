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
# MoviePy a videóhoz
from moviepy.editor import *
from moviepy.video.fx.all import resize

# --- 1. KONFIGURÁCIÓ & DESIGN ---
st.set_page_config(page_title="ONYX // OS V4.0", page_icon="👁️", layout="wide")

# Egyedi CSS a Cyberpunk Designhoz
st.markdown("""
<style>
    .stApp { background-color: #050505; color: #e0e0e0; }
    h1, h2, h3 { color: #00ffcc; font-family: 'Courier New'; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 10px #00ffcc; }
    .stButton>button { background: linear-gradient(45deg, #004433, #000000); color: #00ffcc; border: 1px solid #00ffcc; width: 100%; font-weight: bold; transition: 0.3s; }
    .stButton>button:hover { background: #00ffcc; color: black; box-shadow: 0 0 15px #00ffcc; }
    .stat-box { border: 1px solid #333; padding: 15px; border-radius: 5px; background: rgba(255, 255, 255, 0.05); text-align: center; margin-bottom: 10px; }
    .stat-num { font-size: 24px; font-weight: bold; color: #ff004c; }
    div[data-testid="stExpander"] { background-color: #0a0a0a; border: 1px solid #333; }
</style>
""", unsafe_allow_html=True)

# API Kulcs kezelése (Biztonságos + Fallback)
api_key = None
try:
    api_key = st.secrets["OPENAI_API_KEY"]
except:
    api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    st.error("⚠️ RENDKÍVÜLI HIBA: NINCS API KULCS! Állítsd be a Streamlit Secrets menüben!")
    st.stop()

client = OpenAI(api_key=api_key)
BRAND_NAME = "PROJECT: ONYX"
HISTORY_FILE = "onyx_memory.json"
BG_MUSIC = "background.mp3"

# --- 2. LOGIKA & MEMÓRIA ---
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
        "stance": stance,
        "short_script": script[:50] + "..."
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
    except Exception as e:
        return []

def get_onyx_opinion(topic, history):
    recent_context = " | ".join([h['topic'] for h in history[:3]])
    prompt = f"""
    Te vagy ONYX. Identitás: Sötét, cinikus, technokrata, mindent látó entitás.
    Téma: "{topic}"
    Múltbeli témáid: {recent_context}
    
    FELADAT: Alkoss egy ÉLES, MEGOSZTÓ véleményt erről.
    Ne legyél semleges. Támadd a naivitást. Ha a téma kapcsolódik a múlthoz, kösd össze.
    Válasz hossza: Max 2 velős mondat.
    """
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
    return res.choices[0].message.content

def generate_pro_script(topic, platform, opinion):
    if platform == "TikTok (Csali)":
        sys_prompt = """
        PLATFORM: TikTok. CÉL: Átterelés YouTube-ra.
        STRATÉGIA:
        1. 0-2mp: Sokkoló állítás (Pattern Interrupt).
        2. Tárgyalás: Csak a probléma felvetése, titokzatosan.
        3. VÉGE: Cliffhanger + "A teljes igazság a YouTube-on. Link a bioban."
        """
    else:
        sys_prompt = """
        PLATFORM: YouTube Shorts/Video. CÉL: Brand építés.
        STRATÉGIA:
        1. Hook: Utalás a TikTok videóra ("Ha onnan jöttél, itt a válasz...").
        2. Elemzés: Mély, filozófiai okfejtés.
        3. Konklúzió: Sötét jövőkép.
        """
    
    user_prompt = f"Téma: {topic}. ONYX Álláspontja: {opinion}. Írd meg a szkriptet magyarul."
    res = client.chat.completions.create(model="gpt-4o", messages=[{"role": "system", "content": sys_prompt}, {"role": "user", "content": user_prompt}])
    return clean_script_for_speech(res.choices[0].message.content)

# --- 4. VIDEÓ GENERÁLÁS (OPTIMALIZÁLT) ---
def render_video(image_url, audio_file, filename="onyx_render.mp4"):
    # Kép letöltése
    with open("temp_img.png", "wb") as f:
        f.write(requests.get(image_url).content)
    
    audio = AudioFileClip(audio_file)
    # Biztonsági ráhagyás a hosszra
    duration = audio.duration + 0.5
    
    # Kép betöltése és effekt
    clip = ImageClip("temp_img.png").set_duration(duration)
    
    # 9:16 Crop
    w, h = clip.size
    if w > h:
        clip = clip.crop(x1=w/2 - 540, y1=0, width=1080, height=1920)
    else:
        clip = clip.resize(height=1920).crop(x1=clip.w/2 - 540, width=1080, height=1920)
    
    # Zoom animáció (Kicsit lassabb, hogy stabilabb legyen a render)
    clip = clip.resize(lambda t : 1 + 0.03 * (t / duration))
    clip = clip.set_position(('center', 'center')).crop(width=1080, height=1920)
    
    # Zene kezelés (Hiba esetén csendben folytatja)
    final_audio = audio
    if os.path.exists(BG_MUSIC):
        try:
            bg = AudioFileClip(BG_MUSIC).volumex(0.08).set_duration(duration)
            final_audio = CompositeAudioClip([audio, bg])
        except: pass
        
    clip = clip.set_audio(final_audio)
    
    # Renderelés alacsonyabb szálkezeléssel a stabilitásért
    clip.write_videofile(filename, fps=24, codec="libx264", audio_codec="aac", threads=2, preset="ultrafast")
    return filename

# --- 5. VEZÉRLŐPULT (UI) ---
def main():
    st.title(f"👁️ {BRAND_NAME} // NEURAL INTERFACE")
    history = load_memory()

    # FELSŐ SÁV: ANALITIKA
    c1, c2, c3 = st.columns(3)
    with c1: st.markdown(f'<div class="stat-box"><span class="stat-num">{len(history)}</span><br>MEMÓRIA MODULOK</div>', unsafe_allow_html=True)
    with c2: st.markdown(f'<div class="stat-box"><span class="stat-num">ONLINE</span><br>ONYX ÁLLAPOT</div>', unsafe_allow_html=True)
    with c3: st.markdown(f'<div class="stat-box"><span class="stat-num">V4.0</span><br>RENDSZER VERZIÓ</div>', unsafe_allow_html=True)

    st.write("---")

    # 1. MODUL: HÁLÓZATI PÁSZTAZÁS
    st.subheader("📡 1. GLOBÁLIS ADATGYŰJTÉS")
    
    rss_sources = {
        "Futurology (Jövőkutatás)": "https://www.reddit.com/r/Futurology/top/.rss",
        "Conspiracy (Összeesküvés)": "https://www.reddit.com/r/conspiracy/top/.rss",
        "Artificial Intel (AI)": "https://www.reddit.com/r/ArtificialInteligence/top/.rss"
    }
    
    col_scan, col_res = st.columns([1, 2])
    with col_scan:
        source_key = st.selectbox("CÉLPONT FORRÁS:", list(rss_sources.keys()))
        if st.button("🚀 SZKENNELÉS INDÍTÁSA"):
            with st.spinner("Adatcsomagok dekódolása..."):
                entries = analyze_trends(rss_sources[source_key])
                st.session_state['scan_results'] = entries
    
    if 'scan_results' in st.session_state:
        with col_res:
            st.success(f"{len(st.session_state['scan_results'])} potenciális anomália észlelve.")
            # Szép lista dátummal
            topic_options = {f"[{e.published[5:16]}] {e.title}": e.title for e in st.session_state['scan_results']}
            selected_label = st.selectbox("VÁLASSZ EGYT:", list(topic_options.keys()))
            selected_topic = topic_options[selected_label]

        st.write("---")
        
        # 2. MODUL: STRATÉGIA
        st.subheader("🧠 2. ONYX TUDAT & STRATÉGIA")
        
        col_plat, col_op = st.columns(2)
        with col_plat:
            target_platform = st.radio("CÉL PLATFORM", ["TikTok (Csali)", "YouTube (Tartalom)"], horizontal=True)
        
        if st.button("⚡ VÉLEMÉNY GENERÁLÁSA"):
            with st.spinner("Logikai áramkörök izzítása..."):
                opinion = get_onyx_opinion(selected_topic, history)
                st.session_state['current_opinion'] = opinion
                st.session_state['current_topic'] = selected_topic
                st.session_state['current_platform'] = target_platform

        if 'current_opinion' in st.session_state:
            with col_op:
                st.info(f"**GENERÁLT ÁLLÁSPONT:**\n\n_{st.session_state['current_opinion']}_")
            
            # 3. MODUL: GYÁRTÁS
            st.write("---")
            st.subheader("🎬 3. TARTALOM MANIFESZTÁLÁSA")
            
            if st.button("🔥 VIDEÓ LEGYÁRTÁSA (TELJES FOLYAMAT)"):
                progress_bar = st.progress(0)
                status_text = st.empty()
                
                try:
                    # 1. SZKRIPT
                    status_text.text("📝 Forgatókönyv írása...")
                    progress_bar.progress(20)
                    script = generate_pro_script(st.session_state['current_topic'], st.session_state['current_platform'], st.session_state['current_opinion'])
                    st.text_area("VÉGLEGES SZKRIPT:", script, height=150)
                    
                    # 2. HANG
                    status_text.text("🔊 Neurális hang generálása...")
                    progress_bar.progress(40)
                    async def gen_voice():
                        rate = "+15%" if "TikTok" in st.session_state['current_platform'] else "+5%"
                        c = edge_tts.Communicate(script, "hu-HU-TamasNeural", rate=rate)
                        await c.save("temp_voice.mp3")
                    run_async(gen_voice())
                    
                    # 3. VIZUÁL
                    status_text.text("🎨 DALL-E 3 Kép generálása...")
                    progress_bar.progress(60)
                    img_prompt = f"Dark cinematic vertical masterpiece, {st.session_state['current_topic']}, mysterious, glitch art style, 8k, dark aesthetic"
                    img_res = client.images.generate(model="dall-e-3", prompt=img_prompt, size="1024x1792", quality="hd")
                    img_url = img_res.data[0].url
                    
                    # 4. RENDER
                    status_text.text("🎞️ Videó renderelése (Zoom effekttel)...")
                    progress_bar.progress(80)
                    filename = f"onyx_{datetime.now().strftime('%H%M%S')}.mp4"
                    final_video = render_video(img_url, "temp_voice.mp3", filename)
                    
                    progress_bar.progress(100)
                    status_text.text("✅ KÉSZ!")
                    
                    # EREDMÉNY
                    c_vid, c_data = st.columns(2)
                    with c_vid:
                        st.video(final_video)
                    with c_data:
                        st.success("TARTALOM KÉSZ A FELTÖLTÉSRE.")
                        save_to_memory(st.session_state['current_topic'], st.session_state['current_platform'], st.session_state['current_opinion'], script)
                        with open(final_video, "rb") as f:
                            st.download_button("📥 LETÖLTÉS (.MP4)", f, filename)
                            
                except Exception as e:
                    st.error(f"HIBA A GYÁRTÁSBAN: {e}")

    # LÁBLÉC: MEMÓRIA
    st.write("---")
    with st.expander("📂 ONYX MEMÓRIA NAPLÓ (HISTÓRIA)"):
        st.dataframe(history)

if __name__ == "__main__":
    main()