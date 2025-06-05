// State
const state = {
  user: {
    username: "swiping.cc",
    type: "Offshore Premium",
    offshoreId: "BB-3A7X-9042",
  },
  balances: {
    main: 12345.67,
    savings: 8900.00,
    wallet: 4500.12,
    btc: 0.51,
    eth: 12.00,
  },
  prices: {
    btc: 30000,
    eth: 2000,
  },
  activity: [
    { type: "deposit", desc: "ACH Transfer from Offshore Savings", amount: 1200, date: "Today" },
    { type: "withdraw", desc: "Sent to Wallet", amount: 500, date: "Today" },
    { type: "transfer", desc: "Transfer: Main → Savings", amount: 600, date: "Yesterday" },
    { type: "buy", desc: "Bought 0.01 BTC", amount: 320, date: "Yesterday" },
    { type: "withdraw", desc: "Card Payment: Uber Eats", amount: 42.10, date: "2d ago" },
    { type: "deposit", desc: "Crypto Sold (ETH)", amount: 900, date: "3d ago" },
    { type: "transfer", desc: "Transfer: Wallet → Main", amount: 420, date: "4d ago" },
    { type: "withdraw", desc: "International Wire", amount: 1700, date: "6d ago" },
    { type: "buy", desc: "Bought 1.1 ETH", amount: 2322, date: "7d ago" },
    { type: "deposit", desc: "Salary Payment", amount: 3500.00, date: "10d ago" },
  ],
  theme: "dark"
};

function saveState() {
  localStorage.setItem("bermuda_bank_state", JSON.stringify(state));
}
function loadState() {
  try {
    const s = localStorage.getItem("bermuda_bank_state");
    if (s) Object.assign(state, JSON.parse(s));
  } catch (e) { }
}
function formatMoney(v) {
  return "$" + Number(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatCrypto(val, dec=4) {
  return parseFloat(val).toFixed(dec);
}

// Splash/Login logic
window.addEventListener("DOMContentLoaded", () => {
  loadState();
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    document.getElementById("login-screen").style.display = "flex";
  }, 1700);

  // Login logic
  const loginForm = document.getElementById("login-form");
  const errorBox = document.getElementById("login-error");
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const u = loginForm.username.value.trim();
    const p = loginForm.password.value;
    if (u === state.user.username && p === "Admin!") {
      errorBox.style.opacity = 0;
      setTimeout(() => {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("app").style.display = "flex";
        document.getElementById("site-header").style.display = "flex";
        document.getElementById("header-welcome").innerText = `Welcome, ${state.user.username}`;
        switchPage("home");
      }, 300);
    } else {
      errorBox.innerText = "Invalid credentials. Try again.";
      errorBox.style.opacity = 1;
      loginForm.password.value = "";
    }
  });

  // Bottom nav
  document.querySelectorAll("#bottom-nav button").forEach(btn => {
    btn.addEventListener("click", () => switchPage(btn.dataset.page));
  });
});

// Page switching/render
function switchPage(page) {
  document.querySelectorAll("#bottom-nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
  let html = "";
  if (page === "home") html = renderHome();
  if (page === "wallet") html = renderWallet();
  if (page === "crypto") html = renderCrypto();
  if (page === "profile") html = renderProfile();
  if (page === "settings") html = renderSettings();
  document.getElementById("main-view").innerHTML = html;
  if (page === "settings") bindThemeToggle();
  if (page === "profile") bindEditReveal();
  if (page === "wallet") bindWalletActions();
  if (page === "crypto") bindCryptoActions();
}

// Home/dashboard
function renderHome() {
  const totalCryptoUSD = state.balances.btc * state.prices.btc + state.balances.eth * state.prices.eth;
  return `
    <div style="height:1.8rem"></div>
    <div class="dashboard-row">
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-vault"></i> Main Balance</div>
        <div class="card-balance">${formatMoney(state.balances.main)}</div>
        <div class="card-desc">Your primary Bermuda account</div>
      </div>
      <div class="card">
        <div class="card-title"><i class="fa-solid fa-piggy-bank"></i> Savings</div>
        <div class="card-balance">${formatMoney(state.balances.savings)}</div>
        <div class="card-desc">Offshore savings</div>
      </div>
    </div>
    <div class="dashboard-row">
      <div class="card">
        <div class="card-title"><i class="fa-brands fa-bitcoin"></i> Crypto Holdings</div>
        <div class="card-balance">
          <span>${formatCrypto(state.balances.btc)} BTC</span>
          <span style="font-size:1.1rem;opacity:0.6;margin-left:1.1em;">${formatCrypto(state.balances.eth)} ETH</span>
        </div>
        <div class="card-desc">~${formatMoney(totalCryptoUSD)} USD</div>
      </div>
    </div>
    <div class="card" style="margin-top:1.2rem;">
      <div class="card-title"><i class="fa-solid fa-clock-rotate-left"></i> Recent Activity</div>
      <ul class="activity-list">
        ${state.activity.slice(0,8).map(tx => `
          <li>
            <span>${tx.desc}<br><small style="color:#4fe0fc;">${tx.date}</small></span>
            <span class="amount ${tx.type}">${tx.type==="deposit"||tx.type==="buy"?"+":"-"}${formatMoney(tx.amount)}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

// Wallet page
function renderWallet() {
  return `
    <div class="card wallet-card" style="margin-top:1.4rem;">
      <div class="card-title"><i class="fa-solid fa-wallet"></i> Wallet Balance</div>
      <div class="card-balance">${formatMoney(state.balances.wallet)}</div>
      <div class="wallet-actions">
        <button id="deposit-btn"><i class="fa-solid fa-arrow-down"></i> Deposit</button>
        <button id="withdraw-btn"><i class="fa-solid fa-arrow-up"></i> Withdraw</button>
        <button class="transfer-btn" id="transfer-btn"><i class="fa-solid fa-right-left"></i> Transfer</button>
      </div>
    </div>
    <div class="card" style="margin-top:1.2rem;">
      <div class="card-title"><i class="fa-solid fa-clock-rotate-left"></i> Wallet Activity</div>
      <ul class="activity-list">
        ${state.activity.filter(tx => /wallet|transfer/i.test(tx.desc))
          .slice(0,6).map(tx => `
            <li>
              <span>${tx.desc}<br><small style="color:#4fe0fc;">${tx.date}</small></span>
              <span class="amount ${tx.type}">${tx.type==="deposit"?"+":"-"}${formatMoney(tx.amount)}</span>
            </li>
          `).join("") ||
            `<li style="color:#768eb8;text-align:center;">No recent wallet-specific activity.</li>`
        }
      </ul>
    </div>
  `;
}

// Wallet actions (modern modal)
function bindWalletActions() {
  // Deposit
  document.getElementById("deposit-btn").onclick = () =>
    showBankModal("Deposit to Wallet", ["Offshore Savings", "Main Account", "External Bank"], (src, amt) => {
      if (amt <= 0 || isNaN(amt)) return showToast("Enter a valid amount.");
      state.balances.wallet += amt;
      state.activity.unshift({
        type: "deposit",
        desc: `Wallet Deposit from ${src}`,
        amount: amt,
        date: "Now"
      });
      saveState();
      switchPage("wallet");
      showToast(`Deposited ${formatMoney(amt)} to wallet!`);
    });

  // Withdraw
  document.getElementById("withdraw-btn").onclick = () =>
    showBankModal("Withdraw from Wallet", ["Main Account", "Offshore Savings", "External Bank"], (dest, amt) => {
      if (amt <= 0 || isNaN(amt)) return showToast("Enter a valid amount.");
      if (amt > state.balances.wallet) return showToast("Insufficient funds.");
      state.balances.wallet -= amt;
      state.activity.unshift({
        type: "withdraw",
        desc: `Wallet Withdraw to ${dest}`,
        amount: amt,
        date: "Now"
      });
      saveState();
      switchPage("wallet");
      showToast(`Withdrew ${formatMoney(amt)} from wallet.`);
    });

  // Transfer
  document.getElementById("transfer-btn").onclick = () =>
    showTransferModal();
}

// Modern modal for deposit/withdraw
function showBankModal(title, accounts, cb) {
  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("modal-backdrop");
  modal.innerHTML = `
    <div class="modal-title">${title}</div>
    <div class="modal-accounts">
      <label>Select ${/Deposit/.test(title) ? "Source" : "Destination"} Account</label>
      <div class="styled-select">
        <select id="modal-account">
          ${accounts.map(a => `<option value="${a}">${a}</option>`).join("")}
        </select>
      </div>
    </div>
    <label>Amount</label>
    <input type="number" min="0" step="0.01" id="modal-amt" placeholder="Enter amount">
    <div class="modal-actions">
      <button id="modal-ok">OK</button>
      <button id="modal-cancel" style="background:#202950;">Cancel</button>
    </div>
  `;
  backdrop.style.display = "block";
  modal.style.display = "flex";
  setTimeout(() => document.getElementById("modal-amt").focus(), 100);

  document.getElementById("modal-ok").onclick = () => {
    const acc = document.getElementById("modal-account").value;
    const amt = parseFloat(document.getElementById("modal-amt").value);
    closeModal();
    cb(acc, amt);
  };
  document.getElementById("modal-cancel").onclick = closeModal;
  backdrop.onclick = closeModal;
}

// Transfer modal
function showTransferModal() {
  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("modal-backdrop");
  const accounts = ["Main Account", "Wallet", "Offshore Savings"];
  modal.innerHTML = `
    <div class="modal-title">Transfer Between Accounts</div>
    <div class="modal-accounts">
      <label>From</label>
      <div class="styled-select">
        <select id="modal-from">${accounts.map(a => `<option value="${a}">${a}</option>`).join("")}</select>
      </div>
      <label>To</label>
      <div class="styled-select">
        <select id="modal-to">${accounts.map(a => `<option value="${a}">${a}</option>`).join("")}</select>
      </div>
    </div>
    <label>Amount</label>
    <input type="number" min="0" step="0.01" id="modal-amt" placeholder="Enter amount">
    <div class="modal-actions">
      <button id="modal-ok">Transfer</button>
      <button id="modal-cancel" style="background:#202950;">Cancel</button>
    </div>
  `;
  backdrop.style.display = "block";
  modal.style.display = "flex";
  setTimeout(() => document.getElementById("modal-amt").focus(), 100);

  document.getElementById("modal-ok").onclick = () => {
    const from = document.getElementById("modal-from").value;
    const to = document.getElementById("modal-to").value;
    const amt = parseFloat(document.getElementById("modal-amt").value);
    closeModal();
    if (from === to) return showToast("Select different accounts.");
    if (amt <= 0 || isNaN(amt)) return showToast("Enter a valid amount.");
    let fromKey = keyFromName(from), toKey = keyFromName(to);
    if (state.balances[fromKey] < amt) return showToast("Insufficient funds.");
    state.balances[fromKey] -= amt;
    state.balances[toKey] += amt;
    state.activity.unshift({
      type: "transfer",
      desc: `Transfer: ${from} → ${to}`,
      amount: amt,
      date: "Now"
    });
    saveState();
    switchPage("wallet");
    showToast(`Transferred ${formatMoney(amt)} ${from}→${to}`);
  };
  document.getElementById("modal-cancel").onclick = closeModal;
  backdrop.onclick = closeModal;
}
function keyFromName(n) {
  n = n.toLowerCase();
  if (n.includes("main")) return "main";
  if (n.includes("wallet")) return "wallet";
  if (n.includes("savings")) return "savings";
  return "wallet";
}

// ==== Crypto Section ====
function renderCrypto() {
  return `
    <div class="card" style="margin-top:1.4rem;">
      <div class="card-title"><i class="fa-brands fa-bitcoin"></i> Offshore Crypto</div>
      <div style="margin-bottom:0.9em;">
        <div style="font-size:1.15em;color:#e5bb47;">
          ${formatCrypto(state.balances.btc, 5)} BTC <span style="opacity:0.7;">(${formatMoney(state.balances.btc*state.prices.btc)})</span>
        </div>
        <div style="margin-top:0.6em;font-size:1.12em;color:#68ccf4;">
          ${formatCrypto(state.balances.eth, 4)} ETH <span style="opacity:0.7;">(${formatMoney(state.balances.eth*state.prices.eth)})</span>
        </div>
      </div>
      <div class="wallet-actions">
        <button id="buy-crypto-btn"><i class="fa-solid fa-arrow-down"></i> Buy</button>
        <button id="sell-crypto-btn"><i class="fa-solid fa-arrow-up"></i> Sell</button>
      </div>
    </div>
    <div class="crypto-conversion-box">
      <div>
        <div class="conv-label">BTC/USD</div>
        <div class="conv-val">${formatMoney(state.prices.btc)}</div>
        <span class="crypto-sparkline">${getSparkSVG('btc')}</span>
      </div>
      <div>
        <div class="conv-label">ETH/USD</div>
        <div class="conv-val">${formatMoney(state.prices.eth)}</div>
        <span class="crypto-sparkline">${getSparkSVG('eth')}</span>
      </div>
    </div>
  `;
}
function bindCryptoActions() {
  document.getElementById("buy-crypto-btn").onclick = () =>
    showCryptoModal("Buy");
  document.getElementById("sell-crypto-btn").onclick = () =>
    showCryptoModal("Sell");
}
function showCryptoModal(type) {
  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("modal-backdrop");
  modal.innerHTML = `
    <div class="modal-title">${type === "Buy" ? "Buy Crypto" : "Sell Crypto"}</div>
    <label>Currency</label>
    <div class="styled-select">
      <select id="modal-currency">
        <option value="btc">BTC</option>
        <option value="eth">ETH</option>
      </select>
    </div>
    <label>Amount (${type === "Buy" ? "USD" : "Crypto Units"})</label>
    <input type="number" min="0" step="0.0001" id="modal-amt" placeholder="Enter amount">
    <div id="crypto-live"></div>
    <div class="modal-actions">
      <button id="modal-ok">OK</button>
      <button id="modal-cancel" style="background:#202950;">Cancel</button>
    </div>
  `;
  backdrop.style.display = "block";
  modal.style.display = "flex";
  setTimeout(() => document.getElementById("modal-amt").focus(), 100);

  function updateLive() {
    const cur = document.getElementById("modal-currency").value;
    let amt = parseFloat(document.getElementById("modal-amt").value);
    if (type === "Buy") {
      if (amt > 0)
        document.getElementById("crypto-live").innerHTML = `<small>Est. ${formatCrypto(amt/state.prices[cur],5)} ${cur.toUpperCase()}</small>`;
      else
        document.getElementById("crypto-live").innerHTML = "";
    } else {
      if (amt > 0)
        document.getElementById("crypto-live").innerHTML = `<small>Est. ${formatMoney(amt*state.prices[cur])} USD</small>`;
      else
        document.getElementById("crypto-live").innerHTML = "";
    }
  }
  document.getElementById("modal-currency").onchange = updateLive;
  document.getElementById("modal-amt").oninput = updateLive;

  document.getElementById("modal-ok").onclick = () => {
    const cur = document.getElementById("modal-currency").value;
    let amt = parseFloat(document.getElementById("modal-amt").value);
    if (type === "Buy") {
      if (amt <= 0 || isNaN(amt)) return showToast("Enter a valid USD amount.");
      let units = amt / state.prices[cur];
      state.balances[cur] += units;
      state.activity.unshift({
        type: "buy",
        desc: `Bought ${formatCrypto(units)} ${cur.toUpperCase()}`,
        amount: amt,
        date: "Now"
      });
      saveState();
      switchPage("crypto");
      showToast(`Bought ${formatCrypto(units)} ${cur.toUpperCase()}`);
    } else {
      if (amt <= 0 || isNaN(amt)) return showToast("Enter a valid amount.");
      if (amt > state.balances[cur]) return showToast("Insufficient balance.");
      let usd = amt * state.prices[cur];
      state.balances[cur] -= amt;
      state.activity.unshift({
        type: "sell",
        desc: `Sold ${formatCrypto(amt)} ${cur.toUpperCase()}`,
        amount: usd,
        date: "Now"
      });
      saveState();
      switchPage("crypto");
      showToast(`Sold ${formatCrypto(amt)} ${cur.toUpperCase()}`);
    }
    closeModal();
  };
  document.getElementById("modal-cancel").onclick = closeModal;
  backdrop.onclick = closeModal;
}

// Sparkline SVG for Crypto section
function getSparkSVG(cur) {
  const btc = [29900, 30050, 30000, 30120, 30090, 29940, 30020, 29980, 30030];
  const eth = [2015, 2010, 2025, 2000, 2005, 1995, 2000, 2010, 2000];
  const vals = cur==="btc"?btc:eth;
  const max = Math.max(...vals), min = Math.min(...vals);
  const points = vals.map((v,i) =>
    `${i*8},${32-( (v-min)/(max-min+0.01)*24 + 4 )}`
  ).join(' ');
  return `<svg width="64" height="32"><polyline fill="none" stroke="${cur==='btc'?'#ffe24d':'#54d5ff'}" stroke-width="2.5" points="${points}"/></svg>`;
}

// ==== Profile ====
function renderProfile() {
  return `
    <div class="card" style="margin-top:1.5rem;">
      <div class="card-title"><i class="fa-solid fa-user"></i> Profile</div>
      <ul class="profile-list">
        <li class="username" title="Long press to unlock edit">
          Username <span>${state.user.username} <i class="fa-solid fa-lock"></i></span>
        </li>
        <li>Account Type <span>${state.user.type}</span></li>
        <li>Offshore ID <span>${state.user.offshoreId}</span></li>
        <li>Wallet <span>${formatMoney(state.balances.wallet)}</span></li>
        <li>Crypto <span>${formatCrypto(state.balances.btc)} BTC, ${formatCrypto(state.balances.eth)} ETH</span></li>
        <li>Savings <span>${formatMoney(state.balances.savings)}</span></li>
      </ul>
      <button class="edit-wallet-btn"><i class="fa-solid fa-pen"></i> Edit Balances</button>
    </div>
  `;
}
// Long-press to reveal edit
function bindEditReveal() {
  const row = document.querySelector('.profile-list li.username');
  const btn = document.querySelector('.edit-wallet-btn');
  let timer = null;
  row.addEventListener("mousedown", () => {
    timer = setTimeout(() => {
      row.classList.add("revealed");
      btn.style.display = "inline-block";
    }, 800);
  });
  ["mouseup", "mouseleave"].forEach(evt =>
    row.addEventListener(evt, () => clearTimeout(timer)));
  btn.onclick = () => showEditWalletModal();
}
function showEditWalletModal() {
  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("modal-backdrop");
  modal.innerHTML = `
    <div class="modal-title">Edit Balances</div>
    <label>Wallet</label>
    <input type="number" min="0" step="0.01" id="edit-wallet" value="${state.balances.wallet}">
    <label>BTC</label>
    <input type="number" min="0" step="0.0001" id="edit-btc" value="${state.balances.btc}">
    <label>ETH</label>
    <input type="number" min="0" step="0.0001" id="edit-eth" value="${state.balances.eth}">
    <label>Savings</label>
    <input type="number" min="0" step="0.01" id="edit-savings" value="${state.balances.savings}">
    <div class="modal-actions">
      <button id="modal-ok">Save</button>
      <button id="modal-cancel" style="background:#202950;">Cancel</button>
    </div>
  `;
  backdrop.style.display = "block";
  modal.style.display = "flex";
  setTimeout(() => document.getElementById("edit-wallet").focus(), 150);

  document.getElementById("modal-ok").onclick = () => {
    state.balances.wallet = parseFloat(document.getElementById("edit-wallet").value) || 0;
    state.balances.btc = parseFloat(document.getElementById("edit-btc").value) || 0;
    state.balances.eth = parseFloat(document.getElementById("edit-eth").value) || 0;
    state.balances.savings = parseFloat(document.getElementById("edit-savings").value) || 0;
    saveState();
    closeModal();
    switchPage("profile");
    showToast("Balances updated.");
  };
  document.getElementById("modal-cancel").onclick = closeModal;
  backdrop.onclick = closeModal;
}

// ==== Settings ====
function renderSettings() {
  return `
    <div class="card" style="margin-top:1.7rem;">
      <div class="card-title"><i class="fa-solid fa-gear"></i> Settings</div>
      <ul class="settings-list">
        <li>
          Theme
          <span>
            <label class="switch">
              <input id="theme-toggle" type="checkbox" ${state.theme === "dark" ? "" : "checked"}>
              <span class="slider"></span>
            </label>
          </span>
        </li>
        <li>Security Settings <span><i class="fa-solid fa-lock"></i></span></li>
        <li>Connected Devices <span><i class="fa-solid fa-laptop"></i></span></li>
        <li>Offshore Zone <span>Atlantic</span></li>
      </ul>
    </div>
  `;
}
function bindThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  toggle.onchange = function() {
    if (this.checked) {
      document.body.style.background = "#f3f7fa";
      document.body.classList.add("light");
      state.theme = "light";
    } else {
      document.body.style.background = "var(--primary-gradient)";
      document.body.classList.remove("light");
      state.theme = "dark";
    }
    saveState();
  }
  // Apply theme on load
  if (state.theme === "light") {
    document.body.style.background = "#f3f7fa";
    document.body.classList.add("light");
  } else {
    document.body.style.background = "var(--primary-gradient)";
    document.body.classList.remove("light");
  }
}

// Modals and Toasts
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-backdrop").style.display = "none";
}
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}