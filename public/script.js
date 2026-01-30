// --- CONFIGURATION ---
const tg = window.Telegram.WebApp;
tg.expand();

const LTC_ADDRESS = "ltc1qv5aape3pah2f954k5jjx9kgnrnkxzytm6f7an8";
const CYCLE_TIME = 24 * 60 * 60 * 1000; // 24 óra
// const CYCLE_TIME = 10 * 1000; // TESZT MÓD: Ha ki akarod próbálni gyorsan (10 mp), vedd ki a kommentjelet!

// --- DATA ---
const machines = [
    { id: 1, name: "VIP 1 - Node V1", price: 15, daily: 1.20, roi: 20 },
    { id: 2, name: "VIP 2 - Node V2", price: 50, daily: 4.00, roi: 20 },
    { id: 3, name: "VIP 3 - Cluster", price: 100, daily: 9.00, roi: 18 },
    { id: 4, name: "VIP 4 - Farm X", price: 300, daily: 30.00, roi: 15 },
    { id: 5, name: "VIP 5 - Mega Farm", price: 800, daily: 90.00, roi: 14 },
    { id: 6, name: "VIP 6 - Giga Watt", price: 1600, daily: 200.00, roi: 12 },
    { id: 7, name: "VIP 7 - Quantum X", price: 2700, daily: 400.00, roi: 10 }
];

// --- STATE MANAGEMENT ---
let balance = parseFloat(localStorage.getItem('balance')) || 5.00;
let vipLevel = parseInt(localStorage.getItem('vipLevel')) || 0;
let myMiners = JSON.parse(localStorage.getItem('myMiners')) || [];
let tasksDone = JSON.parse(localStorage.getItem('tasksDone')) || {1:false, 2:false};

// User Handling
let userId = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.id : Math.floor(Math.random() * 90000) + 10000;
let username = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.first_name : "User";

// --- INIT ---
window.onload = function() {
    document.getElementById('username').innerText = username;
    if(document.getElementById('ref-link')) {
        document.getElementById('ref-link').value = `https://t.me/SkyTechBot?start=${userId}`;
    }
    
    updateUI();
    renderMachines();
    renderMyMiners();
    checkTasks();
    startFakeNotifications(); // Jobb oldali popupok indítása
    
    // Időzítő hurok (másodpercenként frissít)
    setInterval(updateTimers, 1000);
};

// --- CORE FUNCTIONS ---

// 1. GÉPEK MEGJELENÍTÉSE (SHOP)
function renderMachines() {
    const list = document.getElementById('machine-list');
    list.innerHTML = '';
    
    machines.forEach(m => {
        list.innerHTML += `
        <div class="machine-card">
            <div class="machine-header">
                <span>${m.name}</span>
                <span style="color:#888; font-size:12px;">Valid: 365 Days</span>
            </div>
            <div class="machine-stats">
                <div>
                    <span class="stat-val">$${m.price}</span><br>
                    <span class="stat-lbl">Price</span>
                </div>
                <div style="text-align:right;">
                    <span class="stat-val">+$${m.daily}</span><br>
                    <span class="stat-lbl">Daily Profit</span>
                </div>
            </div>
            <button class="rent-btn" onclick="buyMachine(${m.id})">RENT NOW</button>
        </div>`;
    });
}

// 2. VÁSÁRLÁS
function buyMachine(id) {
    const machine = machines.find(m => m.id === id);

    if (balance >= machine.price) {
        tg.showConfirm(`Rent ${machine.name} for $${machine.price}?`, (ok) => {
            if (ok) {
                balance -= machine.price;
                
                // Új miner hozzáadása (START GOMB LOGIKÁHOZ BŐVÍTVE)
                myMiners.push({
                    instanceId: Date.now(), // Egyedi azonosító
                    modelId: machine.id,
                    name: machine.name,
                    daily: machine.daily,
                    lastStart: 0, // 0 = nincs elindítva
                    expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 365 nap múlva jár le
                });

                if (vipLevel === 0) vipLevel = 1;
                
                saveData();
                updateUI();
                renderMyMiners();
                showToast(`✅ Successfully rented ${machine.name}!`, 'success');
                
                // Átdob a Miners oldalra
                nav('miners', document.querySelectorAll('.nav-item')[1]);
            }
        });
    } else {
        openModal('deposit', machine.price);
    }
}

// 3. SAJÁT GÉPEK LISTÁZÁSA (A FŐ START/CLAIM LOGIKA)
function renderMyMiners() {
    const list = document.getElementById('my-miners-list');
    
    if (myMiners.length === 0) {
        list.innerHTML = `<div style="text-align:center; color:#666; padding:40px;">
            <i class="fas fa-server" style="font-size:40px; margin-bottom:10px; opacity:0.3"></i><br>
            No active miners.<br>Go to Home to rent one!
        </div>`;
        return;
    }

    list.innerHTML = "";
    // Fordított sorrend (legújabb felül)
    myMiners.sort((a,b) => b.instanceId - a.instanceId).forEach(miner => {
        let btnHTML = "";
        let statusText = "";
        let timerColor = "#666";
        const now = Date.now();

        // LOGIKA:
        if (miner.lastStart === 0) {
            // ÁLLAPOT 1: MÉG NEM INDULT EL -> START GOMB
            btnHTML = `<button class="btn-miner-action btn-start" onclick="startMining(${miner.instanceId})">START MINING</button>`;
            statusText = "Ready to Start";
        } else {
            const elapsed = now - miner.lastStart;
            
            if (elapsed >= CYCLE_TIME) {
                // ÁLLAPOT 3: LEJÁRT AZ IDŐ -> CLAIM GOMB
                btnHTML = `<button class="btn-miner-action btn-claim" onclick="claimProfit(${miner.instanceId})">CLAIM +$${miner.daily}</button>`;
                statusText = "Cycle Completed";
                timerColor = "#00e676";
            } else {
                // ÁLLAPOT 2: FUT A GÉP -> SZÜRKE GOMB + IDŐZÍTŐ
                btnHTML = `<button class="btn-miner-action btn-wait">MINING...</button>`;
                statusText = "Mining in Progress";
                timerColor = "#00ff88";
            }
        }

        list.innerHTML += `
            <div class="active-miner" id="miner-${miner.instanceId}">
                <div class="miner-top">
                    <span style="color:#00bfff">${miner.name}</span>
                    <span style="font-size:10px; color:#888;">Valid: 365 Days</span>
                </div>
                <div class="miner-timer-display" id="timer-${miner.instanceId}" style="color:${timerColor}">--:--:--</div>
                ${btnHTML}
                <div style="font-size:10px; color:#555; text-align:center; margin-top:5px;">${statusText}</div>
            </div>
        `;
    });
    
    updateTimers(); // Azonnal frissítjük a számokat
}

// 4. INDÍTÁS
function startMining(instanceId) {
    const miner = myMiners.find(m => m.instanceId === instanceId);
    if (miner) {
        miner.lastStart = Date.now();
        saveData();
        renderMyMiners(); // Újrarajzoljuk, hogy megjelenjen a számláló
    }
}

// 5. CLAIM (PROFIT BESZEDÉSE)
function claimProfit(instanceId) {
    const miner = myMiners.find(m => m.instanceId === instanceId);
    if (miner) {
        balance += miner.daily;
        miner.lastStart = 0; // Visszaállítjuk nullára (Start állapotba)
        saveData();
        updateUI();
        renderMyMiners();
        showToast(`💰 +$${miner.daily} Profit Collected!`, 'success');
    }
}

// 6. IDŐZÍTŐ FRISSÍTÉSE (MP-enkét fut)
function updateTimers() {
    const now = Date.now();
    
    myMiners.forEach(miner => {
        // Csak akkor számolunk, ha el van indítva
        if(miner.lastStart > 0) {
            const el = document.getElementById(`timer-${miner.instanceId}`);
            if(!el) return;

            const elapsed = now - miner.lastStart;
            const remaining = CYCLE_TIME - elapsed;

            if (remaining > 0) {
                const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
                const m = Math.floor((remaining / (1000 * 60)) % 60);
                const s = Math.floor((remaining / 1000) % 60);
                el.innerText = `${h}h ${m}m ${s}s`;
            } else {
                // Ha most járt le éppen, frissítsük a UI-t, hogy megjelenjen a Claim gomb
                if(el.innerText !== "COMPLETED") {
                    el.innerText = "COMPLETED";
                    el.style.color = "#00e676";
                    renderMyMiners(); // Gombok cseréje
                }
            }
        }
    });
}

// --- STANDARD FEATURES (BEFIZETÉS, TASK, STB) ---

function verifyPayment() {
    const txid = document.getElementById('txid').value;
    if(txid.length < 5) return tg.showAlert("Invalid TXID");

    const btn = document.querySelector('#modal-deposit .confirm-btn');
    const originalText = btn.innerText;
    btn.innerText = "Checking Blockchain...";
    btn.disabled = true;

    setTimeout(() => {
        let amount = parseFloat(document.getElementById('dep-amount').value) || 10;
        balance += amount;
        saveData();
        updateUI();
        
        showToast(`✅ Payment Confirmed: +$${amount}`, 'success');
        closeModal('deposit');
        
        btn.innerText = originalText;
        btn.disabled = false;
        document.getElementById('txid').value = "";
    }, 2500);
}

function doTask(id) {
    if(tasksDone[id]) return;
    const btn = document.getElementById('btn-task-' + id);
    btn.innerText = "Checking...";

    setTimeout(() => {
        if(id===1) window.open('https://t.me/SkyTechSupport', '_blank'); // Csatorna link
        if(id===2) window.open('https://twitter.com', '_blank'); // Twitter link

        setTimeout(() => {
            btn.innerText = "Done";
            btn.disabled = true;
            btn.style.background = "#333";
            balance += 2.00;
            tasksDone[id] = true;
            saveData();
            updateUI();
            showToast("Task Complete! +$2.00 added.", 'success');
        }, 3000);
    }, 500);
}

function checkTasks() {
    if(tasksDone[1]) { 
        const b = document.getElementById('btn-task-1'); 
        if(b) { b.innerText = "Done"; b.disabled = true; b.style.background = "#333"; }
    }
    if(tasksDone[2]) { 
        const b = document.getElementById('btn-task-2'); 
        if(b) { b.innerText = "Done"; b.disabled = true; b.style.background = "#333"; }
    }
}

// --- HELPER FUNCTIONS ---

function updateUI() {
    document.getElementById('main-balance').innerText = balance.toFixed(2);
    if(document.getElementById('with-bal')) document.getElementById('with-bal').innerText = balance.toFixed(2);
    
    // VIP kijelzés
    const vipEl = document.getElementById('vip-display');
    if(vipEl) {
        vipEl.innerText = `VIP ${vipLevel}`;
        if(vipLevel > 0) vipEl.classList.add('active');
    }
}

function saveData() {
    localStorage.setItem('balance', balance);
    localStorage.setItem('vipLevel', vipLevel);
    localStorage.setItem('myMiners', JSON.stringify(myMiners));
    localStorage.setItem('tasksDone', JSON.stringify(tasksDone));
}

// ÚJ ÉRTESÍTÉSI RENDSZER (JOBB OLDALI POPUP)
function showToast(msg, type='info') {
    const container = document.getElementById('notification-container');
    if(!container) return; // Ha nincs a HTML-ben, nem csinál semmit

    const div = document.createElement('div');
    div.className = 'notify-bubble';
    div.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    
    container.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}

// FAKE USERS POPUP (HANGULATKELTÉS)
function startFakeNotifications() {
    const users = ['User99**', 'CryptoM**', 'Anna_K**', 'LTC_Wh**', 'Hunter01'];
    const acts = ['withdrew $120', 'rented VIP 2', 'invited a friend', 'earned $45 profit'];
    
    setInterval(() => {
        if(Math.random() > 0.4) {
            const container = document.getElementById('notification-container');
            if(container) {
                const u = users[Math.floor(Math.random()*users.length)];
                const a = acts[Math.floor(Math.random()*acts.length)];
                
                const div = document.createElement('div');
                div.className = 'notify-bubble';
                div.innerHTML = `<i class="fas fa-user-circle"></i> <div><b>${u}</b><br>${a}</div>`;
                container.appendChild(div);
                setTimeout(() => div.remove(), 4000);
            }
        }
    }, 5000);
}

// NAVIGATION & MODALS
function nav(pageId, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    const page = document.getElementById('page-' + pageId);
    if(page) page.classList.add('active');
    if(btn) btn.classList.add('active');
}

function openModal(type, amt=0) {
    if(type==='deposit' && amt > 0) {
        const inp = document.getElementById('dep-amount');
        if(inp) inp.value = amt; // Ha input mező
    }
    document.getElementById('modal-' + type).style.display = 'flex';
}
function closeModal(type) { document.getElementById('modal-' + type).style.display = 'none'; }
function openWithdrawModal() {
    if(vipLevel === 0) tg.showAlert("⚠️ VIP 0 cannot withdraw.\nPlease invest first.");
    else openModal('withdraw');
}
function copyAddr() { 
    navigator.clipboard.writeText(LTC_ADDRESS).then(() => showToast("Address Copied!")); 
}
function copyRef() { 
    const ref = document.getElementById('ref-link');
    if(ref) {
        ref.select();
        document.execCommand('copy');
        showToast("Invite Link Copied!");
    }
}
function toggleLanguage() {
    showToast("Language switch coming soon!");
}