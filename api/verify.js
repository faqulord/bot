const axios = require('axios');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Csak POST kérés mehet');
    }

    const { txid, myAddress } = req.body;

    if (!txid || !myAddress) {
        return res.status(400).json({ error: "Hiányzó adatok!" });
    }

    try {
        // A BlockCypher ingyenes API-ját használjuk a Litecoin lánc figyelésére
        const response = await axios.get(`https://api.blockcypher.com/v1/ltc/main/txs/${txid}`);
        const data = response.data;

        // Megnézzük, hogy a tranzakció kimenetei között ott van-e a te címed
        let foundAmount = 0;
        
        // Végigmegyünk az összes kimeneten (hova ment a pénz?)
        for (const output of data.outputs) {
            if (output.addresses && output.addresses.includes(myAddress)) {
                // A BlockCypher "satoshi"-ban adja meg (az érték 100 milliomod része), átváltjuk
                foundAmount = output.value / 100000000; 
            }
        }

        if (foundAmount > 0) {
            // SIKER! Megtaláltuk az utalást.
            // Itt számoljuk át USD-re vagy HUF-ra (kb. árfolyamon)
            // Most fixen 1 LTC = 35.000 HUF-fal számolunk példaként
            const hufValue = Math.floor(foundAmount * 35000); 

            res.status(200).json({ 
                success: true, 
                amount: foundAmount, 
                huf: hufValue,
                confirmations: data.confirmations 
            });
        } else {
            res.status(200).json({ success: false, error: "Nem erre a címre jött a pénz!" });
        }

    } catch (error) {
        console.error(error);
        res.status(200).json({ success: false, error: "Hibás vagy nem létező TXID!" });
    }
}