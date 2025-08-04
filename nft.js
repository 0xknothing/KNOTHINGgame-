// nft.js
import { getActiveWallet, getPlayerData, refreshWalletUI } from './wallet.js';

const nftListDiv = document.createElement('div');
nftListDiv.className = 'section';
nftListDiv.innerHTML = `<h2>🧬 Owned NFTs</h2><div id="nftInventory"></div>`;
document.getElementById('gameArea').appendChild(nftListDiv);

// Structure of NFT
function generateNFT(name = null) {
  const types = ["Engine", "Scanner", "Shield", "FuelCell", "Artifact"];
  const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
  const utilities = {
    Engine: "+1 travel/day",
    Scanner: "+10% scan success",
    Shield: "-10% battle damage",
    FuelCell: "+2 fuel capacity",
    Artifact: "Cosmetic only"
  };

  const type = name || types[Math.floor(Math.random() * types.length)];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const id = "NFT-" + Math.floor(Math.random() * 100000);
  const nft = {
    id,
    name: `${rarity} ${type}`,
    type,
    rarity,
    utility: utilities[type],
    equipped: false
  };
  return nft;
}

// Mint NFT (simulate)
export function mintNFT() {
  const data = getPlayerData();
  const nft = generateNFT();
  data.ownedNFTs.push(nft);
  logNFT(`Minted new NFT: ${nft.name} (${nft.id})`);
  save();
  renderNFTInventory();
}

// Equip NFT
window.equipNFT = function (id) {
  const data = getPlayerData();
  const found = data.ownedNFTs.find(n => n.id === id);
  if (!found) return alert("NFT not found.");
  found.equipped = !found.equipped;
  logNFT(`${found.equipped ? "Equipped" : "Unequipped"} ${found.name}`);
  save();
  renderNFTInventory();
};

// Display NFT inventory
function renderNFTInventory() {
  const data = getPlayerData();
  const div = document.getElementById('nftInventory');
  div.innerHTML = '';

  if (!data || data.ownedNFTs.length === 0) {
    div.innerHTML = '<p>No NFTs yet.</p>';
    return;
  }

  data.ownedNFTs.forEach(nft => {
    const card = document.createElement('div');
    card.style = 'background:#111;border:1px solid #333;margin:5px;padding:10px;';
    card.innerHTML = `
      <b>${nft.name}</b> (${nft.id})<br/>
      🧪 Rarity: ${nft.rarity}<br/>
      🔧 Utility: ${nft.utility}<br/>
      ${nft.equipped ? '✅ Equipped' : '<button onclick="equipNFT(\'' + nft.id + '\')">Equip</button>'}
    `;
    div.appendChild(card);
  });
}

// Log NFT action
function logNFT(msg) {
  const data = getPlayerData();
  const time = new Date().toLocaleString();
  data.log.unshift(`[${time}] ${msg}`);
  const logDiv = document.getElementById('explorationLog');
  logDiv.innerHTML = '';
  data.log.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.textContent = entry;
    logDiv.appendChild(div);
  });
}

// Save data
function save() {
  const fullData = JSON.parse(localStorage.getItem('playerData')) || {};
  fullData[getActiveWallet()] = getPlayerData();
  localStorage.setItem('playerData', JSON.stringify(fullData));
  refreshWalletUI();
}

// Load NFTs when start
renderNFTInventory();
