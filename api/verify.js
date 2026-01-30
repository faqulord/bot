import axios from 'axios';
import connectToDatabase from '../lib/mongodb';
import User from '../models/User';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Csak POST kérés mehet');
    }

    const { txid, myAddress, telegramId } = req.body; // telegramId-t is küldünk a frontendről!

    if (!txid || !myAddress || !telegramId) {
        return res.status(400).json({ success: false, error: "Hiányzó adatok!" });
    }

    try {
        await connectToDatabase();

        // 1. Felhasználó keresése
        const user = await User.findOne({ telegramId: telegramId });
        if (!user) return res.status(404).json({ success: false, error: "Felhasználó nem található" });

        // 2. Ellenőrizzük, használta-e már ezt a TXID-t (Csalás védelem)
        if (user.usedTxids && user.usedTxids.includes(txid)) {
            return res.status(400).json({ success: false, error: "Ezt a tranzakciót már felhasználtad!" });
        }

        // 3. BlockCypher API hívás (Litecoin ellenőrzés)
        const response = await axios.get(`https://api.blockcypher.com/v1/ltc/main/txs/${txid}`);
        const data = response.data;

        let foundAmount = 0;
        // Tranzakció validálás...
        if (data.outputs) {
            for (const output of data.outputs) {
                if (output.addresses && output.addresses.includes(myAddress)) {
                    foundAmount = output.value / 100000000; // Satoshiból LTC
                }
            }
        }

        if (foundAmount > 0) {
            // SIKERES FIZETÉS!

            // A. USD érték számítása (Fix árfolyam helyett dinamikus lenne jobb, de most egyszerűsítünk)
            // Tegyük fel 1 LTC = $70 (Ezt később API-ból kellene szedni)
            const usdValue = foundAmount * 70; 

            // B. Felhasználó jóváírása
            user.balance += usdValue;
            user.usedTxids.push(txid);
            await user.save();

            // C. JUTALÉK RENDSZER (Referral Commission)
            if (user.referrer) {
                const referrerUser = await User.findOne({ telegramId: user.referrer });
                
                if (referrerUser) {
                    // Megnézzük, mennyi a jutaléka (Influencer vs Sima)
                    // Ha influencer: commissionRate lehet 0.20 (20%), ha nem, akkor 0.10 (10%)
                    const commission = usdValue * referrerUser.commissionRate;
                    
                    referrerUser.balance += commission;
                    await referrerUser.save();
                    
                    console.log(`Jutalék jóváírva: ${referrerUser.telegramId}-nek $${commission}`);
                }
            }

            res.status(200).json({ success: true, newBalance: user.balance });
        } else {
            res.status(200).json({ success: false, error: "Nem érkezett pénz erre a címre ebben a TX-ben." });
        }

    } catch (error) {
        console.error(error);
        res.status(200).json({ success: false, error: "Hiba az ellenőrzés közben (Rossz TXID?)" });
    }
}
