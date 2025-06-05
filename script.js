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
