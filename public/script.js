const tg = window.Telegram.WebApp;
tg.expand(); // Teljes képernyő

// --- CONFIG ---
const MY_LTC_ADDRESS = "ltc1qv5aape3pah2f954k5jjx9kgnrnkxzytm6f7an8";

// --- ADATOK BETÖLTÉSE ---
let skyBalance = localStorage.getItem('sky') ? parseFloat(localStorage.getItem('sky')) : 5.00;
let diamonds = localStorage.getItem('diamonds') ? parseInt(localStorage.getItem('diamonds')) : 0;
let miningActive = localStorage.getItem('miningActive') === 'true';
let miningEndTime = localStorage.getItem('miningEndTime') ? parseInt(localStorage.getItem('miningEndTime')) : 0;

updateUI();

// --- KAMU ÉRTESÍTÉSEK ---
const fakeNames = ['Gábor', 'Bence', 'Anna', 'Zoli', 'Péter', 'László', 'Dávid', 'Krisztián', 'Attila'];
const fakeActions = ['kivett $25-t', 'kivett $50-t', 'vásárolt GPU-t', 'indította a bányászt', 'meghívott egy barátot', 'szintet lépett'];

setInterval(() => {
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const action = fakeActions[Math.floor(Math.random() * fakeActions.length)];
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = `${name} ${action}`;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 4000);
}, 12000);

// --- NAVIGÁCIÓ ---
function switchPage(pageId, element) {
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    element.classList.add('active');
    window.scrollTo(0,0);
}

// --- BÁNYÁSZAT ---
function startMining() {
    if(miningActive) return;
    miningActive = true;
    miningEndTime = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('miningActive', 'true');
    localStorage.setItem('miningEndTime', miningEndTime);
    updateUI();
    tg.showAlert("✅ Bányászat elindítva! Gyere vissza holnap.");
}

setInterval(() => {
    if(miningActive) {
        const now = Date.now();
        if(now > miningEndTime) {
            miningActive = false;
            localStorage.setItem('miningActive', 'false');
            skyBalance += 0.10;
            updateUI();
            tg.showAlert("💰 Napi bányászat kész! +$0.10 jóváírva.");
        } else {
            const diff = miningEndTime - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('mining-timer').innerText = `${hours}ó ${mins}p`;
        }
    } else {
        document.getElementById('mining-timer').innerText = "ÁLL";
    }
}, 1000);

// --- JÁTÉK ---
function tapDiamond() { diamonds++; updateUI(); }

function spinWheel() {
    if(diamonds >= 500) {
        diamonds -= 500;
        tg.showConfirm("Pörgetés... (Eredmény: +$0.05 SKY bónusz!)", (ok) => {
            if(ok) {
                skyBalance += 0.05;
                updateUI();
                tg.showAlert("🎉 GRATULÁLOK! Nyeremény: +$0.05 SKY!");
            }
        });
    } else {
        tg.showAlert("Nincs elég gyémántod (500 kell).");
    }
}

// --- WALLET & FIZETÉS ---
function openDeposit() { document.getElementById('deposit-modal').style.display = 'flex'; }
function closeModal() { document.getElementById('deposit-modal').style.display = 'none'; }
function openWithdraw() {
    if(skyBalance >= 20.00) tg.showAlert("Kifizetési kérelem rögzítve! (48 óra)");
    else tg.showAlert(`⚠️ Minimum kifizetés: $20.00.\nJelenleg: $${skyBalance.toFixed(2)}.`);
}

function copyAddress() {
    navigator.clipboard.writeText(MY_LTC_ADDRESS);
    tg.showAlert('Cím másolva!');
}

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
            let skyAdd = (data.amount_huf / 380); 
            skyBalance += skyAdd;
            updateUI();
            tg.showAlert(`✅ SIKERES BEFIZETÉS!\n+$${skyAdd.toFixed(2)} SKY jóváírva.\nA GPU aktiválva lett.`);
            closeModal();
            document.getElementById('txid-input').value = "";
        } else {
            tg.showAlert("Hiba: " + data.error);
        }
    } catch(e) {
            tg.MainButton.hide();
            tg.showAlert("Hálózati hiba!");
    }
}

// --- REFERRAL ---
const user = tg.initDataUnsafe.user;
if(user) document.getElementById('ref-link').innerText = `https://t.me/Offcourse77_bot?start=${user.id}`;

function copyRef() {
    const link = document.getElementById('ref-link').innerText;
    navigator.clipboard.writeText(link);
    tg.showAlert("Link másolva!");
}

// --- UI UPDATE ---
function updateUI() {
    document.getElementById('header-balance').innerText = skyBalance.toFixed(2);
    document.getElementById('wallet-bal').innerText = skyBalance.toFixed(2);
    document.getElementById('diamond-val').innerText = diamonds;
    
    const minerCircle = document.getElementById('miner-circle');
    const startBtn = document.getElementById('start-btn');
    
    if(miningActive) {
        minerCircle.classList.add('active');
        startBtn.disabled = true;
        startBtn.innerText = "BÁNYÁSZAT AKTÍV...";
    } else {
        minerCircle.classList.remove('active');
        startBtn.disabled = false;
        startBtn.innerText = "START MINING (24H)";
    }
    localStorage.setItem('sky', skyBalance);
    localStorage.setItem('diamonds', diamonds);
}