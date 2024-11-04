
const openForm = document.getElementById('openForm');
openForm.addEventListener('click', () => {
    document.getElementById('popupForm').style.display = 'flex';
});

const closeForm = document.querySelector('.close-btn');
closeForm.addEventListener('click', () => {
    document.getElementById('popupForm').style.display = 'none';
});

const addTransaction = document.getElementById('transactionForm');
addTransaction.addEventListener('submit', () => {
    document.getElementById('popupForm').style.display = 'none';
})

const submit = document.getElementById('transactionForm');
submit.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const note = document.getElementById('note').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;

    const type = document.querySelector('input[name="type"]:checked').value;

    const transaction = {
        note: note,
        amount: amount,
        date: date,
        type: type,
    };

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    const index = document.getElementById('transactionIndex').value;
    if (index) {
        transactions[index] = transaction;
    } else {
        transactions.push(transaction);
    }

    localStorage.setItem('transactions', JSON.stringify(transactions));

    document.getElementById('transactionForm').reset();
    document.getElementById('popupForm').style.display = 'none';

    console.log('Transaction added:', transaction);
    populateTable();
});

function populateTable() {
    const tableBody = document.getElementById('tableBody');
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    let filteredTransactions = transactions;
    if(currentTypeFilter != ''){
        filteredTransactions = transactions.filter(transaction => transaction.type == currentTypeFilter);
    }
    
    tableBody.innerHTML = ''; 

    filteredTransactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        if(transaction.type == 'income'){
            row.classList = 'income-row';
        }
        else{
            row.classList = 'expense-row'
        }
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.note}</td>
            <td>${transaction.type}</td>
            <td>${transaction.amount}</td>
            <td>
                <img src="./assets/icons/pen.png" class="edit-icon" data-index="${index}" alt="Edit">
                <img src="./assets/icons/delete.png" class="delete-icon" data-index="${index}" alt="Delete">
            </td>
        `;
        tableBody.appendChild(row);
        populateTotals();
    });
}

function handleEdit(index) {
    const transactions = JSON.parse(localStorage.getItem('transactions'));
    const transaction = transactions[index];

    document.getElementById('note').value = transaction.note;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('date').value = transaction.date;

    document.querySelector(`input[name="type"][value="${transaction.type}"]`).checked = true;

    document.getElementById('transactionIndex').value = index;

    document.getElementById('popupForm').style.display = 'flex';
}

function handleDelete(index) {
    const transactions = JSON.parse(localStorage.getItem('transactions'));
    const confirmed = confirm("Are you sure you want to delete this transaction?");

    if (confirmed) {
        transactions.splice(index, 1); 
        localStorage.setItem('transactions', JSON.stringify(transactions)); 
        populateTable();
    }
}

function populateTotals(){
    const transactions = JSON.parse(localStorage.getItem('transactions'));
    let totalExpenses = 0;
    let totalIncome = 0;
    transactions.forEach(item => {
        if (item.type == 'expense'){
            totalExpenses += parseInt(item.amount);
        }else{
            totalIncome += parseInt(item.amount);
        }
    });
    console.log(totalExpenses);
    document.getElementById('total-expense').innerText = totalExpenses;
    document.getElementById('total-income').innerText = totalIncome;
    document.getElementById('total-balance').innerText = totalIncome - totalExpenses;
}

document.getElementById('tableBody').addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-icon')) {
        const index = event.target.getAttribute('data-index');
        handleEdit(index);
    } else if (event.target.classList.contains('delete-icon')) {
        const index = event.target.getAttribute('data-index');
        handleDelete(index);
    }
});

const sortNote = () => {
    const transactions = JSON.parse(localStorage.getItem('transactions'));
    console.log(transactions[0].note);
    if(hasBeenPressedNote) {
        hasBeenPressedNote = false;
        transactions.sort(((a, b) => (a.note > b.note ? 1 : -1)));
        localStorage.setItem('transactions', JSON.stringify(transactions)); 
        populateTable();
    }else{
        hasBeenPressedNote = true;
        transactions.sort(((a, b) => (a.note < b.note ? 1 : -1)));
        localStorage.setItem('transactions', JSON.stringify(transactions)); 
        populateTable();
    }
}
const sortDate = () => {
    const transactions = JSON.parse(localStorage.getItem('transactions'));
    transactions.sort((a, b) => {
        const dateA = new Date(a.date); 
        const dateB = new Date(b.date); 
        return hasBeenPressedDate ? dateB - dateA : dateA - dateB; 
    });
    
    hasBeenPressedDate = !hasBeenPressedDate;
        localStorage.setItem('transactions', JSON.stringify(transactions)); 
        populateTable();
    }

const sortAmount = () => {
    const transactions = JSON.parse(localStorage.getItem('transactions'));
    transactions.sort((a, b) => {
        const amountA = parseInt(a.amount, 10); 
        const amountB = parseInt(b.amount, 10);
        return hasBeenPressedAmount ? amountB - amountA : amountA - amountB;
    });
    
    hasBeenPressedAmount = !hasBeenPressedAmount;
        localStorage.setItem('transactions', JSON.stringify(transactions)); 
        populateTable();
    }

const filterType = () => {
    const typeFilter = document.getElementById('typeFilter').value;
    currentTypeFilter = typeFilter; 
    populateTable();
}

let hasBeenPressedNote = false;
let hasBeenPressedDate = false;
let hasBeenPressedAmount = false;
let currentTypeFilter = '';
document.getElementById('sort-note').addEventListener('click', sortNote);
document.getElementById('sort-date').addEventListener('click', sortDate);
document.getElementById('sort-amount').addEventListener('click', sortAmount);
document.getElementById('typeFilter').addEventListener('change', filterType);

// const isSortDatePressed = document.getElementById('sort-date').addEventListener('click', sortDate);
// const isSortAmountPressed = document.getElementById('sort-amount').addEventListener('click', sortDate);
// const isSortTypePressed = document.getElementById('sort-type').addEventListener('click', sortDate);

populateTotals()
populateTable();

