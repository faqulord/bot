// --- CLAY MYSTERY SHOP KÍNÁLAT ---
// A 'id'-nek egyeznie kell a Backend api/buy.js fájlban lévő REWARDS id-kkal!
const products = [
    { id: 1, name: "Small Clay Box", price: 10, icon: "📦", desc: "Egy gyakori titkos helyszín koordinátái." },
    { id: 2, name: "Medium Clay Box", price: 50, icon: "🎁", desc: "Egy ritkább, érdekesebb lokáció." },
    { id: 3, name: "Large Clay Box", price: 100, icon: "🏺", desc: "Exkluzív, prémium titkos helyszín." }
];

const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

let userId = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.id : 777777;
let balance = 0;
let invitedCount = 0;
let referralEarnings = 0;

window.onload = function() {
    const username = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.first_name : "Felfedező";
    document.getElementById('username').innerText = username;
    
    if(document.getElementById('ref-link')) {
        document.getElementById('ref-link').value = `https://t.me/SkyTechBot?start=${userId}`;
    }

    fetchUserData();
    renderShop();
};

// --- ADATBÁZIS ---
async function fetchUserData() {
    try {
        // Mivel a régi api/user.js még a "miners"-t adja vissza, azt most ignoráljuk,
        // csak az egyenleg és a meghívások kellenek.
        const response = await fetch(`/api/user?id=${userId}`);
        const data = await response.json();

        if (data.success) {
            balance = data.balance;
            invitedCount = data.invited || 0;
            referralEarnings = data.referralEarnings || 0;
            updateUI();
        }
    } catch (error) { console.error("Hiba az adatok lekérésekor", error); }
}

// --- BOLT RENDERELÉSE ---
function renderShop() {
    const list = document.getElementById('shop-list');
    list.innerHTML = '';
    
    products.forEach(p => {
        list.innerHTML += `
        <div class="machine-card">
            <div class="machine-header" style="display:flex; align-items:center;">
                <span style="font-size:32px; margin-right: 10px;">${p.icon}</span>
                <div>
                    <span style="font-weight:bold; color:var(--secondary); font-size: 18px;">${p.name}</span><br>
                    <span style="font-size:12px; color:#aaa; font-style:italic;">${p.desc}</span>
                </div>
            </div>
            <div class="machine-stats" style="margin-top: 15px;">
                <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                    <span class="stat-val" style="font-size: 20px;">$${p.price}</span>
                    <button class="rent-btn" onclick="buyItem(${p.id})" style="padding: 8px 20px;">MEGVESZEM</button>
                </div>
            </div>
        </div>`;
    });
}

// --- VÁSÁRLÁS ÉS JUTALOM MEGJELENÍTÉS ---
async function buyItem(id) {
    const item = products.find(p => p.id === id);
    
    if(balance < item.price) {
        tg.showAlert("Nincs elég fedezet az egyenlegeden.");
        return openModal('deposit', item.price);
    }

    tg.showConfirm(`Megveszed a(z) ${item.name} dobozt $${item.price} értékben?`, async (ok) => {
        if(ok) {
            showToast("A doboz kinyitása folyamatban... 🎲", "info");

            try {
                const res = await fetch('/api/buy', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ telegramId: userId, item: item })
                });
                const data = await res.json();
                
                if(data.success) {
                    balance = data.balance;
                    updateUI();
                    
                    // SIKER! Megjelenítjük a titkos jutalmat a modalban
                    showRewardModal(data.reward);
                    
                } else {
                    showToast(`❌ Hiba: ${data.error}`);
                }
            } catch(e) { showToast("Hálózati hiba történt."); }
        }
    });
}

// --- JUTALOM MODAL KEZELÉSE ---
function showRewardModal(reward) {
    document.getElementById('reward-location-name').innerText = reward.locationName;
    document.getElementById('reward-coords').innerText = reward.coordinates;
    document.getElementById('reward-message').innerText = `"${reward.secretMessage}"`;
    
    openModal('reward');
    tg.HapticFeedback.notificationOccurred('success'); // Kis rezgés a telefonon
}

function copyCoords() {
    const coords = document.getElementById('reward-coords').innerText;
    navigator.clipboard.writeText(coords);
    showToast("Koordináták másolva! Irány a térkép!");
}


// --- FIZETÉS ÉS UI ---
function updateUI() {
    document.getElementById('main-balance').innerText = balance.toFixed(2);
    
    const teamPage = document.getElementById('page-team');
    if (teamPage) {
        const h3s = teamPage.querySelectorAll('h3');
        if(h3s.length >= 2) {
            h3s[0].innerText = invitedCount;
            h3s[1].innerText = `$${referralEarnings.toFixed(2)}`;
        }
    }
}

function verifyPayment() {
    const txid = document.getElementById('txid').value;
    // FONTOS: Ide írd be a saját LTC címedet!
    const address = "ltc1qv5aape3pah2f954k5jjx9kgnrnkxzytm6f7an8"; 

    if(txid.length < 5) return tg.showAlert("Érvénytelen TXID formátum.");

    const btn = document.querySelector('#modal-deposit .confirm-btn');
    btn.innerText = "Ellenőrzés...";
    btn.disabled = true;

    fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txid, myAddress: address, telegramId: userId })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            balance = data.newBalance;
            updateUI();
            closeModal('deposit');
            showToast(`Sikeres feltöltés! +$${data.newBalance} jóváírva.`);
        } else {
            tg.showAlert("Hiba: " + data.error);
        }
        btn.innerText = "Beküldés";
        btn.disabled = false;
    });
}

// --- EGYÉB ---
function nav(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    
    const icons = { 'home': 0, 'team': 1, 'mine': 2 };
    if(document.querySelectorAll('.nav-item')[icons[page]]) {
        document.querySelectorAll('.nav-item')[icons[page]].classList.add('active');
    }
}

function openModal(type, amt) {
    if(amt) document.getElementById('dep-amount').value = amt;
    document.getElementById('modal-' + type).style.display = 'flex';
}
function closeModal(type) { document.getElementById('modal-' + type).style.display = 'none'; }
function copyRef() { 
    const ref = document.getElementById('ref-link');
    ref.select(); document.execCommand('copy'); 
    showToast("Meghívó link másolva!"); 
}
function copyAddr() {
    navigator.clipboard.writeText(document.getElementById('wallet-addr').innerText);
    showToast("LTC cím másolva!");
}
function showToast(msg) {
    const box = document.getElementById('notification-container');
    const div = document.createElement('div');
    div.className = 'notify-bubble';
    div.innerHTML = msg;
    box.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}
