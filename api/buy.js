import connectToDatabase from '../lib/mongodb';
import User from '../models/User';

// --- TITKOS LOKÁCIÓ ADATBÁZIS (Szerver oldalon!) ---
// Ezt csak te látod. Ide írd be a valódi koordinátákat és infókat.
const REWARDS = {
    // ID 1: Small Clay Box jutalma
    1: {
        locationName: "A Rejtett Parkoló",
        coordinates: "47.497913, 19.040236", // Pl. Deák tér
        secretMessage: "A harmadik oszlop mögött, a földön keress egy kőhalmot. Jelszó: 'Agyaggalamb'."
    },
    // ID 2: Medium Clay Box jutalma
    2: {
        locationName: "Elhagyott Raktárépület",
        coordinates: "47.456789, 19.123456", // Kamu koordináta
        secretMessage: "A hátsó bejáratnál a kék ajtó. Vigyázz, kamerák! Keresd a 'C-137' feliratot."
    },
    // ID 3: Large Clay Box jutalma (A legértékesebb)
    3: {
        locationName: "A Panoráma Tető",
        coordinates: "47.512345, 19.012345", // Kamu koordináta
        secretMessage: "A lépcsőház kódja: 1984. Menj fel a legfelső szintre. A kilátás a jutalom... és ami a pad alatt van."
    }
};


export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Csak POST!');

    const { telegramId, item } = req.body;

    if (!telegramId || !item) return res.status(400).json({ error: "Hiányzó adatok" });

    try {
        await connectToDatabase();

        // 1. Vevő megkeresése
        const user = await User.findOne({ telegramId: telegramId });
        if (!user) return res.status(404).json({ error: "User nem található" });

        // 2. Van elég pénze?
        if (user.balance < item.price) {
            return res.status(400).json({ error: "Nincs elég fedezet a számládon." });
        }

        // 3. VÁSÁRLÁS LEBONYOLÍTÁSA
        user.balance -= item.price; // Pénz levonása
        
        // Hozzáadjuk a tárgyat a raktárhoz (Inventory) - Opcionális, ha akarod látni mit vettek
        user.inventory.push({
            itemId: item.id,
            name: item.name,
            price: item.price
        });

        await user.save();

        // 4. JUTALÉK KIFIZETÉSE (A MEGHÍVÓNAK) - Ez marad a régi
        if (user.referrer) {
            const referrerUser = await User.findOne({ telegramId: user.referrer });
            if (referrerUser) {
                let rate = referrerUser.isInfluencer ? 0.20 : 0.10;
                const commission = item.price * rate;
                referrerUser.balance += commission;
                referrerUser.referralEarnings += commission;
                await referrerUser.save();
            }
        }

        // 5. JUTALOM KIVÁLASZTÁSA (EZ AZ ÚJ RÉSZ!)
        // Megnézzük, melyik dobozt vette, és kivesszük a hozzá tartozó titkos infót.
        const rewardData = REWARDS[item.id] || { locationName: "Hiba", secretMessage: "Nincs adat." };

        // Visszaküldjük a sikert ÉS a titkos adatokat
        res.status(200).json({ 
            success: true, 
            balance: user.balance, 
            reward: rewardData // Itt küldjük a koordinátát
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Szerver hiba" });
    }
}
