const TelegramBot = require('node-telegram-bot-api');

// A titkos kulcsot a Verceltől kérjük el
const token = process.env.TELEGRAM_TOKEN;
// Fontos: polling: false, mert Webhookot használunk!
const bot = new TelegramBot(token, { polling: false });

export default async function handler(req, res) {
    // Csak a POST kérésekkel foglalkozunk (amiket a Telegram küld)
    if (req.method === 'POST') {
        const { body } = req;
        
        // Ellenőrizzük, hogy van-e üzenet
        if (body.message) {
            const chatId = body.message.chat.id;
            const text = body.message.text;

            try {
                // 1. /start parancs
                if (text === '/start') {
                    await bot.sendMessage(chatId, "👋 Üdv a Titkos Shopban!\n\nItt kriptóért vehetsz koordinátákat.\n\nParancsok:\n💰 /balance - Egyenleged\n📦 /shop - Kínálat\n🛒 /buy - Vásárlás");
                }
                
                // 2. /balance (Kamu egyenleg)
                else if (text === '/balance') {
                    // Itt később adatbázisból kérdezzük le, most fix 50.000
                    await bot.sendMessage(chatId, "💳 Egyenleged: 50,000 COIN\n(Feltöltéshez utalj erre a címre: ...)");
                }

                // 3. /shop (Kínálat)
                else if (text === '/shop') {
                    await bot.sendMessage(chatId, "📦 **MYSTERY BOXOK:**\n\n1. 🥇 ARANY CSOMAG - 50,000 Coin\n(Tartalom: 1db Koordináta + Fotó)\n\nVásárláshoz írd be: /buy");
                }

                // 4. /buy (Vásárlás szimuláció)
                else if (text === '/buy') {
                    // Itt szimuláljuk, hogy levonjuk a pénzt és elküldjük a helyet
                    await bot.sendMessage(chatId, "✅ Tranzakció sikeres! -50,000 Coin");
                    
                    // Koordináta küldése (pl. Széchenyi tér)
                    await bot.sendLocation(chatId, 47.4979, 19.0402);
                    
                    await bot.sendMessage(chatId, "📍 Menj a fenti pontra!\nJelszó: KRYPTO-KING-2026\nSok szerencsét!");
                }
                
            } catch (error) {
                console.error("Hiba az üzenet küldésekor:", error);
            }
        }
    }
    
    // Válasz a Telegramnak/Vercelnek, hogy megkaptuk (fontos, különben újrapróbálja)
    res.status(200).send('OK');
}