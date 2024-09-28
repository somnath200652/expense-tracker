document.addEventListener('DOMContentLoaded', () => {
    // Opening Scene Animation with Car
    const introScene = document.getElementById('intro-scene');
    const mainContent = document.getElementById('main-content');
    const startBtn = document.getElementById('start-btn');
  
    startBtn.addEventListener('click', () => {
      introScene.style.opacity = '0';
      setTimeout(() => {
        introScene.style.display = 'none';
        mainContent.style.display = 'block';
        setTimeout(() => {
          mainContent.style.opacity = '1';
        }, 100);
      }, 1000);
    });
  
    // Expense Tracker Logic
    let expenses = [];
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const budgetDisplay = document.getElementById('budget-display');
    const expenseChart = document.getElementById('expenseChart').getContext('2d');
    let tripBudget = 0;
    let chart = null;
  
    const renderExpenses = () => {
      expenseList.innerHTML = '';
      expenses.forEach((expense) => {
        const li = document.createElement('li');
        li.textContent = `${expense.description}: ₹${expense.amount} (${expense.category})`;
        expenseList.appendChild(li);
      });
      updateChart();
    };
  
    const updateChart = () => {
      const categories = ['Accommodation', 'Food', 'Transportation', 'Entertainment'];
      const categoryTotals = categories.map(category => {
        return expenses
          .filter(expense => expense.category === category)
          .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      });
  
      if (chart) {
        chart.destroy();  // Destroy the previous chart instance before creating a new one
      }
  
      chart = new Chart(expenseChart, {
        type: 'pie',
        data: {
          labels: categories,
          datasets: [{
            label: 'Expenses by Category',
            data: categoryTotals,
            backgroundColor: ['#ff6f61', '#6f86d6', '#58d68d', '#f7dc6f']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Expenses Distribution'
            }
          }
        }
      });
    };
  
    // Adding a new expense
    expenseForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const amount = document.getElementById('amount').value;
      const description = document.getElementById('description').value;
      const category = document.getElementById('category').value;
  
      expenses.push({ amount, description, category });
      renderExpenses();
      expenseForm.reset();
    });
  
    // Set budget
    document.getElementById('set-budget').addEventListener('click', function() {
      tripBudget = document.getElementById('trip-budget').value;
      budgetDisplay.textContent = `Trip Budget: ₹${tripBudget}`;
    });
  
    // Export CSV
    document.getElementById('export-btn').addEventListener('click', () => {
      const csvContent = "data:text/csv;charset=utf-8,Description,Amount,Category\n" +
        expenses.map(e => `${e.description},${e.amount},${e.category}`).join("\n");
  
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", "expenses.csv");
      document.body.appendChild(link);
      link.click();
    });
  });