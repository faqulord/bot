const tg = window.Telegram.WebApp;
tg.expand();

// CONFIG
const LTC_ADDRESS = "ltc1qv5aape3pah2f954k5jjx9kgnrnkxzytm6f7an8";

// NYELVEK
let currentLang = 'en';
const translations = {
    en: {
        total_assets: "Total Assets (USDT)", deposit: "Deposit", withdraw: "Withdraw",
        shop_title: "Investment Hall", my_miners: "My Active Miners", no_miners: "No active miners yet.",
        buy_now: "Buy Machine Now", task_center: "Task Center", task_tg: "Join Channel", task_x: "Follow on X",
        team_size: "Team Size", team_comm: "Commission", invite_link: "Your Invite Link", agent_salary: "Agent Salary",
        day: "Day", menu_withdraw: "Withdrawal", menu_history: "History", menu_support: "Support",
        nav_home: "Home", nav_miners: "Miners", nav_task: "Tasks", nav_team: "Team", nav_me: "Me",
        guide_title: "How to Earn?", guide_1: "1. Register & Get $5 Bonus + Do Tasks ($4).",
        guide_2: "2. Deposit to buy VIP1 Machine ($15).", guide_3: "3. Collect daily profit & Invite friends.",
        paid_btn: "I Have Paid"
    },
    hu: {
        total_assets: "Teljes Vagyon (USDT)", deposit: "Befizetés", withdraw: "Kifizetés",
        shop_title: "Befektetések", my_miners: "Aktív Gépeim", no_miners: "Nincs aktív gép.",
        buy_now: "Vásárlás Most", task_center: "Küldetések", task_tg: "Csatorna Csatlakozás", task_x: "X Követés",
        team_size: "Csapat Méret", team_comm: "Jutalék", invite_link: "Meghívó Linked", agent_salary: "Ügynök Fizetés",
        day: "Nap", menu_withdraw: "Kifizetés", menu_history: "Előzmények", menu_support: "Ügyfélszolgálat",
        nav_home: "Főoldal", nav_miners: "Gépek", nav_task: "Feladat", nav_team: "Csapat", nav_me: "Profil",
        guide_title: "Hogy keress pénzt?", guide_1: "1. $5 Bónusz + $4 Feladatokból.",
        guide_2: "2. Fizess be és vedd meg a VIP 1 Gépet ($15).", guide_3: "3. Vedd fel a profitot és hívj barátokat.",
        paid_btn: "Elutaltam"
    },
    de: {
        total_assets: "Gesamtvermögen", deposit: "Einzahlen", withdraw: "Abheben",
        shop_title: "Investitionshalle", my_miners: "Meine Miner", no_miners: "Keine aktiven Miner.",
        buy_now: "Jetzt Kaufen", task_center: "Aufgaben", task_tg: "Kanal Beitreten", task_x: "X Folgen",
        team_size: "Teamgröße", team_comm: "Provision", invite_link: "Einladungslink", agent_salary: "Agentengehalt",
        day: "Tag", menu_withdraw: "Abheben", menu_history: "Verlauf", menu_support: "Support",
        nav_home: "Start", nav_miners: "Miner", nav_task: "Tasks", nav_team: "Team", nav_me: "Ich",
        guide_title: "Wie verdienen?", guide_1: "1. $5 Bonus + $4 durch Aufgaben.",
        guide_2: "2. Kaufe VIP 1 Maschine ($15).", guide_3: "3. Täglich Profit sammeln.",
        paid_btn: "Ich habe bezahlt"
    }
};

// GÉPEK ADATAI
const machines = [
    { id: 1, name: "VIP 1 - Node V1", price: 15, daily: 1.20, roi: 15 },
    { id: 2, name: "VIP 2 - Node V2", price: 50, daily: 4.00, roi: 14 },
    { id: 3, name: "VIP 3 - Cluster", price: 100, daily: 9.00, roi: 12 },
    { id: 4, name: "VIP 4 - Farm X", price: 300, daily: 30.00, roi: 10 }
];

// STATE
let balance = parseFloat(localStorage.getItem('balance')) || 5.00;
let vipLevel = parseInt(localStorage.getItem('vipLevel')) || 0;
let myMiners = JSON.parse(localStorage.getItem('myMiners')) || [];
let tasksDone = JSON.parse(localStorage.getItem('tasksDone')) || {1:false, 2:false};

// INIT
updateUI();
renderMachines();
renderMyMiners();
checkTasks();

// NYELV VÁLTÁS
function toggleLanguage() {
    if(currentLang === 'en') currentLang = 'hu';
    else if(currentLang === 'hu') currentLang = 'de';
    else currentLang = 'en';
    
    document.getElementById('current-lang').innerText = currentLang.toUpperCase();
    applyLanguage();
}

function applyLanguage() {
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if(translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });
}

// GÉP VÁSÁRLÁS LOGIKA
function renderMachines() {
    let html = '';
    machines.forEach(m => {
        html += `
        <div class="invest-card">
            <div class="invest-header">
                <span class="plan-name">${m.name}</span>
                <span class="plan-tag">Daily $${m.daily}</span>
            </div>
            <div class="invest-stats">
                <div class="stat-item"><span class="stat-val">$${m.price}</span><span class="stat-label">Price</span></div>
                <div class="stat-item"><span class="stat-val">${m.roi} Days</span><span class="stat-label">Cycle</span></div>
            </div>
            <button class="invest-btn" onclick="openModal('deposit', ${m.price}, '${m.name}')">Buy Now</button>
        </div>`;
    });
    document.getElementById('machine-list').innerHTML = html;
}

// BEFIZETÉS ELLENŐRZÉS (A LÉNYEG)
async function verifyPayment() {
    const txid = document.getElementById('txid').value;
    if(txid.length < 5) return tg.showAlert("Invalid TXID");
    
    tg.MainButton.text = "Checking Blockchain...";
    tg.MainButton.show();
    
    // MOCK ELLENŐRZÉS
    setTimeout(() => {
        tg.MainButton.hide();
        let amount = parseFloat(document.getElementById('dep-amount').innerText.replace('$','')) || 10;
        let planName = document.getElementById('dep-plan-name').innerText;
        
        // Pénz jóváírása
        balance += amount;
        
        // Ha gépvásárlás volt, levonjuk és hozzáadjuk a géphez
        if(planName !== '-' && balance >= amount) {
             balance -= amount;
             const machine = machines.find(m => m.name === planName);
             
             // Gép hozzáadása (Stacking)
             myMiners.push({
                 id: Date.now(),
                 name: machine.name,
                 daily: machine.daily,
                 nextClaim: Date.now() + (24*60*60*1000) // 24 óra múlva
             });
             localStorage.setItem('myMiners', JSON.stringify(myMiners));
             
             // VIP Upgrade
             if(vipLevel === 0) vipLevel = 1;
             localStorage.setItem('vipLevel', vipLevel);
             
             renderMyMiners();
             tg.showAlert(`✅ Success! ${machine.name} activated.`);
        } else {
             tg.showAlert("Balance updated. Please buy the machine manually.");
        }
        
        updateUI();
        closeModal('deposit');
    }, 2500);
}

// SAJÁT GÉPEK RENDERELÉSE
function renderMyMiners() {
    const list = document.getElementById('my-miners-list');
    if(myMiners.length === 0) {
        list.innerHTML = `<div class="empty-state"><i class="fas fa-server"></i><p>No active miners.</p></div>`;
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
    // Profit jóváírás
    balance += profit;
    // Újraindítás 24 órára
    const index = myMiners.findIndex(m => m.id === id);
    if(index !== -1) {
        myMiners[index].nextClaim = Date.now() + (24*60*60*1000);
        localStorage.setItem('myMiners', JSON.stringify(myMiners));
    }
    updateUI();
    renderMyMiners();
    tg.showAlert(`💰 +$${profit} Collected!`);
}

// TASK LOGIKA
function doTask(id) {
    if(tasksDone[id]) return;
    
    const btn = document.getElementById('btn-task-' + id);
    btn.innerText = "Checking...";
    
    setTimeout(() => {
        btn.innerText = "Done";
        btn.disabled = true;
        btn.style.background = "#333";
        
        balance += 2.00;
        tasksDone[id] = true;
        localStorage.setItem('tasksDone', JSON.stringify(tasksDone));
        
        updateUI();
        tg.showAlert("Task Complete! +$2.00");
    }, 2000);
}

function checkTasks() {
    if(tasksDone[1]) {
        let btn = document.getElementById('btn-task-1');
        btn.innerText = "Done"; btn.disabled = true; btn.style.background = "#333";
    }
    if(tasksDone[2]) {
        let btn = document.getElementById('btn-task-2');
        btn.innerText = "Done"; btn.disabled = true; btn.style.background = "#333";
    }
}

// UI UPDATE
function updateUI() {
    document.getElementById('main-balance').innerText = balance.toFixed(2);
    document.getElementById('with-bal').innerText = balance.toFixed(2);
    
    const vipTag = document.getElementById('vip-display');
    const lockMsg = document.getElementById('vip-lock-msg');
    
    if(vipLevel > 0) {
        vipTag.innerText = "VIP " + vipLevel;
        vipTag.classList.add('active');
        lockMsg.style.display = 'none';
    } else {
        vipTag.innerText = "VIP 0";
        vipTag.classList.remove('active');
        lockMsg.style.display = 'block';
    }
    
    localStorage.setItem('balance', balance);
}

// HELPER FUNKCIÓK
function nav(page, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    el.classList.add('active');
}
function openModal(type, amt=0, name='') {
    if(type==='deposit') {
        document.getElementById('dep-plan-name').innerText = name || "Balance Topup";
        document.getElementById('dep-amount').innerText = amt > 0 ? `$${amt}.00` : "$0.00";
    }
    document.getElementById('modal-' + type).style.display = 'flex';
}
function closeModal(type) { document.getElementById('modal-' + type).style.display = 'none'; }
function openWithdrawModal() {
    if(vipLevel === 0) tg.showAlert("⚠️ VIP 0 accounts cannot withdraw.\nPlease buy a machine first.");
    else openModal('withdraw');
}
function copyAddr() { navigator.clipboard.writeText(LTC_ADDRESS); tg.showAlert("Address Copied!"); }
function copyRef() { 
    const ref = `https://t.me/SkyTechBot?start=${tg.initDataUnsafe?.user?.id || '888'}`;
    navigator.clipboard.writeText(ref); 
    tg.showAlert("Link Copied!"); 
}

// FAKE NOTIFICATIONS
const users = ['User99**', 'CryptoM**', 'Anna_K**', 'LTC_Wh**'];
const acts = ['withdrew $120', 'bought VIP 1', 'invited 2 friends'];
setInterval(() => {
    document.getElementById('toast-msg').innerText = `${users[Math.floor(Math.random()*4)]} ${acts[Math.floor(Math.random()*3)]}`;
    document.getElementById('toast').classList.add('show');
    setTimeout(() => document.getElementById('toast').classList.remove('show'), 4000);
}, 10000);