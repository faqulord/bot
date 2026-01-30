const tg = window.Telegram.WebApp;
tg.expand();

// CONFIG
const LTC_ADDRESS = "ltc1qv5aape3pah2f954k5jjx9kgnrnkxzytm6f7an8";

// GÉPEK (Bővített lista)
const machines = [
    { id: 1, name: "Node V1 (Starter)", price: 10, daily: 0.50, roi: 20 },
    { id: 2, name: "Node V2 (Basic)", price: 50, daily: 2.80, roi: 18 },
    { id: 3, name: "Node V3 (Pro)", price: 100, daily: 6.00, roi: 16 },
    { id: 4, name: "Cluster V4", price: 250, daily: 16.00, roi: 15 },
    { id: 5, name: "Cluster V5", price: 500, daily: 35.00, roi: 14 },
    { id: 6, name: "Farm V6", price: 800, daily: 60.00, roi: 13 },
    { id: 7, name: "Farm V7", price: 1600, daily: 130.00, roi: 12 },
    { id: 8, name: "Quantum X (Whale)", price: 2700, daily: 250.00, roi: 11 }
];

// USER STATE
let balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')) : 5.00;
let vipLevel = localStorage.getItem('vipLevel') ? parseInt(localStorage.getItem('vipLevel')) : 0; // 0 = Ingyenes, 1 = Fizetős
let username = (tg.initDataUnsafe.user && tg.initDataUnsafe.user.first_name) ? tg.initDataUnsafe.user.first_name : "Investor";
let userId = (tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.id : Math.floor(Math.random()*90000)+10000;

// INIT
document.getElementById('username').innerText = username;
document.getElementById('ref-link').value = `https://t.me/SkyTechBot?start=${userId}`;
updateUI();
renderMachines();

// RENDER MACHINES
function renderMachines() {
    let html = '';
    machines.forEach(m => {
        html += `
        <div class="invest-card">
            <div class="invest-header">
                <span class="plan-name"><i class="fas fa-server"></i> ${m.name}</span>
                <span class="plan-tag">Unlock VIP</span>
            </div>
            <div class="invest-stats">
                <div class="stat-item"><span class="stat-val">$${m.price}</span><span class="stat-label">Price</span></div>
                <div class="stat-item"><span class="stat-val" style="color:#00ff88">+$${m.daily}</span><span class="stat-label">Daily Profit</span></div>
                <div class="stat-item"><span class="stat-val">${m.roi} Days</span><span class="stat-label">Cycle</span></div>
            </div>
            <button class="invest-btn" onclick="openModal('deposit', ${m.price}, '${m.name}')">Invest Now</button>
        </div>`;
    });
    document.getElementById('machine-list').innerHTML = html;
}

// UI LOGIC
function nav(page, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    el.classList.add('active');
}

function openModal(type, amount = 0, name = '') {
    if(type === 'deposit') {
        if(amount > 0) {
            document.getElementById('dep-amount').innerText = `$${amount}.00`;
            document.getElementById('dep-plan-name').innerText = name;
        } else {
            document.getElementById('dep-amount').innerText = `Select a Plan first`;
        }
        document.getElementById('modal-deposit').style.display = 'flex';
    } else {
        // WITHDRAW MODAL NYITÁSA
        openWithdrawModal();
    }
}

// KÜLÖN FÜGGVÉNY A KIFIZETÉS ABLAKHOZ (A VIP ELLENŐRZÉS MIATT)
function openWithdrawModal() {
    document.getElementById('with-bal').innerText = balance.toFixed(2);
    const lockMsg = document.getElementById('vip-lock-msg');
    const withBtn = document.getElementById('with-btn');

    if(vipLevel === 0) {
        lockMsg.style.display = 'block';
        withBtn.disabled = true;
        withBtn.style.background = '#333';
        withBtn.style.color = '#888';
        withBtn.innerText = "Locked (VIP0)";
    } else {
        lockMsg.style.display = 'none';
        withBtn.disabled = false;
        withBtn.style.background = 'var(--primary)';
        withBtn.style.color = 'black';
        withBtn.innerText = "Withdraw Now";
    }
    document.getElementById('modal-withdraw').style.display = 'flex';
}

function closeModal(type) {
    document.getElementById('modal-' + type).style.display = 'none';
}

function copyAddr() {
    navigator.clipboard.writeText(LTC_ADDRESS);
    tg.showAlert("LTC Address Copied!");
}

function copyRef() {
    navigator.clipboard.writeText(document.getElementById('ref-link').value);
    tg.showAlert("Invite Link Copied! Share it now.");
}

// PAYMENT VERIFICATION (MOCK - Backend nélkül még mindig csak demo)
async function verifyPayment() {
    const txid = document.getElementById('txid').value;
    if(txid.length < 5) return tg.showAlert("Invalid TXID format");

    tg.MainButton.text = "Verifying on Blockchain...";
    tg.MainButton.show();

    // SZIMULÁCIÓ: 3mp múlva siker
    setTimeout(() => {
        tg.MainButton.hide();
        // --- SIKERES BEFIZETÉS SZIMULÁLÁSA ---
        let amount = parseFloat(document.getElementById('dep-amount').innerText.replace('$','')) || 10;
        
        balance += amount;
        vipLevel = 1; // ITT KAPJA MEG A VIP STÁTUSZT!
        localStorage.setItem('vipLevel', vipLevel);
        
        updateUI();
        closeModal('deposit');
        tg.showAlert(`🎉 Payment Confirmed!\n\n+$${amount} added.\nVIP Status: UNLOCKED. Withdrawals enabled.`);
        // ------------------------------------
    }, 3000);
}

function requestWithdraw() {
    // Ez a gomb le van tiltva VIP0-nál, de biztosra megyünk:
    if(vipLevel === 0) return tg.showAlert("VIP0 cannot withdraw. Please upgrade.");
    
    if(balance < 20) {
            tg.showAlert("Minimum withdrawal amount is $20.");
    } else {
            balance -= 20; // Levonjuk tesztből
            updateUI();
            closeModal('withdraw');
            tg.showAlert("✅ Withdrawal request submitted successfully!\n\nFunds will arrive within 24 hours.");
    }
}

function updateUI() {
    document.getElementById('main-balance').innerText = balance.toFixed(2);
    
    const vipDisplay = document.getElementById('vip-display');
    const withStatus = document.getElementById('withdrawal-status');

    if(vipLevel > 0) {
        vipDisplay.innerHTML = '<i class="fas fa-crown"></i> VIP 1';
        vipDisplay.classList.remove('vip-0');
        vipDisplay.classList.add('vip-1');
        withStatus.innerHTML = '<span style="color:#00ff88"><i class="fas fa-check-circle"></i> Unlocked</span>';
    } else {
        vipDisplay.innerHTML = '<i class="fas fa-lock"></i> VIP 0';
        vipDisplay.classList.remove('vip-1');
        vipDisplay.classList.add('vip-0');
        withStatus.innerHTML = '<span style="color:#ff4d4d"><i class="fas fa-lock"></i> Locked (VIP0)</span>';
    }
    
    localStorage.setItem('balance', balance);
}

// FAKE NOTIFICATIONS
const users = ['User99**', 'CryptoM**', 'Anna_K**', 'LTC_Wh**', 'Invest**'];
const actions = ['deposited $500', 'withdrew $120', 'activated Node V3', 'invited 2 friends', 'withdrew $450'];
setInterval(() => {
    const u = users[Math.floor(Math.random() * users.length)];
    const a = actions[Math.floor(Math.random() * actions.length)];
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = `${u} ${a}`;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 4000);
}, 8000);