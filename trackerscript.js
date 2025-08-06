const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

let transactions = [];

// ✅ Fetch all transactions from backend
async function getTransactions() {
  console.log("🔄 Fetching all expenses...");
  try {
    const res = await fetch("http://localhost:5000/expenses");
    const data = await res.json();
    console.log("✅ Fetched data from backend:", data);
    transactions = data;
    Init();
  } catch (err) {
    console.error("❌ Error fetching expenses:", err);
  }
}

// ✅ Add new transaction
async function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add text and amount");
  } else {
    const transaction = {
      text: text.value,
      amount: +amount.value,
    };

    console.log("📤 Sending new transaction to backend:", transaction);

    try {
      const res = await fetch("http://localhost:5000/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      if (!res.ok) {
        throw new Error(`❌ Server responded with status ${res.status}`);
      }

      const newTransaction = await res.json();
      console.log("✅ Saved transaction:", newTransaction);

      transactions.push(newTransaction);

      addTransactionDOM(newTransaction);
      updateValues();

      text.value = "";
      amount.value = "";
    } catch (err) {
      console.error("❌ Error adding transaction:", err);
    }
  }
}

// ✅ Add Transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} 
    <span>&#8377;${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction('${transaction._id}')">x</button>
  `;

  list.appendChild(item);
}

// ✅ Update balances
function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerHTML = `&#8377;${total}`;
  money_plus.innerHTML = `+&#8377;${income}`;
  money_minus.innerHTML = `-&#8377;${expense}`;
}

// ✅ Delete Transaction
async function removeTransaction(id) {
  console.log("🗑️ Sending delete request for ID:", id);
  try {
    await fetch(`http://localhost:5000/expenses/${id}`, {
      method: "DELETE",
    });
    transactions = transactions.filter((transaction) => transaction._id !== id);
    Init();
    console.log("✅ Deleted transaction:", id);
  } catch (err) {
    console.error("❌ Error deleting transaction:", err);
  }
}

// ✅ Init App
function Init() {
  console.log("🔄 Initializing app...");
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Load transactions from backend when app starts
getTransactions();

form.addEventListener("submit", addTransaction);
