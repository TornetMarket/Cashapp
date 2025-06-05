document.addEventListener('DOMContentLoaded', function() {
  // Initial state and variables
  let mainBalance = 12345.67;  // Main account balance
  let walletBalance = 500.00;  // Wallet balance
  let btcBalance = 0.5;
  let ethBalance = 10;
  const priceBTC = 30000;
  const priceETH = 2000;
  let cardLocked = false;

  // Login functionality
  document.getElementById('login-btn').addEventListener('click', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameVal = usernameInput.value.trim();
    // Set username in app if provided
    if (usernameVal !== "") {
      document.getElementById('user-name-display').textContent = usernameVal;
      document.getElementById('username-display').textContent = usernameVal;
    } else {
      // If no username entered, it will just use default "User"
    }
    // Show main app, hide login screen
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    // Default to Home page on login
    showPage('home-page');
    // Clear password field for security
    passwordInput.value = "";
  });

  // Navigation between pages
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const targetPage = btn.getAttribute('data-target');
      showPage(targetPage);
    });
  });
  // Function to display a page and hide others
  function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(function(page) {
      page.classList.add('hidden');
    });
    // Remove active class from all nav buttons
    navButtons.forEach(function(nav) {
      nav.classList.remove('active');
    });
    // Show the target page
    const page = document.getElementById(pageId);
    if (page) {
      page.classList.remove('hidden');
    }
    // Highlight the active nav button
    const activeNav = document.querySelector(`.nav-btn[data-target="${pageId}"]`);
    if (activeNav) {
      activeNav.classList.add('active');
    }
  }

  // Quick Action Buttons on Home
  document.getElementById('add-money').addEventListener('click', function() {
    mainBalance += 100;
    updateMainBalance();
    alert('Added $100 to balance');
  });
  document.getElementById('send-money').addEventListener('click', function() {
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

  // Wallet Add/Withdraw
  const walletInput = document.getElementById('wallet-amount-input');
  document.getElementById('wallet-add').addEventListener('click', function() {
    const amt = parseFloat(walletInput.value);
    if (!isNaN(amt) && amt > 0) {
      walletBalance += amt;
      updateWalletBalance();
      walletInput.value = '';
    }
  });
  document.getElementById('wallet-withdraw').addEventListener('click', function() {
    const amt = parseFloat(walletInput.value);
    if (!isNaN(amt) && amt > 0) {
      walletBalance -= amt;
      if (walletBalance < 0) {
        walletBalance = 0;
      }
      updateWalletBalance();
      walletInput.value = '';
    }
  });
  function updateWalletBalance() {
    document.getElementById('wallet-balance-amount').textContent = '$' + formatMoney(walletBalance);
  }

  // Card: Lock/Unlock toggle
  const lockBtn = document.getElementById('lock-card-btn');
  const cardStatus = document.getElementById('card-status');
  lockBtn.addEventListener('click', function() {
    if (!cardLocked) {
      // Lock the card
      cardLocked = true;
      lockBtn.textContent = 'Unlock Card';
      cardStatus.textContent = 'Card is Locked';
      cardStatus.classList.remove('unlocked');
      cardStatus.classList.add('locked');
    } else {
      // Unlock the card
      cardLocked = false;
      lockBtn.textContent = 'Lock Card';
      cardStatus.textContent = 'Card is Unlocked';
      cardStatus.classList.remove('locked');
      cardStatus.classList.add('unlocked');
    }
  });

  // Card: Copy Number to clipboard
  document.getElementById('copy-card-btn').addEventListener('click', function() {
    const cardNumber = document.getElementById('card-number').textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cardNumber).then(function() {
        alert('Card number copied to clipboard');
      }, function() {
        alert('Failed to copy card number');
      });
    } else {
      // Fallback method
      const tempInput = document.createElement('textarea');
      tempInput.value = cardNumber;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      alert('Card number copied to clipboard');
    }
  });

  // Crypto Buy/Sell
  const btcBalanceElem = document.getElementById('btc-balance');
  const ethBalanceElem = document.getElementById('eth-balance');
  const btcUsdElem = document.getElementById('btc-usd');
  const ethUsdElem = document.getElementById('eth-usd');
  document.querySelectorAll('.crypto-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const coin = btn.getAttribute('data-coin'); // 'btc' or 'eth'
      const isBuy = btn.classList.contains('crypto-buy');
      if (coin === 'btc') {
        if (isBuy) {
          btcBalance += 0.1;
        } else {
          btcBalance -= 0.1;
        }
        if (btcBalance < 0) btcBalance = 0;
        // Limit to 4 decimal places
        btcBalance = parseFloat(btcBalance.toFixed(4));
        btcBalanceElem.textContent = btcBalance + ' BTC';
        const btcValue = btcBalance * priceBTC;
        btcUsdElem.textContent = '$' + formatMoney(btcValue);
      } else if (coin === 'eth') {
        if (isBuy) {
          ethBalance += 1;
        } else {
          ethBalance -= 1;
        }
        if (ethBalance < 0) ethBalance = 0;
        // Limit to 2 decimal places
        ethBalance = parseFloat(ethBalance.toFixed(2));
        ethBalanceElem.textContent = ethBalance + ' ETH';
        const ethValue = ethBalance * priceETH;
        ethUsdElem.textContent = '$' + formatMoney(ethValue);
      }
    });
  });

  // Theme toggle (Dark/Light mode)
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('change', function() {
    if (themeToggle.checked) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', function() {
    // Hide main app and show login screen
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    // Reset theme to dark
    document.body.classList.remove('light-theme');
    themeToggle.checked = false;
    // Reset to home page for next login
    showPage('home-page');
  });

  // Helper function to format numbers as currency string
  function formatMoney(amount) {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
});
