const axios = require('axios');

export default async function handler(req, res) {
    // Csak POST kérést fogadunk el
    if (req.method !== 'POST') {
        return res.status(405).send('Csak POST kérés mehet');
    }

    const { txid, myAddress } = req.body;

    // Ha a felhasználó nem írt be semmit
    if (!txid || !myAddress) {
        return res.status(400).json({ success: false, error: "Hiányzó adatok!" });
    }

    try {
        // Lekérdezzük a tranzakciót a BlockCypher (Litecoin) hálózatról
        const response = await axios.get(`https://api.blockcypher.com/v1/ltc/main/txs/${txid}`);
        const data = response.data;

        let foundAmount = 0;

        // Végignézzük, kinek ment a pénz ebben a tranzakcióban
        if (data.outputs) {
            for (const output of data.outputs) {
                // Ha a kimenetek között ott van a TE címed
                if (output.addresses && output.addresses.includes(myAddress)) {
                    // A blokklánc "satoshi"-ban számol, osztani kell 100 millióval
                    foundAmount = output.value / 100000000;
                }
            }
        }

        if (foundAmount > 0) {
            // SIKER! Megtaláltuk az utalást.
            // Átváltjuk Forintra (pl. 1 LTC = 35.000 Ft árfolyamon)
            const hufValue = Math.floor(foundAmount * 35000); 

            res.status(200).json({ 
                success: true, 
                amount_ltc: foundAmount, 
                amount_huf: hufValue 
            });
        } else {
            res.status(200).json({ success: false, error: "A pénz nem a te címedre érkezett!" });
        }

    } catch (error) {
        console.error(error);
        res.status(200).json({ success: false, error: "Érvénytelen vagy nem létező TXID!" });
    }
}