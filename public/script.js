const tg = window.Telegram.WebApp;
tg.expand();

const MY_LTC_ADDRESS = "ltc1qv5aape3pah2f954k5jjx9kgnrnkxzytm6f7an8";

// ADATOK
let balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')) : 5.000000;
let energy = 100;
let vipLevel = localStorage.getItem('vipLevel') ? parseInt(localStorage.getItem('vipLevel')) : 0; // 0 = Ingyenes, 1 = Fizetős

updateUI();

// ÉLŐ SZÁMLÁLÓ (Csak vizuális, hogy izgalmas legyen)
setInterval(() => {
    // Minden másodpercben nő egy picit a kijelzőn
    balance += 0.000001; 
    updateUI();
}, 1000);

// ENERGIA TÖLTÉS (Lassú)
setInterval(() => {
    if(energy < 100) {
        energy += 1;
        updateUI();
    }
}, 3000); // 3 másodpercenként +1 energia

// KATTINTÁS (BÁNYÁSZAT)
function tapMining() {
    if(energy >= 5) {
        // Levonjuk az energiát
        energy -= 5;
        
        // Adunk pénzt (VIP 0-nak keveset, VIP 1-nek többet)
        let reward = vipLevel === 0 ? 0.0001 : 0.0005;
        balance += reward;
        
        // Animáció (gomb összenyomása - CSS kezeli :active-val)
        // Lebegő szöveg
        showFloatText();
        
        updateUI();
    } else {
        tg.showAlert("⚠️ Elfogyott az Energiád! Pihenj vagy nézz reklámot (hamarosan).");
    }
}

function showFloatText() {
    // Itt lehetne lebegő szöveget csinálni, de a mobil teljesítmény miatt most egyszerűsítjük
}

// NAVIGÁCIÓ
function switchPage(pageId, element) {
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    element.classList.add('active');
}

// FIZETÉS INDÍTÁSA
function openDeposit(price, name, daily) {
    document.getElementById('deposit-modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = name;
    document.getElementById('modal-price').innerText = "$" + price;
    // Itt elmenthetnénk, melyik csomagot akarja venni
}

function closeModal() {
    document.getElementById('deposit-modal').style.display = 'none';
}

function copyAddress() {
    navigator.clipboard.writeText(MY_LTC_ADDRESS);
    tg.showAlert("LTC Cím Másolva!");
}

function openWithdraw() {
    if(vipLevel === 0) {
        tg.showAlert("🔒 KIFIZETÉS ZÁROLVA!\n\nA kifizetéshez legalább VIP 1 szint szükséges (Vásárolj gépet a Shopban).");
    } else {
        if(balance >= 20.00) {
            tg.showAlert("Kifizetési kérelem elküldve! (Feldolgozás: 24 óra)");
        } else {
            tg.showAlert(`⚠️ Minimum kifizetés: $20.00\nJelenleg: $${balance.toFixed(2)}`);
        }
    }
}

// FIZETÉS ELLENŐRZÉS (A LÉNYEG)
async function checkPayment() {
    const txid = document.getElementById('txid-input').value.trim();
    if(txid.length < 5) return tg.showAlert("Hibás TXID");
    
    tg.MainButton.text = "ELLENŐRZÉS...";
    tg.MainButton.show();
    
    try {
        const res = await fetch('/api/verify', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ txid: txid, myAddress: MY_LTC_ADDRESS })
        });
        const data = await res.json();
        tg.MainButton.hide();

        if(data.success) {
            // SIKER! Megvette a gépet.
            
            // 1. Megkapja a VIP szintet
            vipLevel = 1; 
            localStorage.setItem('vipLevel', 1);
            
            // 2. Jóváírjuk az összeget (Dollarban)
            let depositedUSD = Math.floor(data.amount_huf / 380); 
            balance += depositedUSD;
            
            updateUI();
            closeModal();
            tg.showAlert(`✅ SIKERES VÁSÁRLÁS!\n\nGratulálunk! Mostantól VIP 1 vagy.\nA kifizetés feloldva.`);
            
        } else {
            tg.showAlert("Hiba: " + data.error);
        }
    } catch(e) {
        tg.MainButton.hide();
        tg.showAlert("Hálózati hiba!");
    }
}

// UI FRISSÍTÉS
function updateUI() {
    document.getElementById('live-balance').innerText = balance.toFixed(4);
    document.getElementById('header-balance').innerText = balance.toFixed(2);
    document.getElementById('wallet-bal').innerText = balance.toFixed(2);
    
    // Energia
    document.getElementById('energy-val').innerText = energy;
    document.getElementById('energy-bar').style.width = energy + "%";
    
    // VIP Badge
    const badge = document.getElementById('vip-badge');
    if(vipLevel > 0) {
        badge.innerText = "VIP " + vipLevel;
        badge.style.color = "#fbbf24";
        badge.style.borderColor = "#fbbf24";
    } else {
        badge.innerText = "VIP 0";
    }
    
    localStorage.setItem('balance', balance);
}

// REFERRAL
const user = tg.initDataUnsafe.user;
function copyRef() {
    const link = user ? `https://t.me/Offcourse77_bot?start=${user.id}` : "https://t.me/Offcourse77_bot";
    navigator.clipboard.writeText(link);
    tg.showAlert("Meghívó link másolva!");
}
if(user) document.getElementById('ref-link').innerText = `https://t.me/Offcourse77_bot?start=${user.id}`;

// KAMU ÉRTESÍTÉSEK
const fakeNames = ['Gábor', 'Bence', 'Anna', 'Zoli', 'Péter'];
const fakeActions = ['kivett $25-t', 'kivett $50-t', 'vásárolt GPU-t (VIP 1)', 'meghívott egy barátot'];
setInterval(() => {
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const action = fakeActions[Math.floor(Math.random() * fakeActions.length)];
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = `${name} ${action}`;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 4000);
}, 10000);