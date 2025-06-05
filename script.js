document.addEventListener('DOMContentLoaded', () => {
  /* ───────────────────────────────
     Initial state
  ─────────────────────────────── */
  let mainBalance   = 12345.67;
  let walletBalance =   500.00;
  let btcBalance    =     0.5;
  let ethBalance    =    10;
  const priceBTC = 30000;
  const priceETH =  2000;
  let cardLocked = false;

  /* ───────────────────────────────
     Cached DOM nodes
  ─────────────────────────────── */
  const loginBtn       = document.getElementById('login-btn');
  const usernameInput  = document.getElementById('username');
  const passwordInput  = document.getElementById('password');
  const navButtons     = document.querySelectorAll('.nav-btn');
  const walletInput    = document.getElementById('wallet-amount-input');
  const btcBalanceEl   = document.getElementById('btc-balance');
  const ethBalanceEl   = document.getElementById('eth-balance');
  const btcUsdEl       = document.getElementById('btc-usd');
  const ethUsdEl       = document.getElementById('eth-usd');
  const lockBtn        = document.getElementById('lock-card-btn');
  const cardStatus     = document.getElementById('card-status');
  const themeToggle    = document.getElementById('theme-toggle');

  /* ───────────────────────────────
     Helper functions
  ─────────────────────────────── */
  const formatMoney = n =>
    n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function updateMainBalance() {
    document.getElementById('main-balance').textContent = '$' + formatMoney(mainBalance);
  }

  function updateWalletBalance() {
    document.getElementById('wallet-balance-amount').textContent =
      '$' + formatMoney(walletBalance);
  }

  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    navButtons.forEach(b => b.classList.remove('active'));

    const page      = document.getElementById(pageId);
    const activeNav = document.querySelector(`.nav-btn[data-target="${pageId}"]`);

    if (page)      page.classList.remove('hidden');
    if (activeNav) activeNav.classList.add('active');
  }

  /* ───────────────────────────────
     LOGIN (single listener)
  ─────────────────────────────── */
  const VALID_USER = 'swiping.cc';
  const VALID_PASS = 'Admin!';

  function attemptLogin() {
    const user = usernameInput.value.trim().toLowerCase();
    const pass = passwordInput.value.trim();

    if (user !== VALID_USER || pass !== VALID_PASS) {
      alert('Invalid credentials.\n  Username: swiping.cc\n  Password: Admin!');
      passwordInput.value = '';
      return;
    }

    /* Success */
    document.getElementById('user-name-display').textContent = VALID_USER;
    document.getElementById('username-display').textContent  = VALID_USER;
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    showPage('home-page');

    usernameInput.value = '';
    passwordInput.value = '';
  }

  loginBtn.addEventListener('click', attemptLogin);
  [usernameInput, passwordInput].forEach(inp =>
    inp.addEventListener('keyup', e => { if (e.key === 'Enter') attemptLogin(); })
  );

  /* ───────────────────────────────
     Navigation
  ─────────────────────────────── */
  navButtons.forEach(btn =>
    btn.addEventListener('click', () => showPage(btn.dataset.target))
  );

  /* ───────────────────────────────
     Home quick actions
  ─────────────────────────────── */
  document.getElementById('add-money').addEventListener('click', () => {
    mainBalance += 100;
    updateMainBalance();
    alert('Added $100 to balance');
  });

  document.getElementById('send-money').addEventListener('click', () => {
    if (mainBalance >= 50) {
      mainBalance -= 50;
      updateMainBalance();
      alert('Sent $50');
    } else {
      alert('Insufficient balance to send money');
    }
  });

  /* ───────────────────────────────
     Wallet
  ─────────────────────────────── */
  document.getElementById('wallet-add').addEventListener('click', () => {
    const amt = parseFloat(walletInput.value);
    if (!isNaN(amt) && amt > 0) {
      walletBalance += amt;
      updateWalletBalance();
      walletInput.value = '';
    }
  });

  document.getElementById('wallet-withdraw').addEventListener('click', () => {
    const amt = parseFloat(walletInput.value);
    if (!isNaN(amt) && amt > 0) {
      walletBalance = Math.max(walletBalance - amt, 0);
      updateWalletBalance();
      walletInput.value = '';
    }
  });

  /* ───────────────────────────────
     Card lock / unlock
  ─────────────────────────────── */
  lockBtn.addEventListener('click', () => {
    cardLocked = !cardLocked;
    lockBtn.textContent    = cardLocked ? 'Unlock Card' : 'Lock Card';
    cardStatus.textContent = cardLocked ? 'Card is Locked' : 'Card is Unlocked';
    cardStatus.classList.toggle('locked',   cardLocked);
    cardStatus.classList.toggle('unlocked', !cardLocked);
  });

  /* Copy card number */
  document.getElementById('copy-card-btn').addEventListener('click', () => {
    const number = document.getElementById('card-number').textContent;
    navigator.clipboard?.writeText(number)
      .then(() => alert('Card number copied'))
      .catch(() => alert('Copy failed'));
  });

  /* ───────────────────────────────
     Crypto buy / sell
  ─────────────────────────────── */
  document.querySelectorAll('.crypto-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      const coin  = btn.dataset.coin;            // 'btc' | 'eth'
      const isBuy = btn.classList.contains('crypto-buy');

      if (coin === 'btc') {
        btcBalance += isBuy ? 0.1 : -0.1;
        btcBalance = Math.max(0, parseFloat(btcBalance.toFixed(4)));
        btcBalanceEl.textContent = `${btcBalance} BTC`;
        btcUsdEl.textContent     = '$' + formatMoney(btcBalance * priceBTC);
      } else if (coin === 'eth') {
        ethBalance += isBuy ? 1 : -1;
        ethBalance = Math.max(0, parseFloat(ethBalance.toFixed(2)));
        ethBalanceEl.textContent = `${ethBalance} ETH`;
        ethUsdEl.textContent     = '$' + formatMoney(ethBalance * priceETH);
      }
    })
  );

  /* ───────────────────────────────
     Theme toggle & logout
  ─────────────────────────────── */
  themeToggle.addEventListener('change', () =>
    document.body.classList.toggle('light-theme', themeToggle.checked)
  );

  document.getElementById('logout-btn').addEventListener('click', () => {
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.body.classList.remove('light-theme');
    themeToggle.checked = false;
    showPage('home-page');
  });

  /* ───────────────────────────────
     Initialise display values
  ─────────────────────────────── */
  updateMainBalance();
  updateWalletBalance();
});