// game.js
import { getActiveWallet, getPlayerData, refreshWalletUI } from './wallet.js';

const planets = [
  "Mercury", "Venus", "Earth", "Mars", "Jupiter",
  "Saturn", "Uranus", "Neptune", "Pluto", "Ceres"
];

let currentPlanet = null;

// Generate planets list
function renderPlanets() {
  const container = document.getElementById('planetList');
  container.innerHTML = '';
  planets.forEach(p => {
    const div = document.createElement('div');
    div.className = 'planet';
    div.textContent = p;
    div.onclick = () => {
      currentPlanet = p;
      logAction(`Traveled to planet ${p}.`);
    };
    container.appendChild(div);
  });
}

// Travel (cost fuel)
window.travel = function () {
  const data = getPlayerData();
  if (!data || !currentPlanet) return alert('Select a planet first.');
  if (data.fuel <= 0) return alert('Not enough fuel.');

  data.fuel -= 1;
  if (!data.planetsVisited.includes(currentPlanet)) {
    data.planetsVisited.push(currentPlanet);
  }
  logAction(`Arrived at ${currentPlanet}. Fuel -1.`);
  refreshWalletUI();
  save();
};

// Scan planet
window.scanPlanet = function () {
  const data = getPlayerData();
  if (!data || !currentPlanet) return alert('Select a planet first.');
  if (Math.random() < 0.5) {
    const nft = `Artifact-${Math.floor(Math.random() * 1000)}`;
    data.ownedNFTs.push(nft);
    logAction(`Scanned ${currentPlanet} and found NFT: ${nft}`);
  } else {
    logAction(`Scanned ${currentPlanet} but found nothing.`);
  }
  save();
};

// Engage in battle
window.fight = function () {
  const data = getPlayerData();
  if (!data || !currentPlanet) return alert('Select a planet first.');
  const success = Math.random() > 0.3;
  if (success) {
    const points = Math.floor(Math.random() * 50 + 10);
    data.score += points;
    logAction(`Defeated alien on ${currentPlanet}. Gained ${points} points.`);
  } else {
    logAction(`Lost battle on ${currentPlanet}. No reward.`);
  }
  refreshWalletUI();
  renderLeaderboard();
  save();
};

// Claim reward
window.claimReward = function () {
  const data = getPlayerData();
  const bonus = Math.floor(data.score / 10);
  data.tokens += bonus;
  data.score = 0;
  logAction(`Claimed ${bonus} 0xKnothing as reward.`);
  refreshWalletUI();
  renderLeaderboard();
  save();
};

// Log system
function logAction(msg) {
  const data = getPlayerData();
  const time = new Date().toLocaleString();
  data.log.unshift(`[${time}] ${msg}`);
  renderLog();
}

function renderLog() {
  const data = getPlayerData();
  const logDiv = document.getElementById('explorationLog');
  logDiv.innerHTML = '';
  if (!data || data.log.length === 0) {
    logDiv.innerHTML = '<p>No log entries yet.</p>';
    return;
  }
  data.log.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.textContent = entry;
    logDiv.appendChild(div);
  });
}

// Leaderboard
function renderLeaderboard() {
  const data = JSON.parse(localStorage.getItem('playerData')) || {};
  const sorted = Object.entries(data).sort(([, a], [, b]) => b.score - a.score);
  const board = document.getElementById('leaderboard');
  board.innerHTML = '';
  sorted.slice(0, 10).forEach(([addr, info], i) => {
    const div = document.createElement('div');
    div.textContent = `${i + 1}. ${info.name} (${addr}) - ${info.score} pts`;
    board.appendChild(div);
  });
}

// Save to localStorage
function save() {
  const fullData = JSON.parse(localStorage.getItem('playerData')) || {};
  fullData[getActiveWallet()] = getPlayerData();
  localStorage.setItem('playerData', JSON.stringify(fullData));
}

// Init
renderPlanets();
renderLeaderboard();
renderLog();
