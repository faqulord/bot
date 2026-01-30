const tg = window.Telegram.WebApp;
tg.expand();

const MY_LTC_ADDRESS = "ltc1qv5aape3pah2f954k5jjx9kgnrnkxzytm6f7an8";

// ADATOK
let skyBalance = localStorage.getItem('sky') ? parseFloat(localStorage.getItem('sky')) : 5.000000;
let diamonds = localStorage.getItem('diamonds') ? parseInt(localStorage.getItem('diamonds')) : 0;
let miningActive = localStorage.getItem('miningActive') === 'true';
let miningEndTime = localStorage.getItem('miningEndTime') ? parseInt(localStorage.getItem('miningEndTime')) : 0;

updateUI();
loadLeaderboard();

// --- LIVE MINING (LÜKTETÉS & SZÁMOLÁS) ---
setInterval(() => {
    if(miningActive) {
        const now = Date.now();
        if(now > miningEndTime) {
            // LEJÁRT
            miningActive = false;
            localStorage.setItem('miningActive', 'false');
            updateUI();
            tg.showAlert("💰 Bányászat kész! Indítsd újra!");
        } else {
            // FUT: Növeljük a balanszot élőben
            // Napi 0.10 -> Másodpercenként 0.00000115
            let profitPerSec = 0.10 / 86400;
            skyBalance += profitPerSec;
            
            // Frissítjük a kijelzőt (csak a live countert, hogy ne villogjon minden)
            document.getElementById('live-counter').innerText = skyBalance.toFixed(6);
            document.getElementById('header-balance').innerText = skyBalance.toFixed(4);
            document.getElementById('wallet-bal').innerText = skyBalance.toFixed(4);
            
            const diff = miningEndTime - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('mining-timer').innerText = `${hours}ó ${mins}p`;
        }
    } else {
        document.getElementById('mining-timer').innerText = "ÁLL";
    }
}, 1000);

// --- KERÉK PÖRGETÉS ---
function spinWheel() {
    if(diamonds < 500) return tg.showAlert("Nincs elég gyémántod (500 kell)!");
    
    diamonds -= 500;
    updateUI();

    const wheel = document.getElementById('wheel');
    // Random forgás 3-6 teljes kör + random szelet
    const deg = 1080 + Math.floor(Math.random() * 360); 
    wheel.style.transform = `rotate(${deg}deg)`;

    // 4 másodperc múlva eredmény
    setTimeout(() => {
        const result = Math.random();
        let winText = "";
        let winAmount = 0;

        // Kamu nyerési esélyek
        if(result < 0.5) { winText = "$0.01"; winAmount = 0.01; }
        else if(result < 0.8) { winText = "$0.05"; winAmount = 0.05; }
        else { winText = "Semmi :("; winAmount = 0; }

        if(winAmount > 0) {
            skyBalance += winAmount;
            tg.showAlert(`🎉 NYEREMÉNY: ${winText} SKY!`);
        } else {
            tg.showAlert("Sajnos most nem nyertél.");
        }
        
        // Reset wheel kicsit trükkösen, hogy ne pörögjön vissza
        wheel.style.transition = "none";
        wheel.style.transform = `rotate(${deg % 360}deg)`;
        setTimeout(() => { wheel.style.transition = "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"; }, 50);

        updateUI();
    }, 4000);
}

// --- RANGLISTA GENERÁLÁS (KAMU) ---
function loadLeaderboard() {
    const names = ["CryptoKing", "LTC_Master", "ElonFan", "HodlGang", "MoonBoy", "Satoshi_H", "BányászJozsi", "RichKid", "TraderPro", "WhaleAlert"];
    let html = "";
    // Top 5 generálása
    for(let i=0; i<5; i++) {
        let money = (5000 - (i*800)) + Math.floor(Math.random()*100);
        html += `<div class="leader-row"><span>${i+1}. 🏅 ${names[i]}</span><span style="color:#10b981; font-weight:bold;">$${money}</span></div>`;
    }
    document.getElementById('leaderboard-list').innerHTML = html;
    
    // Saját rangod frissítése
    document.getElementById('my-rank-bal').innerText = "$" + skyBalance.toFixed(2);
}

// --- EGYÉB FÜGGVÉNYEK (RÉGIEK) ---
const fakeNames = ['Gábor', 'Bence', 'Anna', 'Zoli', 'Péter'];
const fakeActions = ['kivett $25-t', 'kivett $50-t', 'vásárolt GPU-t'];
setInterval(() => {
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const action = fakeActions[Math.floor(Math.random() * fakeActions.length)];
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = `${name} ${action}`;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 4000);
}, 15000);

function switchPage(pageId, element) {
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    element.classList.add('active');
}

function startMining() {
    if(miningActive) return;
    miningActive = true;
    miningEndTime = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('miningActive', 'true');
    localStorage.setItem('miningEndTime', miningEndTime);
    updateUI();
    tg.showAlert("✅ Robot elindítva! Élő termelés bekapcsolva.");
}

function tapDiamond() { diamonds++; updateUI(); }

function openDeposit() { document.getElementById('deposit-modal').style.display = 'flex'; }
function closeModal() { document.getElementById('deposit-modal').style.display = 'none'; }
function openWithdraw() {
    if(skyBalance >= 20.00) tg.showAlert("Kifizetési kérelem rögzítve! (48 óra)");
    else tg.showAlert(`⚠️ Minimum kifizetés: $20.00.\nJelenleg: $${skyBalance.toFixed(2)}.`);
}

function copyAddress() { navigator.clipboard.writeText(MY_LTC_ADDRESS); tg.showAlert('Cím másolva!'); }

async function checkPayment() {
    const txid = document.getElementById('txid-input').value.trim();
    if(txid.length < 5) return tg.showAlert("Hibás TXID");
    tg.MainButton.text = "ELLENŐRZÉS..."; tg.MainButton.show();
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
            tg.showAlert(`✅ SIKER! +$${skyAdd.toFixed(2)} SKY jóváírva.`);
            closeModal();
            document.getElementById('txid-input').value = "";
        } else { tg.showAlert("Hiba: " + data.error); }
    } catch(e) { tg.MainButton.hide(); tg.showAlert("Hálózati hiba!"); }
}

const user = tg.initDataUnsafe.user;
function copyRef() {
    const link = user ? `https://t.me/Offcourse77_bot?start=${user.id}` : "https://t.me/Offcourse77_bot";
    navigator.clipboard.writeText(link);
    tg.showAlert("Link másolva!");
}

function updateUI() {
    document.getElementById('header-balance').innerText = skyBalance.toFixed(4);
    document.getElementById('wallet-bal').innerText = skyBalance.toFixed(4);
    document.getElementById('live-counter').innerText = skyBalance.toFixed(6);
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