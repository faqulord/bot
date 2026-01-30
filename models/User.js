const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: String,
  firstName: String,
  balance: { type: Number, default: 0 },
  
  // Referral Rendszer
  referrer: { type: Number, default: null }, // Aki meghívta ezt az embert
  totalInvited: { type: Number, default: 0 }, // Hány embert hívott meg
  
  // Jutalék beállítások (Bevételmaximalizálás)
  isInfluencer: { type: Boolean, default: false }, // Ha IGAZ, nagyobb %-ot kap
  commissionRate: { type: Number, default: 0.10 }, // Alapból 10%, Influenszereknek állíthatod 20-30%-ra
  
  // Tranzakció védelem (Hogy ne lehessen 2x felhasználni ugyanazt a TXID-t)
  usedTxids: [{ type: String }],
  
  joinedAt: { type: Date, default: Date.now }
});

// Ha már létezik a modell, azt használjuk, ha nem, újat készítünk
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
