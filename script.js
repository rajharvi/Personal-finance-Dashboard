let transactions = [];
let savingsGoal = 0;

document.getElementById('add-transaction').addEventListener('click', function () {
    const amountInput = document.getElementById('amount');
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const dateInput = document.getElementById('date');

    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;

    // Input validation
    if (!amount || isNaN(amount) || !date) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // Add transaction
    transactions.push({ amount, description, category, date });
    
    // Update summary and charts
    updateSummary();
    updateCharts();
    saveData();
    clearInputs();
});

document.getElementById('set-goal').addEventListener('click', function () {
    savingsGoal = parseFloat(document.getElementById('savings-goal').value);
    updateGoalProgress();
    saveData();
});

function clearInputs() {
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = 'income';
    document.getElementById('date').value = '';
}

function updateSummary() {
    const totalIncome = transactions.filter(t => t.category === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.category !== 'income').reduce((sum, t) => sum + t.amount, 0);
    const savings = totalIncome - totalExpenses;

    document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('savings').textContent = `$${savings.toFixed(2)}`;

    updateGoalProgress();
}

function updateGoalProgress() {
    const savings = parseFloat(document.getElementById('savings').textContent.slice(1)) || 0;
    const progressPercentage = (savingsGoal > 0) ? (savings / savingsGoal * 100).toFixed(2) : 0;
    const progressBar = document.querySelector('progress');
    const progressText = document.querySelector('#goal-progress p');

    progressBar.value = progressPercentage;
    progressText.textContent = `${progressPercentage}% of goal achieved`;
}

function updateCharts() {
    const categories = ['groceries', 'rent', 'entertainment', 'other'];
    const categoryTotals = categories.map(category => 
        transactions.filter(t => t.category === category).reduce((sum, t) => sum + t.amount, 0)
    );

    // Expense Chart
    const expenseChart = new Chart(document.getElementById('expense-chart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses by Category',
                data: categoryTotals,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        }
    });

    // Trend Chart
    const trendData = transactions.map(t => t.amount);
    const trendLabels = transactions.map(t => t.date);

    const trendChart = new Chart(document.getElementById('trend-chart').getContext('2d'), {
        type: 'line',
        data: {
            labels: trendLabels,
            datasets: [{
                label: 'Transaction Trend',
                data: trendData,
                fill: false,
                borderColor: '#42a5f5'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
            },
        }
    });
}

function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('savingsGoal', savingsGoal);
}

function loadData() {
    const savedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const savedGoal = parseFloat(localStorage.getItem('savingsGoal')) || 0;

    transactions.push(...savedTransactions);
    savingsGoal = savedGoal;

    updateSummary();
    updateCharts();
    updateGoalProgress();
}

// Load saved data on page load
loadData();
