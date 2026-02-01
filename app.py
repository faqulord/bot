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
# MoviePy importok a videó effektekhez
from moviepy.editor import *
from moviepy.video.fx.all import resize

# --- 1. KONFIGURÁCIÓ & BIZTONSÁG ---
st.set_page_config(page_title="ONYX // AI INFLUENCER SYSTEM", page_icon="👁️", layout="wide")

# Kulcs betöltése a secrets.toml fájlból (BIZTONSÁGOS MÓDSZER)
try:
    api_key = st.secrets["OPENAI_API_KEY"]
except FileNotFoundError:
    # Ha nincs secrets file, de van környezeti változó (pl. lokális futtatásnál)
    api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    st.error("HIBA: Nem található API kulcs! Hozd létre a .streamlit/secrets.toml fájlt.")
    st.stop()

client = OpenAI(api_key=api_key)

BRAND_NAME = "PROJECT: ONYX"
HISTORY_FILE = "onyx_memory.json"
BG_MUSIC = "background.mp3"  # Opcionális háttérzene

# --- 2. SEGÉDFÜGGVÉNYEK ---
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
    entry = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
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

# --- 3. ONYX AGY (LOGIKA & SZEMÉLYISÉG) ---
def get_onyx_opinion(topic, history):
    """Ez a funkció adja ONYX 'tudatát'. Eldönti a véleményét a hírről."""
    recent_topics = ", ".join([h['topic'] for h in history[:3]])
    
    prompt = f"""
    Te vagy ONYX, egy cinikus, technokrata, mindent látó AI entitás.
    Téma: "{topic}"
    
    Feladat: Alkoss egy rendkívül megosztó, provokatív véleményt erről a témáról.
    Ne legyél semleges. Támadd meg a közvélekedést.
    Ha a téma kapcsolódik ehhez: "{recent_topics}", utalj vissza rá (pl. "Ahogy tegnap mondtam...").
    
    A véleményed (max 2 mondat):
    """
    response = client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}])
    return response.choices[0].message.content

def generate_script(topic, platform, opinion):
    """A szkript generálása a platformnak megfelelően."""
    
    if platform == "TikTok (A Csali)":
        system_instruction = """
        CÉL: TikTok videó készítése, ami áttereli a nézőket YouTube-ra.
        STRATÉGIA:
        1. Kezdés (0-3mp): Pattern Interrupt (Sokkoló állítás).
        2. Tárgyalás: Fejtsd ki a témát, de NE mondd el a megoldást vagy a végkövetkeztetést.
        3. Cliffhanger: Hagyd abba a legizgalmasabb résznél.
        4. CTA: "Az igazság túl veszélyes ide. Teljes elemzés a csatornámon. Link a bioban."
        STÍLUS: Gyors, agresszív, titokzatos. Max 150 szó.
        """
    else: # YouTube
        system_instruction = """
        CÉL: YouTube videó készítése, ami értéket ad és bizalmat épít.
        STRATÉGIA:
        1. Hook: Utalj a TikTok videóra ("Ha a TikTokról jöttél, tudod, miről van szó...").
        2. Elemzés: Mély, részletes elemzés a témáról.
        3. Konklúzió: Egy sötét, de logikus jövőkép.
        STÍLUS: Filozófikus, elemző, "Mátrix-szerű". Max 400 szó.
        """

    prompt = f"""
    Téma: {topic}
    ONYX Belső Véleménye (ezt kell képviselned): {opinion}
    
    Írd meg a narráció szövegét. Csak a kimondott szöveget írd le!
    """
    
    response = client.chat.completions.create(model="gpt-4o", messages=[
        {"role": "system", "content": system_instruction},
        {"role": "user", "content": prompt}
    ])
    return clean_script_for_speech(response.choices[0].message.content)

# --- 4. VIDEÓ GYÁRTÁS (KEN BURNS ZOOM) ---
def create_video(image_url, audio_file, output_filename="onyx_output.mp4"):
    # Kép letöltése
    headers = {'User-Agent': 'Mozilla/5.0'}
    img_data = requests.get(image_url, headers=headers).content
    with open("temp_img.png", "wb") as f: f.write(img_data)
    
    # Hang betöltése
    audio_clip = AudioFileClip(audio_file)
    duration = audio_clip.duration + 0.5
    
    # Kép beállítása (Zoom effekt)
    # 1. Betöltés
    clip = ImageClip("temp_img.png").set_duration(duration)
    
    # 2. Vágás 9:16 arányra (TikTok/Shorts méret: 1080x1920)
    w, h = clip.size
    # Ha fekvő a kép, vágjuk ki a közepét
    if w > h:
        clip = clip.crop(x1=w/2 - 540, y1=0, width=1080, height=1920)
    else:
        # Ha álló, de nem pont 9:16, méretezés és vágás
        clip = clip.resize(height=1920)
        clip = clip.crop(x1=clip.w/2 - 540, width=1080, height=1920)
    
    # 3. Zoom animáció (Ken Burns)
    # Lassan nagyítjuk a képet 1.0-ról 1.04-re
    clip = clip.resize(lambda t : 1 + 0.04 * (t / duration)) 
    # Újra vágás, hogy a zoom ne torzítsa a keretet (center crop)
    clip = clip.set_position(('center', 'center')).crop(x_center=clip.w/2, y_center=clip.h/2, width=1080, height=1920)
    
    # Zene és Hang
    final_audio = audio_clip
    if os.path.exists(BG_MUSIC):
        music = AudioFileClip(BG_MUSIC).volumex(0.08).set_duration(duration) # Nagyon halk háttér
        final_audio = CompositeAudioClip([audio_clip, music])
    
    clip = clip.set_audio(final_audio)
    
    # Renderelés
    clip.write_videofile(output_filename, fps=24, codec="libx264", audio_codec="aac")
    return output_filename

# --- 5. FELHASZNÁLÓI FELÜLET (UI) ---
def main():
    # Stílus
    st.markdown("""
    <style>
    .stApp { background-color: #050505; color: #e0e0e0; }
    h1 { color: #00ff99; font-family: 'Courier New'; text-align: center; text-transform: uppercase; letter-spacing: 3px; }
    .stButton>button { background: #004433; color: #00ff99; border: 1px solid #00ff99; width: 100%; }
    .stButton>button:hover { background: #00ff99; color: black; }
    .stat-box { border: 1px solid #333; padding: 15px; border-radius: 5px; background: #111; text-align: center; }
    </style>
    """, unsafe_allow_html=True)

    st.title(f"👁️ {BRAND_NAME} // CONTROL ROOM")

    # Múltbeli adatok betöltése
    history = load_memory()
    
    # Dashboard
    c1, c2, c3 = st.columns(3)
    with c1: st.markdown(f'<div class="stat-box">MEMÓRIA<br>{len(history)} bejegyzés</div>', unsafe_allow_html=True)
    with c2: st.markdown('<div class="stat-box">STÁTUSZ<br>ONLINE</div>', unsafe_allow_html=True)
    with c3: st.markdown('<div class="stat-box">HANG<br>Tamás (Neural)</div>', unsafe_allow_html=True)

    st.write("---")

    # 1. LÉPÉS: TÉMA VADÁSZAT
    st.subheader("1. TÉMA VADÁSZAT (Reddit Scan)")
    rss_options = {
        "Futurizmus & AI": "https://www.reddit.com/r/Futurology/top/.rss",
        "Összeesküvés & Titkok": "https://www.reddit.com/r/conspiracy/top/.rss",
        "Pénz & Kripto": "https://www.reddit.com/r/CryptoCurrency/top/.rss"
    }
    source_key = st.selectbox("Válassz forrást:", list(rss_options.keys()))
    
    if st.button("📡 HÁLÓZAT SZKENNELÉSE"):
        with st.spinner("Adatfolyamok elemzése..."):
            try:
                d = feedparser.parse(requests.get(rss_options[source_key], headers={'User-Agent': 'ONYX'}).content)
                if d.entries:
                    st.session_state['topics'] = [e.title for e in d.entries[:5]]
                    st.success("Célpontok bemérve.")
                else:
                    st.error("Nem sikerült adatot lekérni. Próbáld újra.")
            except Exception as e:
                st.error(f"Hiba a kapcsolódáskor: {e}")
    
    if 'topics' in st.session_state:
        selected_topic = st.selectbox("Válassz egy témát a listából:", st.session_state['topics'])
        
        # 2. LÉPÉS: STRATÉGIA ÉS VÉLEMÉNY
        st.write("---")
        st.subheader("2. ONYX TUDAT (Opinion Engine)")
        
        target_platform = st.radio("CÉL PLATFORM (A Tölcsér)", ["TikTok (A Csali)", "YouTube (A Teljes Igazság)"], horizontal=True)
        
        if st.button("🧠 VÉLEMÉNY GENERÁLÁSA"):
            with st.spinner("Onyx gondolkodik..."):
                opinion = get_onyx_opinion(selected_topic, history)
                st.session_state['opinion'] = opinion
                st.session_state['platform'] = target_platform
        
        if 'opinion' in st.session_state:
            st.info(f"**ONYX VÉLEMÉNYE:** {st.session_state['opinion']}")
            
            # 3. LÉPÉS: GYÁRTÁS
            st.write("---")
            st.subheader("3. PRODUKCIÓ")
            
            if st.button("🎬 VIDEÓ LEGYÁRTÁSA"):
                with st.spinner("Forgatókönyv írása..."):
                    script = generate_script(selected_topic, st.session_state['platform'], st.session_state['opinion'])
                    st.text_area("Forgatókönyv:", script)
                
                with st.spinner("Hang generálása..."):
                    async def gen_voice():
                        # +15% sebesség a TikTokhoz, +5% a YouTubehoz
                        rate = "+15%" if "TikTok" in st.session_state['platform'] else "+5%"
                        communicate = edge_tts.Communicate(script, "hu-HU-TamasNeural", rate=rate)
                        await communicate.save("temp_audio.mp3")
                    run_async(gen_voice())

                with st.spinner("Vizuális generálás..."):
                    img_prompt = f"Dark cinematic mysterious vertical wallpaper, {selected_topic}, dark ambient style, 8k resolution"
                    img_res = client.images.generate(model="dall-e-3", prompt=img_prompt, size="1024x1792", quality="hd")
                    img_url = img_res.data[0].url
                
                with st.spinner("Renderelés (Zoom Effekttel)..."):
                    filename = f"onyx_{datetime.now().strftime('%M%S')}.mp4"
                    try:
                        final_video = create_video(img_url, "temp_audio.mp3", output_filename=filename)
                        st.video(final_video)
                        
                        # Mentés a memóriába
                        save_to_memory(selected_topic, st.session_state['platform'], st.session_state['opinion'])
                        
                        with open(final_video, "rb") as f:
                            st.download_button("📥 VIDEÓ LETÖLTÉSE", f, file_name=filename)
                    except Exception as e:
                        st.error(f"Hiba a renderelésnél (MoviePy/FFmpeg): {e}")

if __name__ == "__main__":
    main()