let inputAmount = "";
let balance = 0;

// Elements
const balanceDisplay = document.getElementById("balance");
const moneyBalance = document.getElementById("money-balance");
const buttons = document.querySelectorAll(".keys button");
const backspace = document.getElementById("back");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const val = button.textContent;
    if (val !== "←" && inputAmount.length < 10) {
      inputAmount += val;
      updateDisplay();
    }
  });
});

backspace.addEventListener("click", () => {
  inputAmount = inputAmount.slice(0, -1);
  updateDisplay();
});

function updateDisplay() {
  const amount = inputAmount || "0";
  balanceDisplay.textContent = `$${amount}`;
}

// Actions
document.querySelector(".request").addEventListener("click", () => {
  alert(`Requested $${inputAmount || "0"}`);
  inputAmount = "";
  updateDisplay();
});

document.querySelector(".pay").addEventListener("click", () => {
  const amt = parseFloat(inputAmount);
  if (!isNaN(amt) && amt > 0) {
    balance -= amt;
    updateWallet();
  } else {
    alert("Enter a valid amount to pay.");
  }
  inputAmount = "";
  updateDisplay();
});

function addMoney() {
  const amt = prompt("Enter amount to deposit:");
  const num = parseFloat(amt);
  if (!isNaN(num)) {
    balance += num;
    updateWallet();
  }
}

function withdrawMoney() {
  const amt = prompt("Enter amount to withdraw:");
  const num = parseFloat(amt);
  if (!isNaN(num)) {
    if (num <= balance) {
      balance -= num;
      updateWallet();
    } else {
      alert("Insufficient funds.");
    }
  }
}

function updateWallet() {
  moneyBalance.textContent = `$${balance.toFixed(2)}`;
}

// Fake Transactions
const transactions = [
  { date: "2025-05-31", desc: "Withdrawal - Walmart", amt: -74.63 },
  { date: "2025-05-30", desc: "Payment Received - Chipotle", amt: 12.92 },
  { date: "2025-05-27", desc: "Withdrawal - Amazon", amt: -146.65 },
  { date: "2025-05-24", desc: "Payment Received - Netflix", amt: 33.47 },
  { date: "2025-05-21", desc: "Withdrawal - Steam", amt: -107.74 }
];

function loadTransactions() {
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";
  transactions.forEach(t => {
    const item = document.createElement("div");
    item.className = "transaction-item " + (t.amt < 0 ? "negative" : "positive");
    item.innerHTML = `
      <div>
        <strong>${t.desc}</strong><br/>
        <small>${t.date}</small>
      </div>
      <div>${t.amt < 0 ? "-" : "+"}$${Math.abs(t.amt).toFixed(2)}</div>
    `;
    list.appendChild(item);
  });
}

// Tab Switching (Nav)
const navButtons = document.querySelectorAll(".bottom-nav button");
const sections = document.querySelectorAll("main > section");

navButtons.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    sections.forEach(sec => sec.classList.add("hidden"));
    if (idx === 0) document.querySelector(".money-section").classList.remove("hidden");
    if (idx === 1) document.querySelector(".card-section").classList.remove("hidden");
    if (idx === 2) {
      document.querySelector(".balance-display").classList.remove("hidden");
      document.querySelector(".keypad").classList.remove("hidden");
    } else {
      document.querySelector(".balance-display").classList.add("hidden");
      document.querySelector(".keypad").classList.add("hidden");
    }
    if (idx === 4) {
      document.querySelector(".activity-section").classList.remove("hidden");
      loadTransactions();
    }
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Bank Modal Logic
function toggleModal() {
  document.getElementById("bankModal").classList.toggle("hidden");
}

function saveBank() {
  const bank = document.getElementById("bankName").value;
  const acc = document.getElementById("accountNumber").value;
  const routing = document.getElementById("routingNumber").value;
  if (bank && acc && routing) {
    alert(`Bank "${bank}" linked with Account: ${acc}`);
    toggleModal();
  } else {
    alert("Fill out all fields.");
  }
}
