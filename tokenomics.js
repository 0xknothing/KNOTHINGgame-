// tokenomics.js
import { getActiveWallet, getPlayerData, refreshWalletUI } from './wallet.js';

const TOKEN_NAME = "0xKnothing";

// Spend tokens
export function spendTokens(amount) {
  const data = getPlayerData();
  if (data.tokens < amount) {
    alert(`Not enough ${TOKEN_NAME}.`);
    return false;
  }
  data.tokens -= amount;
  logToken(`Spent ${amount} ${TOKEN_NAME}`);
  save();
  return true;
}

// Earn tokens
export function earnTokens(amount, reason = "Reward") {
  const data = getPlayerData();
  data.tokens += amount;
  logToken(`Received ${amount} ${TOKEN_NAME} from ${reason}`);
  save();
}

// Claim bonus from logins or achievements
window.claimDailyBonus = function () {
  const bonus = Math.floor(Math.random() * 20) + 10; // 10-30 tokens
  earnTokens(bonus, "Daily Bonus");
  alert(`Claimed ${bonus} ${TOKEN_NAME} successfully!`);
};

// Future staking simulation
window.simulateStake = function () {
  const stakeAmount = 100;
  if (!spendTokens(stakeAmount)) return;
  logToken(`Staked ${stakeAmount} ${TOKEN_NAME}. Yield will be simulated.`);
};

// Log
function logToken(msg) {
  const data = getPlayerData();
  const time = new Date().toLocaleString();
  data.log.unshift(`[${time}] ${msg}`);
  updateLogUI();
}

// Update log display
function updateLogUI() {
  const data = getPlayerData();
  const logDiv = document.getElementById('explorationLog');
  if (!logDiv) return;
  logDiv.innerHTML = '';
  data.log.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.textContent = entry;
    logDiv.appendChild(div);
  });
}

// Save to localStorage
function save() {
  const fullData = JSON.parse(localStorage.getItem('playerData')) || {};
  fullData[getActiveWallet()] = getPlayerData();
  localStorage.setItem('playerData', JSON.stringify(fullData));
  refreshWalletUI();
}

// Auto add bonus button
function addTokenUI() {
  const sidebar = document.getElementById('sidebar');
  const section = document.createElement('div');
  section.className = 'section';
  section.innerHTML = `
    <label>💸 Token System:</label>
    <button onclick="claimDailyBonus()">🎁 Claim Daily Bonus</button>
    <button onclick="simulateStake()">🛡 Simulate Staking</button>
  `;
  sidebar.appendChild(section);
}

// Initialize
addTokenUI();
