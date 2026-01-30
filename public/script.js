// --- CONFIGURATION ---
const tg = window.Telegram.WebApp;
tg.expand();

// Ciklus idő: 24 óra (86400000 ms)
const CYCLE_TIME = 24 * 60 * 60 * 1000; 

// --- ÚJ MATEK (ROI ~45-50 NAP) ---
// Szabály: Ár / Napi profit = kb. 45-50 nap megtérülés
const machines = [
    { id: 1, name: "VIP 1 - Node V1", price: 15, daily: 0.35, roi: 365 },   // ~42 nap megtérülés
    { id: 2, name: "VIP 2 - Node V2", price: 50, daily: 1.10, roi: 365 },   // ~45 nap
    { id: 3, name: "VIP 3 - Cluster", price: 100, daily: 2.20, roi: 365 },  // ~45 nap
    { id: 4, name: "VIP 4 - Farm X", price: 300, daily: 7.00, roi: 365 },   // ~42 nap
    { id: 5, name: "VIP 5 - Mega Farm", price: 800, daily: 18.00, roi: 365 }, // ~44 nap
    { id: 6, name: "VIP 6 - Giga Watt", price: 1600, daily: 38.00, roi: 365 }, // ~42 nap
    { id: 7, name: "VIP 7 - Quantum X", price: 2700, daily: 65.00, roi: 365 }  // ~41 nap
];

// --- STATE MANAGEMENT ---
let balance = parseFloat(localStorage.getItem('balance')) || 0.00;
let vipLevel = parseInt(localStorage.getItem('vipLevel')) || 0;
let myMiners = JSON.parse(localStorage.getItem('myMiners')) || [];
let tasksDone = JSON.parse(localStorage.getItem('tasksDone')) || {1:false, 2:false};

// User Handling
let userId = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.id : Math.floor(Math.random() * 90000) + 10000;
let username = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.first_name : "User";

// --- INIT ---
window.onload = function() {
    // UI inicializálás
    document.getElementById('username').innerText = username;
    if(document.getElementById('ref-link')) {
        document.getElementById('ref-link').value = `https://t.me/SkyTechBot?start=${userId}`;
    }
    
    updateUI();
    renderMachines();
    renderMyMiners();
    checkTasks();
    startFakeNotifications(); 
    
    // Időzítő hurok (másodpercenként)
    setInterval(updateTimers, 1000);
};

// --- CORE FUNCTIONS ---

// 1. SHOP RENDERELÉSE
function renderMachines() {
    const list = document.getElementById('machine-list');
    list.innerHTML = '';
    
    machines.forEach(m => {
        list.innerHTML += `
        <div class="machine-card">
            <div class="machine-header">
                <span>${m.name}</span>
                <span style="color:#888; font-size:12px;">Valid: ${m.roi} Days</span>
            </div>
            <div class="machine-stats">
                <div>
                    <span class="stat-val">$${m.price}</span><br>
                    <span class="stat-lbl">Price</span>
                </div>
                <div style="text-align:right;">
                    <span class="stat-val" style="color:#00ff88">+$${m.daily.toFixed(2)}</span><br>
                    <span class="stat-lbl">Daily Profit</span>
                </div>
            </div>
            <button class="rent-btn" onclick="buyMachine(${m.id})">RENT NOW</button>
        </div>`;
    });
}

// 2. VÁSÁRLÁS LOGIKA
function buyMachine(id) {
    const machine = machines.find(m => m.id === id);

    if (balance >= machine.price) {
        tg.showConfirm(`Rent ${machine.name} for $${machine.price}?`, (ok) => {
            if (ok) {
                balance -= machine.price;
                
                // Miner hozzáadása
                myMiners.push({
                    instanceId: Date.now(), 
                    modelId: machine.id,
                    name: machine.name,
                    daily: machine.daily,
                    lastStart: 0, // 0 = Inaktív, el kell indítani
                    expiresAt: Date.now() + (machine.roi * 24 * 60 * 60 * 1000)
                });

                // VIP Upgrade logika
                if (machine.price >= 15 && vipLevel < 1) vipLevel = 1;
                if (machine.price >= 300 && vipLevel < 2) vipLevel = 2;
                
                saveData();
                updateUI();
                renderMyMiners();
                showToast(`✅ Successfully rented ${machine.name}!`, 'success');
                
                // Átirányítás a Miners fülre
                nav('miners', document.querySelectorAll('.nav-item')[1]);
            }
        });
    } else {
        openModal('deposit', machine.price);
    }
}

// 3. MINERS LISTA (START / CLAIM RENDSZER)
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
    // Legújabb elől
    myMiners.sort((a,b) => b.instanceId - a.instanceId).forEach(miner => {
        let btnHTML = "";
        let statusText = "";
        let timerColor = "#666";
        const now = Date.now();

        // LOGIKA:
        if (miner.lastStart === 0) {
            // 1. ÁLLAPOT: Nincs elindítva
            btnHTML = `<button class="btn-miner-action btn-start" onclick="startMining(${miner.instanceId})">START MINING</button>`;
            statusText = "Ready to Start";
        } else {
            const elapsed = now - miner.lastStart;
            
            if (elapsed >= CYCLE_TIME) {
                // 3. ÁLLAPOT: Kész, felvehető
                btnHTML = `<button class="btn-miner-action btn-claim" onclick="claimProfit(${miner.instanceId})">CLAIM +$${miner.daily.toFixed(2)}</button>`;
                statusText = "Cycle Completed";
                timerColor = "#00e676";
            } else {
                // 2. ÁLLAPOT: Fut a gép
                btnHTML = `<button class="btn-miner-action btn-wait">MINING...</button>`;
                statusText = "Mining in Progress";
                timerColor = "#00ff88";
            }
        }

        list.innerHTML += `
            <div class="active-miner" id="miner-${miner.instanceId}">
                <div class="miner-top">
                    <span style="color:#00bfff">${miner.name}</span>
                    <span style="font-size:10px; color:#888;">Active</span>
                </div>
                <div class="miner-timer-display" id="timer-${miner.instanceId}" style="color:${timerColor}">--:--:--</div>
                ${btnHTML}
                <div style="font-size:10px; color:#555; text-align:center; margin-top:5px;">${statusText}</div>
            </div>
        `;
    });
    
    updateTimers(); 
}

// 4. INDÍTÁS
function startMining(instanceId) {
    const miner = myMiners.find(m => m.instanceId === instanceId);
    if (miner) {
        miner.lastStart = Date.now();
        saveData();
        renderMyMiners(); 
    }
}

// 5. CLAIM PROFIT
function claimProfit(instanceId) {
    const miner = myMiners.find(m => m.instanceId === instanceId);
    if (miner) {
        balance += miner.daily;
        miner.lastStart = 0; // Reset
        saveData();
        updateUI();
        renderMyMiners();
        showToast(`💰 +$${miner.daily.toFixed(2)} Profit Collected!`, 'success');
    }
}

// 6. IDŐZÍTŐ
function updateTimers() {
    const now = Date.now();
    myMiners.forEach(miner => {
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
                if(el.innerText !== "COMPLETED") {
                    el.innerText = "COMPLETED";
                    el.style.color = "#00e676";
                    renderMyMiners(); // Frissítés a gomb miatt
                }
            }
        }
    });
}

// --- EGYÉB FUNKCIÓK ---

function verifyPayment() {
    const txid = document.getElementById('txid').value;
    if(txid.length < 5) return tg.showAlert("Invalid TXID");

    const btn = document.querySelector('#modal-deposit .confirm-btn');
    const originalText = btn.innerText;
    btn.innerText = "Checking...";
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
    }, 2000);
}

function doTask(id) {
    if(tasksDone[id]) return;
    const btn = document.getElementById('btn-task-' + id);
    btn.innerText = "Checking...";
    
    setTimeout(() => {
        if(id===1) window.open('https://t.me/SkyTechSupport', '_blank'); 
        if(id===2) window.open('https://twitter.com', '_blank');

        setTimeout(() => {
            btn.innerText = "Done";
            btn.disabled = true;
            btn.style.background = "#333";
            balance += 0.50; // Kisebb jutalom a realitás miatt
            tasksDone[id] = true;
            saveData();
            updateUI();
            showToast("Task Complete! +$0.50 added.", 'success');
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

// UI HELPEREK
function updateUI() {
    document.getElementById('main-balance').innerText = balance.toFixed(2);
    if(document.getElementById('with-bal')) document.getElementById('with-bal').innerText = balance.toFixed(2);
    
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

function showToast(msg, type='info') {
    const container = document.getElementById('notification-container');
    if(!container) return;
    const div = document.createElement('div');
    div.className = 'notify-bubble';
    div.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    container.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}

function startFakeNotifications() {
    const users = ['User99**', 'CryptoM**', 'Anna_K**', 'LTC_Wh**', 'Hunter01'];
    const acts = ['withdrew $50', 'rented VIP 1', 'invited a friend', 'earned $2.2 profit'];
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
    }, 6000);
}

function nav(pageId, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    const page = document.getElementById('page-' + pageId);
    if(page) page.classList.add('active');
    
    // Ha a gombot átadjuk, akkor aktív lesz, ha nem, akkor megkeressük
    if(btn) {
        btn.classList.add('active');
    } else {
        // Automatikus keresés (pl redirectnél)
        if(pageId === 'home') document.querySelectorAll('.nav-item')[0].classList.add('active');
        if(pageId === 'miners') document.querySelectorAll('.nav-item')[1].classList.add('active');
    }
}

function openModal(type, amt=0) {
    if(type==='deposit' && amt > 0) {
        const inp = document.getElementById('dep-amount');
        if(inp) inp.value = amt;
    }
    document.getElementById('modal-' + type).style.display = 'flex';
}
function closeModal(type) { document.getElementById('modal-' + type).style.display = 'none'; }
function openWithdrawModal() {
    if(vipLevel === 0) tg.showAlert("⚠️ VIP 0 cannot withdraw.\nPlease invest first.");
    else openModal('withdraw');
}
function copyRef() { 
    const ref = document.getElementById('ref-link');
    if(ref) { ref.select(); document.execCommand('copy'); showToast("Invite Link Copied!"); }
}
function toggleLanguage() { showToast("Language switch coming soon!"); }