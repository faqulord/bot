const TelegramBot = require('node-telegram-bot-api');
import connectToDatabase from '../lib/mongodb';
import User from '../models/User';

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: false });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { body } = req;

        if (body.message) {
            const chatId = body.message.chat.id;
            const text = body.message.text || "";
            const username = body.message.chat.username;
            const firstName = body.message.chat.first_name;
            const telegramId = body.message.from.id;

            try {
                // Adatbázis csatlakozás
                await connectToDatabase();

                // 1. Megnézzük, létezik-e már a felhasználó
                let user = await User.findOne({ telegramId: telegramId });

                // 2. /start parancs kezelése (Meghívókóddal)
                if (text.startsWith('/start')) {
                    // Ha még nincs regisztrálva a felhasználó
                    if (!user) {
                        const params = text.split(' ');
                        let referrerId = null;

                        // Ha van paraméter (pl. /start 12345), az a meghívó ID-ja
                        if (params.length > 1 && params[1] !== String(telegramId)) {
                            referrerId = Number(params[1]);
                        }

                        // Létrehozzuk az új felhasználót
                        user = await User.create({
                            telegramId: telegramId,
                            username: username,
                            firstName: firstName,
                            referrer: referrerId
                        });

                        // Ha volt meghívó, növeljük a meghívó statisztikáját
                        if (referrerId) {
                            await User.findOneAndUpdate(
                                { telegramId: referrerId },
                                { $inc: { totalInvited: 1 } }
                            );
                            // Opcionális: Értesítjük a meghívót
                            try {
                                await bot.sendMessage(referrerId, `🚀 Valaki regisztrált a linkeddel: ${firstName}!`);
                            } catch (e) { /* Ha blokkolta a botot, nem baj */ }
                        }
                    }

                    // Üdvözlő üzenet + Web App Gomb
                    await bot.sendMessage(chatId, `👋 Üdvözöllek a SkyTech Quantumban, ${firstName}!\n\nIndítsd el az appot a bányászathoz és a jutalékokhoz!`, {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "🚀 SkyTech App Indítása", web_app: { url: process.env.WEBAPP_URL } }]
                            ]
                        }
                    });
                }

            } catch (error) {
                console.error("Hiba:", error);
            }
        }
    }
    res.status(200).send('OK');
}
