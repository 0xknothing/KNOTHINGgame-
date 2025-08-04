// wallet.js
let playerData = JSON.parse(localStorage.getItem('playerData')) || {};
let activeWallet = localStorage.getItem('activeWallet') || null;

export function getActiveWallet() {
  return activeWallet;
}

export function getPlayerData() {
  return playerData[activeWallet];
}

function saveData() {
  localStorage.setItem('playerData', JSON.stringify(playerData));
  localStorage.setItem('activeWallet', activeWallet);
}

window.createNewWallet = function () {
  const name = document.getElementById('newWalletName').value.trim();
  if (!name) return alert('Please enter a name for your explorer.');
  const id = Object.keys(playerData).length + 1;
  const address = '0xWALLET' + id.toString().padStart(3, '0');
  playerData[address] = {
    name,
    tokens: 1000,
    fuel: 10,
    score: 0,
    planetsVisited: [],
    crew: [],
    ownedNFTs: [],
    log: []
  };
  activeWallet = address;
  saveData();
  renderWalletSelector();
  updateStatsUI();
  document.getElementById('newWalletName').value = '';
}

function renderWalletSelector() {
  const selector = document.getElementById('walletSelector');
  selector.innerHTML = '';
  for (const [address, info] of Object.entries(playerData)) {
    const opt = document.createElement('option');
    opt.value = address;
    opt.textContent = `${info.name} (${address})`;
    if (address === activeWallet) opt.selected = true;
    selector.appendChild(opt);
  }
  selector.onchange = () => {
    activeWallet = selector.value;
    saveData();
    updateStatsUI();
  };
}

function updateStatsUI() {
  const statsDiv = document.getElementById('playerStats');
  const data = getPlayerData();
  if (!data) {
    statsDiv.innerHTML = `<p>No active player selected.</p>`;
    return;
  }
  statsDiv.innerHTML = `
    <p>👤 <b>${data.name}</b></p>
    <p>🪙 0xKnothing: ${data.tokens}</p>
    <p>🚀 Fuel: ${data.fuel}</p>
    <p>🏆 Score: ${data.score}</p>
    <p>🌌 Planets Visited: ${data.planetsVisited.length}</p>
  `;
}

export function refreshWalletUI() {
  updateStatsUI();
}

// Initialize on page load
renderWalletSelector();
updateStatsUI();
