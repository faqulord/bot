// --- CLAY PREMIUM SHOP ADATBÁZIS ---
// Fontos: Az ID-k egyezzenek a backenddel (api/buy.js)!
const products = [
    { 
        id: 1, 
        name: "Starter Box", 
        category: "starter",
        price: 5, 
        originalPrice: 10, // Ezért lesz áthúzva!
        badge: "-50%", 
        icon: "📦", 
        desc: "Ideális kezdőknek. Egy könnyen elérhető városi lokáció." 
    },
    { 
        id: 2, 
        name: "Explorer Pack", 
        category: "starter",
        price: 25, 
        originalPrice: 40,
        badge: "HOT", 
        icon: "🧭", 
        desc: "Izgalmas helyszín, rejtett üzenettel." 
    },
    { 
        id: 3, 
        name: "Pro Vault", 
        category: "pro",
        price: 80, 
        originalPrice: 100, 
        badge: "SALE", 
        icon: "🏺", 
        desc: "Nehezen megközelíthető, nagy értékű titok." 
    },
    { 
        id: 4, 
        name: "VIP Gold Access", 
        category: "vip",
        price: 300, 
        originalPrice: null, // Nincs akció
        badge: "NEW", 
        icon: "👑", 
        desc: "A legexkluzívabb lokációk és 24h support." 
    }
];

const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

let userId = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.id : 888888;
let balance = 0;

window.onload = function() {
    const username = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.first_name : "Vendég";
    
    // Referral link generálás
    if(document.getElementById('ref-link')) {
        document.getElementById('ref-link').value = `https://t.me/SkyTechBot?start=${userId}`;
    }

    fetchUserData();
    renderShop('all'); // Alapból mindent mutat
};

// --- ADATOK LEKÉRÉSE ---
async function fetchUserData() {
    try {
        const response = await fetch(`/api/user?id=${userId}`);
        const data = await response.json();
        if (data.success) {
            balance = data.balance;
            document.getElementById('main-balance').innerText = balance.toFixed(2);
            document.getElementById('team-count').innerText = data.invited || 0;
            document.getElementById('team-earn').innerText = (data.referralEarnings || 0).toFixed(2);
            renderInventory(data.inventory || []);
        }
    } catch (e) { console.error(e); }
}

// --- SHOP RENDERELÉS (Kártyák) ---
function renderShop(filter) {
    const grid = document.getElementById('shop-grid');
    grid.innerHTML = '';
    
    products.forEach(p => {
        if(filter !== 'all' && p.category !== filter) return;

        // Ár logika (ha van akció)
        let priceHtml = '';
        if(p.originalPrice) {
            priceHtml = `<span class="old-price">$${p.originalPrice}</span> <span class="new-price">$${p.price}</span>`;
        } else {
            priceHtml = `<span class="new-price">$${p.price}</span>`;
        }

        // Badge logika
        let badgeHtml = p.badge ? `<div class="badge">${p.badge}</div>` : '';

        grid.innerHTML += `
        <div class="product-card">
            ${badgeHtml}
            <div class="prod-img">${p.icon}</div>
            <div class="prod-info">
                <div class="prod-title">${p.name}</div>
                <div class="prod-desc">${p.desc}</div>
                <div class="price-row">${priceHtml}</div>
                <button class="buy-btn" onclick="buyItem(${p.id})">KOSÁRBA</button>
            </div>
        </div>`;
    });
}

// --- SZŰRÉS ---
function filterShop(category, btn) {
    // Aktív gomb stílus
    document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
    
    // Renderelés
    renderShop(category);
}

// --- VÁSÁRLÁS LOGIKA ---
async function buyItem(id) {
    const item = products.find(p => p.id === id);
    
    // Ellenőrzés
    if(balance < item.price) {
        tg.showAlert("⚠️ Nincs elég egyenleged! Tölts fel pénzt.");
        openModal('deposit');
        return;
    }

    tg.showConfirm(`Megveszed: ${item.name}?\nÁr: $${item.price}`, async (ok) => {
        if(ok) {
            try {
                // Backend hívás
                const res = await fetch('/api/buy', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ telegramId: userId, item: item })
                });
                const data = await res.json();
                
                if(data.success) {
                    balance = data.balance;
                    document.getElementById('main-balance').innerText = balance.toFixed(2);
                    
                    // JUTALOM MEGJELENÍTÉSE
                    document.getElementById('reward-location-name').innerText = data.reward.locationName;
                    document.getElementById('reward-coords').innerText = data.reward.coordinates;
                    document.getElementById('reward-message').innerText = data.reward.secretMessage;
                    
                    openModal('reward');
                    tg.HapticFeedback.notificationOccurred('success');
                    
                } else {
                    tg.showAlert(`Hiba: ${data.error}`);
                }
            } catch(e) { tg.showAlert("Hálózati hiba!"); }
        }
    });
}

// --- RAKTÁR MEGJELENÍTÉS ---
function renderInventory(items) {
    const list = document.getElementById('inventory-list');
    list.innerHTML = '';
    if(items.length === 0) list.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">Még nincs vásárolt terméked.</p>';
    
    items.reverse().forEach(item => {
        list.innerHTML += `
        <div style="background:#333; padding:10px; margin-bottom:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <div style="font-weight:bold; color:#fff">${item.name}</div>
                <div style="font-size:10px; color:#aaa">Vásárolva</div>
            </div>
            <div style="color:var(--gold)">$${item.price}</div>
        </div>`;
    });
}

// --- MODAL KEZELÉS ---
function openModal(id) { document.getElementById('modal-'+id).style.display = 'flex'; }
function closeModal(id) { document.getElementById('modal-'+id).style.display = 'none'; }
function showInventory() { openModal('inventory'); }

// --- NAVIGÁCIÓ (TAB BAR) ---
function nav(page) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('page-' + page).style.display = 'block';
    
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    // Egyszerűsített logika a gomb aktiváláshoz
    if(page === 'home') document.querySelectorAll('.tab-item')[0].classList.add('active');
    if(page === 'team') document.querySelectorAll('.tab-item')[2].classList.add('active');
}

// --- FIZETÉS ELLENŐRZÉS (Backend) ---
function verifyPayment() {
    const txid = document.getElementById('txid').value;
    const address = "ltc1qv5aape3pah2f954k5jjx9kgnrnkxzytm6f7an8"; 
    
    if(txid.length < 5) return tg.showAlert("Érvénytelen TXID!");
    
    // Gomb letiltása
    const btn = document.querySelector('#modal-deposit .pro-btn');
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
            document.getElementById('main-balance').innerText = balance.toFixed(2);
            closeModal('deposit');
            tg.showAlert("✅ Sikeres jóváírás!");
        } else {
            tg.showAlert("❌ Hiba: " + data.error);
        }
        btn.innerText = "Jóváírás Kérése";
        btn.disabled = false;
    });
}

function copyAddr() { navigator.clipboard.writeText("ltc1qv5aape3pah2f954k5jjx9kgnrnkxzytm6f7an8"); tg.showAlert("Cím másolva!"); }
function copyRef() { 
    const ref = document.getElementById('ref-link');
    ref.select(); document.execCommand('copy'); 
    tg.showAlert("Link másolva!"); 
}
