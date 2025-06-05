document.addEventListener('DOMContentLoaded', function () {
  /* ───────────────────────────────────────────────
     Initial state and variables
  ─────────────────────────────────────────────── */
  let mainBalance   = 12345.67;   // Main account balance
  let walletBalance =   500.00;   // Wallet balance
  let btcBalance    =     0.5;
  let ethBalance    =    10;
  const priceBTC = 30000;
  const priceETH =  2000;
  let cardLocked = false;

  /* ───────────────────────────────────────────────
     Login with fixed credentials
     ---------------------------------
     VALID USERNAME : swiping.cc
     VALID PASSWORD : Admin!
  ─────────────────────────────────────────────── */
  const loginBtn      = document.getElementById('login-btn');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  loginBtn.addEventListener('click', function () {
    const usernameVal = usernameInput.value.trim();
    const passwordVal = passwordInput.value;

    // ‼️  Credential check
    if (usernameVal !== 'swiping.cc' || passwordVal !== 'Admin!') {
      alert('Invalid credentials. Please try again.');
      passwordInput.value = '';
      return;
    }

    /* Successful login */
    document.getElementById('user-name-display').textContent = usernameVal;
    document.getElementById('username-display').textContent   = usernameVal;

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    showPage('home-page');
    passwordInput.value = '';  // clear for security
  });

  /* ───────────────────────────────────────────────
     Navigation (single-page view switching)
  ─────────────────────────────────────────────── */
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn =>
    btn.addEventListener('click', () => showPage(btn.dataset.target))
  );

  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    navButtons.forEach(b => b.classList.remove('active'));

    const page      = document.getElementById(pageId);
    const activeNav = document.querySelector(`.nav-btn[data-target="${pageId}"]`);

    if (page)      page.classList.remove('hidden');
    if (activeNav) activeNav.classList.add('active');
  }

  /* ───────────────────────────────────────────────
     Home quick actions (+$100 / –$50 demo)
  ─────────────────────────────────────────────── */
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

  function updateMainBalance() {
    document.getElementById('main-balance').textContent = '$' + formatMoney(mainBalance);
  }

  /* ───────────────────────────────────────────────
     Wallet actions
  ─────────────────────────────────────────────── */
  const walletInput = document.getElementById('wallet-amount-input');

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

  function updateWalletBalance() {
    document.getElementById('wallet-balance-amount').textContent = '$' + formatMoney(walletBalance);
  }

  /* ───────────────────────────────────────────────
     Card lock / unlock
  ─────────────────────────────────────────────── */
  const lockBtn    = document.getElementById('lock-card-btn');
  const cardStatus = document.getElementById('card-status');

  lockBtn.addEventListener('click', () => {
    cardLocked = !cardLocked;
    lockBtn.textContent      = cardLocked ? 'Unlock Card' : 'Lock Card';
    cardStatus.textContent   = cardLocked ? 'Card is Locked' : 'Card is Unlocked';
    cardStatus.classList.toggle('locked',   cardLocked);
    cardStatus.classList.toggle('unlocked', !cardLocked);
  });

  /* Copy card number */
  document.getElementById('copy-card-btn').addEventListener('click', () => {
    const cardNumber = document.getElementById('card-number').textContent;
    navigator.clipboard?.writeText(cardNumber)
      .then(() => alert('Card number copied to clipboard'))
      .catch(() => alert('Copy failed'));
  });

  /* ───────────────────────────────────────────────
     Crypto buy / sell logic
  ─────────────────────────────────────────────── */
  const btcBalanceElem = document.getElementById('btc-balance');
  const ethBalanceElem = document.getElementById('eth-balance');
  const btcUsdElem     = document.getElementById('btc-usd');
  const ethUsdElem     = document.getElementById('eth-usd');

  document.querySelectorAll('.crypto-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      const coin  = btn.dataset.coin;        // 'btc' | 'eth'
      const isBuy = btn.classList.contains('crypto-buy');

      if (coin === 'btc') {
        btcBalance += isBuy ? 0.1 : -0.1;
        btcBalance  = Math.max(0, parseFloat(btcBalance.toFixed(4)));
        btcBalanceElem.textContent = `${btcBalance} BTC`;
        btcUsdElem.textContent     = '$' + formatMoney(btcBalance * priceBTC);
      }

      if (coin === 'eth') {
        ethBalance += isBuy ? 1 : -1;
        ethBalance  = Math.max(0, parseFloat(ethBalance.toFixed(2)));
        ethBalanceElem.textContent = `${ethBalance} ETH`;
        ethUsdElem.textContent     = '$' + formatMoney(ethBalance * priceETH);
      }
    })
  );

  /* ───────────────────────────────────────────────
     Theme toggle & logout
  ─────────────────────────────────────────────── */
  const themeToggle = document.getElementById('theme-toggle');

  themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('light-theme', themeToggle.checked);
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.body.classList.remove('light-theme');
    themeToggle.checked = false;
    showPage('home-page'); // reset
  });

  /* ───────────────────────────────────────────────
     Helpers
  ─────────────────────────────────────────────── */
  function formatMoney(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
});
