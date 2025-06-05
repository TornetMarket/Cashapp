// ========= App State ========= //
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
    { type: "deposit", desc: "Salary Payment", amount: 3500.00, date: "Today" },
    { type: "withdraw", desc: "Sent to Offshore Wallet", amount: 800.00, date: "Yesterday" },
    { type: "deposit", desc: "Crypto Sold", amount: 720.00, date: "3d ago" },
    { type: "withdraw", desc: "Online Purchase", amount: 129.50, date: "5d ago" }
  ],
  theme: "dark", // dark or light
};

function saveState() {
  localStorage.setItem("bermuda_bank_state", JSON.stringify(state));
}
function loadState() {
  try {
    const s = localStorage.getItem("bermuda_bank_state");
    if (s) {
      const loaded = JSON.parse(s);
      Object.assign(state, loaded);
    }
  } catch (e) { }
}

function formatMoney(v) {
  return "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatCrypto(val, dec=4) {
  return parseFloat(val).toFixed(dec);
}

// ========= Splash / Login Logic ========= //
window.addEventListener("DOMContentLoaded", () => {
  loadState();
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    document.getElementById("login-screen").style.display = "flex";
  }, 1400);

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
        switchPage("home");
      }, 360);
    } else {
      errorBox.innerText = "Invalid credentials. Try again.";
      errorBox.style.opacity = 1;
      loginForm.password.value = "";
    }
  });

  // Bottom nav
  document.querySelectorAll("#bottom-nav button").forEach(btn => {
    btn.addEventListener("click", () => {
      switchPage(btn.dataset.page);
    });
  });
});

// ========= NAV + RENDER ========= //
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
  if (page === "home") {
    // Nothing
  }
  if (page === "settings") bindThemeToggle();
  if (page === "profile") bindEditWallet();
  if (page === "wallet") bindWalletActions();
  if (page === "crypto") bindCryptoActions();
}

// =========== PAGE RENDERS ============= //
function renderHome() {
  const totalCryptoUSD = state.balances.btc * state.prices.btc + state.balances.eth * state.prices.eth;
  return `
    <div style="margin:1.1rem 0 0.7rem 0;">
      <div style="text-align:center;font-size:1.38rem;font-weight:600;color:var(--accent);letter-spacing:0.03em;">
        Welcome, ${state.user.username}
      </div>
    </div>
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
        ${state.activity.slice(0,6).map(tx => `
          <li>
            <span>${tx.desc}<br><small style="color:#4fe0fc;">${tx.date}</small></span>
            <span class="amount ${tx.type}">${tx.type==="deposit" ? "+" : "-"}${formatMoney(tx.amount)}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

function renderWallet() {
  return `
    <div class="card" style="margin-top:1.4rem;">
      <div class="card-title"><i class="fa-solid fa-wallet"></i> Wallet Balance</div>
      <div class="card-balance">${formatMoney(state.balances.wallet)}</div>
      <div class="wallet-actions">
        <button id="deposit-btn"><i class="fa-solid fa-arrow-down"></i> Deposit</button>
        <button id="withdraw-btn"><i class="fa-solid fa-arrow-up"></i> Withdraw</button>
      </div>
    </div>
    <div class="card" style="margin-top:1.2rem;">
      <div class="card-title"><i class="fa-solid fa-clock-rotate-left"></i> Recent Activity</div>
      <ul class="activity-list">
        ${state.activity.filter(tx => tx.desc.toLowerCase().includes("wallet")).slice(0,6).map(tx => `
          <li>
            <span>${tx.desc}<br><small style="color:#4fe0fc;">${tx.date}</small></span>
            <span class="amount ${tx.type}">${tx.type==="deposit" ? "+" : "-"}${formatMoney(tx.amount)}</span>
          </li>
        `).join("") || `<li style="color:#768eb8;text-align:center;">No recent wallet-specific activity.</li>`}
      </ul>
    </div>
  `;
}
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
    <div class="card" style="margin-top:1.2rem;">
      <div class="card-title"><i class="fa-solid fa-dollar-sign"></i> Conversion Rates</div>
      <ul style="padding:0 0 0 0.3em;list-style:none;">
        <li><b>BTC:</b> ${formatMoney(state.prices.btc)}/BTC</li>
        <li><b>ETH:</b> ${formatMoney(state.prices.eth)}/ETH</li>
      </ul>
    </div>
  `;
}
function renderProfile() {
  return `
    <div class="card" style="margin-top:1.5rem;">
      <div class="card-title"><i class="fa-solid fa-user"></i> Profile</div>
      <ul class="profile-list">
        <li>Username <span>${state.user.username}</span></li>
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

// ========== INTERACTION LOGIC =========== //
function bindWalletActions() {
  document.getElementById("deposit-btn").onclick = () => showModal("Deposit to Wallet", "Enter amount to deposit", (amt) => {
    if (amt <= 0 || isNaN(amt)) return showToast("Enter a valid amount.");
    state.balances.wallet += amt;
    state.activity.unshift({
      type: "deposit",
      desc: "Wallet Deposit",
      amount: amt,
      date: "Now"
    });
    saveState();
    switchPage("wallet");
    showToast(`Deposited ${formatMoney(amt)} to wallet!`);
  });
  document.getElementById("withdraw-btn").onclick = () => showModal("Withdraw from Wallet", "Enter amount to withdraw", (amt) => {
    if (amt <= 0 || isNaN(amt)) return showToast("Enter a valid amount.");
    if (amt > state.balances.wallet) return showToast("Insufficient funds.");
    state.balances.wallet -= amt;
    state.activity.unshift({
      type: "withdraw",
      desc: "Wallet Withdraw",
      amount: amt,
      date: "Now"
    });
    saveState();
    switchPage("wallet");
    showToast(`Withdrew ${formatMoney(amt)} from wallet.`);
  });
}
function bindCryptoActions() {
  document.getElementById("buy-crypto-btn").onclick = () => showCryptoModal("Buy");
  document.getElementById("sell-crypto-btn").onclick = () => showCryptoModal("Sell");
}
function bindEditWallet() {
  document.querySelector(".edit-wallet-btn").onclick = () => showEditWalletModal();
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

// ========== MODALS & TOASTS ========== //
function showModal(title, placeholder, cb) {
  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("modal-backdrop");
  modal.innerHTML = `
    <div class="modal-title">${title}</div>
    <label>Amount</label>
    <input type="number" min="0" step="0.01" id="modal-amt" placeholder="${placeholder}">
    <div class="modal-actions">
      <button id="modal-ok">OK</button>
      <button id="modal-cancel" style="background:#202950;">Cancel</button>
    </div>
  `;
  backdrop.style.display = "block";
  modal.style.display = "flex";
  setTimeout(() => document.getElementById("modal-amt").focus(), 150);

  document.getElementById("modal-ok").onclick = () => {
    const amt = parseFloat(document.getElementById("modal-amt").value);
    closeModal();
    cb(amt);
  };
  document.getElementById("modal-cancel").onclick = closeModal;
  backdrop.onclick = closeModal;
}
function showCryptoModal(type) {
  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("modal-backdrop");
  modal.innerHTML = `
    <div class="modal-title">${type === "Buy" ? "Buy Crypto" : "Sell Crypto"}</div>
    <label>Currency</label>
    <select id="modal-currency">
      <option value="btc">BTC</option>
      <option value="eth">ETH</option>
    </select>
    <label>Amount (${type === "Buy" ? "USD" : "Crypto Units"})</label>
    <input type="number" min="0" step="0.0001" id="modal-amt" placeholder="Enter amount">
    <div class="modal-actions">
      <button id="modal-ok">OK</button>
      <button id="modal-cancel" style="background:#202950;">Cancel</button>
    </div>
  `;
  backdrop.style.display = "block";
  modal.style.display = "flex";
  setTimeout(() => document.getElementById("modal-amt").focus(), 150);

  document.getElementById("modal-ok").onclick = () => {
    const cur = document.getElementById("modal-currency").value;
    let amt = parseFloat(document.getElementById("modal-amt").value);
    if (type === "Buy") {
      // Buy: USD to crypto
      let price = state.prices[cur];
      if (amt <= 0 || isNaN(amt)) return showToast("Enter a valid USD amount.");
      let units = amt / price;
      state.balances[cur] += units;
      state.activity.unshift({
        type: "deposit",
        desc: `Bought ${formatCrypto(units)} ${cur.toUpperCase()}`,
        amount: amt,
        date: "Now"
      });
      saveState();
      switchPage("crypto");
      showToast(`Bought ${formatCrypto(units)} ${cur.toUpperCase()}`);
    } else {
      // Sell: Crypto units to USD
      if (amt <= 0 || isNaN(amt)) return showToast("Enter a valid amount.");
      if (amt > state.balances[cur]) return showToast("Insufficient balance.");
      let usd = amt * state.prices[cur];
      state.balances[cur] -= amt;
      state.activity.unshift({
        type: "withdraw",
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

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-backdrop").style.display = "none";
}

// ======= TOAST ========= //
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}