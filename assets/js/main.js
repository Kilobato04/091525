// ===== GLOBAL VARIABLES =====
let charts = {};
let currentData = {
    scenario1: {},
    scenario2: {}
};

// ===== DOM READY INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== APP INITIALIZATION =====
function initializeApp() {
    // Initialize data from current HTML values
    initializeDataFromHTML();
    
    // Add event listeners for all editable inputs
    const editableInputs = document.querySelectorAll('.editable input');
    editableInputs.forEach(input => {
        input.addEventListener('input', handleInputChange);
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
    });

    // Initialize calculations
    updateAllCalculations();
    
    // Add keyboard navigation for tabs
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Load saved data if available
    loadData();
    
    console.log('Enhanced Cash Flow Application Initialized Successfully');
}

// ===== INITIALIZE DATA FROM HTML =====
function initializeDataFromHTML() {
    // Get all inputs and store their initial values
    const tables = ['scenario1-2025', 'scenario2-2025'];
    
    tables.forEach(tableId => {
        const scenario = tableId.includes('scenario1') ? 'scenario1' : 'scenario2';
        const inputs = document.querySelectorAll(`#${tableId} .editable input`);
        
        if (!currentData[scenario]) {
            currentData[scenario] = {};
        }
        
        inputs.forEach(input => {
            const concept = input.dataset.concept;
            const month = parseInt(input.dataset.month);
            const value = parseFloat(input.value) || 0;
            
            if (!currentData[scenario][concept]) {
                currentData[scenario][concept] = [];
            }
            
            currentData[scenario][concept][month] = value;
        });
    });
}

// ===== TAB NAVIGATION =====
function showTab(tabId) {
    try {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all nav tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Add active class to clicked nav tab
        if (event && event.target) {
            event.target.classList.add('active');
        }
        
        // Initialize charts when waterfall tab is shown
        if (tabId === 'waterfall-charts') {
            setTimeout(() => {
                initializeCharts();
            }, 100);
        }
        
        console.log(`Switched to tab: ${tabId}`);
        
    } catch (error) {
        console.error('Error switching tabs:', error);
    }
}

// ===== INPUT CHANGE HANDLER =====
function handleInputChange(event) {
    const input = event.target;
    const concept = input.dataset.concept;
    const month = parseInt(input.dataset.month);
    const value = parseFloat(input.value) || 0;
    const tableId = input.closest('table').id;
    const scenario = tableId.includes('scenario1') ? 'scenario1' : 'scenario2';
    
    // Update stored data
    if (!currentData[scenario][concept]) {
        currentData[scenario][concept] = [];
    }
    currentData[scenario][concept][month] = value;
    
    // Update calculations
    updateTableCalculations(tableId);
    updateChartsData();
    updateSummary();
    updateRecommendations();
    
    // Auto-save after changes
    autoSave();
}

// ===== UPDATE TABLE CALCULATIONS =====
function updateTableCalculations(tableId) {
    const table = document.getElementById(tableId);
    const scenario = tableId.includes('scenario1') ? 'scenario1' : 'scenario2';
    const year = tableId.includes('2025') ? '2025' : '2026';
    
    // Get all data rows (excluding header and total rows)
    const dataRows = table.querySelectorAll('.data-row');
    const totalMonths = 8; // May to December
    
    // Calculate totals for each concept (row totals)
    dataRows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        let rowTotal = 0;
        
        inputs.forEach(input => {
            rowTotal += parseFloat(input.value) || 0;
        });
        
        const totalCell = row.querySelector('.total-cell');
        if (totalCell) {
            totalCell.textContent = rowTotal.toFixed(1);
            
            // Update color based on value
            totalCell.className = `total-cell ${rowTotal >= 0 ? 'positive' : 'negative'}`;
        }
    });
    
    // Calculate monthly totals (column totals)
    for (let month = 0; month < totalMonths; month++) {
        // Income totals
        let incomeTotal = 0;
        let expenseTotal = 0;
        
        const monthInputs = table.querySelectorAll(`input[data-month="${month}"]`);
        
        monthInputs.forEach(input => {
            const row = input.closest('tr');
            const rowIndex = Array.from(row.parentNode.children).indexOf(row);
            const expenseStartIndex = Array.from(row.parentNode.children).findIndex(r => r.classList.contains('expense-row'));
            
            const value = parseFloat(input.value) || 0;
            
            if (rowIndex < expenseStartIndex) {
                incomeTotal += value;
            } else if (rowIndex > expenseStartIndex) {
                expenseTotal += value;
            }
        });
        
        // Update income total
        const incomeTotalCell = document.getElementById(`total-income-${scenario === 'scenario1' ? 's1' : 's2'}-${year}-${month}`);
        if (incomeTotalCell) {
            incomeTotalCell.innerHTML = `<strong>${incomeTotal.toFixed(1)}</strong>`;
            incomeTotalCell.className = `total-cell positive`;
        }
        
        // Update expense total
        const expenseTotalCell = document.getElementById(`total-expense-${scenario === 'scenario1' ? 's1' : 's2'}-${year}-${month}`);
        if (expenseTotalCell) {
            expenseTotalCell.innerHTML = `<strong>${expenseTotal.toFixed(1)}</strong>`;
            expenseTotalCell.className = `total-cell negative`;
        }
        
        // Calculate and update net flow
        const netFlow = incomeTotal - expenseTotal;
        const netFlowCell = document.getElementById(`net-flow-${scenario === 'scenario1' ? 's1' : 's2'}-${year}-${month}`);
        if (netFlowCell) {
            const sign = netFlow >= 0 ? '+' : '';
            netFlowCell.innerHTML = `<strong>${sign}${netFlow.toFixed(1)}</strong>`;
            netFlowCell.className = `total-cell ${netFlow >= 0 ? 'positive' : 'negative'}`;
        }
    }
    
    // Calculate year totals
    let yearIncomeTotal = 0;
    let yearExpenseTotal = 0;
    
    const allInputs = table.querySelectorAll('.data-row input');
    allInputs.forEach(input => {
        const row = input.closest('tr');
        const rowIndex = Array.from(row.parentNode.children).indexOf(row);
        const expenseStartIndex = Array.from(row.parentNode.children).findIndex(r => r.classList.contains('expense-row'));
        
        const value = parseFloat(input.value) || 0;
        
        if (rowIndex < expenseStartIndex) {
            yearIncomeTotal += value;
        } else if (rowIndex > expenseStartIndex) {
            yearExpenseTotal += value;
        }
    });
    
    // Update year income total
    const yearIncomeTotalCell = document.getElementById(`total-income-${scenario === 'scenario1' ? 's1' : 's2'}-${year}-year`);
    if (yearIncomeTotalCell) {
        yearIncomeTotalCell.innerHTML = `<strong>${yearIncomeTotal.toFixed(1)}</strong>`;
        yearIncomeTotalCell.className = `total-cell positive`;
    }
    
    // Update year expense total
    const yearExpenseTotalCell = document.getElementById(`total-expense-${scenario === 'scenario1' ? 's1' : 's2'}-${year}-year`);
    if (yearExpenseTotalCell) {
        yearExpenseTotalCell.innerHTML = `<strong>${yearExpenseTotal.toFixed(1)}</strong>`;
        yearExpenseTotalCell.className = `total-cell negative`;
    }
    
    // Update year net flow
    const yearNetFlow = yearIncomeTotal - yearExpenseTotal;
    const yearNetFlowCell = document.getElementById(`net-flow-${scenario === 'scenario1' ? 's1' : 's2'}-${year}-year`);
    if (yearNetFlowCell) {
        const sign = yearNetFlow >= 0 ? '+' : '';
        yearNetFlowCell.innerHTML = `<strong>${sign}${yearNetFlow.toFixed(1)}</strong>`;
        yearNetFlowCell.className = `total-cell ${yearNetFlow >= 0 ? 'positive' : 'negative'}`;
    }
}

// ===== UPDATE ALL CALCULATIONS =====
function updateAllCalculations() {
    updateTableCalculations('scenario1-2025');
    updateTableCalculations('scenario2-2025');
    updateChartsData();
    updateSummary();
    updateRecommendations();
}

// ===== INPUT HANDLERS =====
function handleInputFocus(event) {
    const cell = event.target.parentElement;
    cell.style.boxShadow = '0 0 12px rgba(255, 193, 7, 0.6)';
    cell.style.transform = 'scale(1.02)';
    event.target.select();
}

function handleInputBlur(event) {
    const cell = event.target.parentElement;
    cell.style.boxShadow = '';
    cell.style.transform = '';
    
    // Validate input value
    const value = parseFloat(event.target.value);
    if (isNaN(value)) {
        event.target.value = 0;
        handleInputChange(event);
    }
}

// ===== KEYBOARD NAVIGATION =====
function handleKeyboardNavigation(event) {
    // Tab navigation with Ctrl + number keys
    if (event.ctrlKey) {
        switch(event.keyCode) {
            case 49: // Ctrl + 1
                event.preventDefault();
                showTab('monthly-analysis');
                break;
            case 50: // Ctrl + 2
                event.preventDefault();
                showTab('waterfall-charts');
                break;
            case 51: // Ctrl + 3
                event.preventDefault();
                showTab('executive-summary');
                break;
            case 52: // Ctrl + 4
                event.preventDefault();
                showTab('recommendations');
                break;
        }
    }
}

// ===== CHART INITIALIZATION =====
function initializeCharts() {
    try {
        // Destroy existing charts
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        charts = {};

        // Wait for DOM to be ready
        setTimeout(() => {
            createWaterfallChart1_2025();
            createWaterfallChart2_2025();
            createComparisonChart();
            
            console.log('Charts initialized successfully');
        }, 100);
        
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// ===== WATERFALL CHART FUNCTIONS =====
function createWaterfallChart1_2025() {
    const ctx = document.getElementById('waterfall1-2025');
    if (!ctx) return;

    // Calculate totals from current data
    const scenario = currentData.scenario1;
    const totals = calculateScenarioTotals(scenario);
    
    charts.waterfall1_2025 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Salario', 'Consultoría', 'Cobros', 'Rendimientos', 'Lump Sum', 'Intereses', 'Gastos Pers.', 'Pago Deudas', 'Meta Ahorro', 'Flujo Neto'],
            datasets: [{
                label: 'Miles MXN',
                data: [
                    totals.salario || 0,
                    totals.consultoria || 0,
                    totals.cobros || 0,
                    totals.rendimientos || 0,
                    totals.lumpsum || 0,
                    totals.interesespareja || 0,
                    -(totals.gastospersonales || 0),
                    -(totals.pagodeudas || 0),
                    -(totals.metaahorro || 0),
                    totals.netFlow
                ],
                backgroundColor: [
                    '#28a745', '#28a745', '#28a745', '#28a745', '#28a745', '#28a745',
                    '#dc3545', '#dc3545', '#dc3545', '#007bff'
                ],
                borderColor: '#fff',
                borderWidth: 2,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Flujo de Efectivo Anual 2025 - Escenario 1',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(1)}K MXN`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Miles MXN',
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    ticks: {
                        font: { size: 10 },
                        maxRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 20
                }
            }
        }
    });
}

function createWaterfallChart2_2025() {
    const ctx = document.getElementById('waterfall2-2025');
    if (!ctx) return;
    
    // Calculate totals from current data
    const scenario = currentData.scenario2;
    const totals = calculateScenarioTotals(scenario);
    
    charts.waterfall2_2025 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Salario', 'Nuevo Trabajo', 'Cobros', 'Rendimientos', 'Lump Sum', 'Gastos Pers.', 'Pago Deudas', 'Meta Ahorro', 'Flujo Neto'],
            datasets: [{
                label: 'Miles MXN',
                data: [
                    totals.salario2 || 0,
                    totals.nuevotrabajo || 0,
                    totals.cobros2 || 0,
                    totals.rendimientos2 || 0,
                    totals.lumpsum2 || 0,
                    -(totals.gastospersonales2 || 0),
                    -(totals.pagodeudas2 || 0),
                    -(totals.metaahorro2 || 0),
                    totals.netFlow
                ],
                backgroundColor: [
                    '#28a745', '#28a745', '#28a745', '#28a745', '#28a745',
                    '#dc3545', '#dc3545', '#dc3545', '#007bff'
                ],
                borderColor: '#fff',
                borderWidth: 2,
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Flujo de Efectivo Anual 2025 - Escenario 2',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(1)}K MXN`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Miles MXN',
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    ticks: {
                        font: { size: 10 },
                        maxRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 20
                }
            }
        }
    });
}

function createComparisonChart() {
    const ctx = document.getElementById('comparison-chart');
    if (!ctx) return;
    
    // Calculate monthly net flows for both scenarios
    const scenario1Monthly = calculateMonthlyNetFlows('scenario1');
    const scenario2Monthly = calculateMonthlyNetFlows('scenario2');
    
    charts.comparison = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['May 2025', 'Jun 2025', 'Jul 2025', 'Ago 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dic 2025'],
            datasets: [{
                label: 'Escenario 1: Consultoría',
                data: scenario1Monthly,
                borderColor: '#e67e22',
                backgroundColor: 'rgba(230, 126, 34, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: '#e67e22',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                fill: true
            }, {
                label: 'Escenario 2: Nuevo Trabajo',
                data: scenario2Monthly,
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: '#27ae60',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 12, weight: 'bold' }
                    }
                },
                title: {
                    display: true,
                    text: 'Comparación Flujo Neto Mensual (Miles MXN)',
                    font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            const sign = value >= 0 ? '+' : '';
                            return `${context.dataset.label}: ${sign}${value.toFixed(1)}K MXN`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Flujo Neto (Miles MXN)',
                        font: { size: 14, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(0) + 'K';
                        },
                        font: { size: 12 }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Período',
                        font: { size: 14, weight: 'bold' }
                    },
                    ticks: {
                        maxRotation: 45,
                        font: { size: 11 }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            },
            layout: {
                padding: {
                    left: 15,
                    right: 15,
                    top: 15,
                    bottom: 40
                }
            }
        }
    });
}

// ===== CALCULATE SCENARIO TOTALS =====
function calculateScenarioTotals(scenario) {
    const totals = {};
    let totalIncome = 0;
    let totalExpenses = 0;
    
    for (const concept in scenario) {
        if (scenario[concept] && Array.isArray(scenario[concept])) {
            totals[concept] = scenario[concept].reduce((sum, value) => sum + (value || 0), 0);
            
            // Classify as income or expense
            if (['salario', 'salario2', 'consultoria', 'nuevotrabajo', 'cobros', 'cobros2', 
                 'rendimientos', 'rendimientos2', 'lumpsum', 'lumpsum2', 'interesespareja'].includes(concept)) {
                totalIncome += totals[concept];
            } else {
                totalExpenses += totals[concept];
            }
        }
    }
    
    totals.totalIncome = totalIncome;
    totals.totalExpenses = totalExpenses;
    totals.netFlow = totalIncome - totalExpenses;
    
    return totals;
}

// ===== CALCULATE MONTHLY NET FLOWS =====
function calculateMonthlyNetFlows(scenarioKey) {
    const scenario = currentData[scenarioKey];
    const monthlyFlows = [];
    
    for (let month = 0; month < 8; month++) {
        let monthlyIncome = 0;
        let monthlyExpenses = 0;
        
        for (const concept in scenario) {
            if (scenario[concept] && scenario[concept][month] !== undefined) {
                const value = scenario[concept][month] || 0;
                
                // Classify as income or expense
                if (['salario', 'salario2', 'consultoria', 'nuevotrabajo', 'cobros', 'cobros2', 
                     'rendimientos', 'rendimientos2', 'lumpsum', 'lumpsum2', 'interesespareja'].includes(concept)) {
                    monthlyIncome += value;
                } else {
                    monthlyExpenses += value;
                }
            }
        }
        
        monthlyFlows.push(monthlyIncome - monthlyExpenses);
    }
    
    return monthlyFlows;
}

// ===== UPDATE CHARTS DATA =====
function updateChartsData() {
    try {
        // Update waterfall chart 1
        if (charts.waterfall1_2025) {
            const totals = calculateScenarioTotals(currentData.scenario1);
            charts.waterfall1_2025.data.datasets[0].data = [
                totals.salario || 0,
                totals.consultoria || 0,
                totals.cobros || 0,
                totals.rendimientos || 0,
                totals.lumpsum || 0,
                totals.interesespareja || 0,
                -(totals.gastospersonales || 0),
                -(totals.pagodeudas || 0),
                -(totals.metaahorro || 0),
                totals.netFlow
            ];
            charts.waterfall1_2025.update('none');
        }
        
        // Update waterfall chart 2
        if (charts.waterfall2_2025) {
            const totals = calculateScenarioTotals(currentData.scenario2);
            charts.waterfall2_2025.data.datasets[0].data = [
                totals.salario2 || 0,
                totals.nuevotrabajo || 0,
                totals.cobros2 || 0,
                totals.rendimientos2 || 0,
                totals.lumpsum2 || 0,
                -(totals.gastospersonales2 || 0),
                -(totals.pagodeudas2 || 0),
                -(totals.metaahorro2 || 0),
                totals.netFlow
            ];
            charts.waterfall2_2025.update('none');
        }
        
        // Update comparison chart
        if (charts.comparison) {
            const scenario1Monthly = calculateMonthlyNetFlows('scenario1');
            const scenario2Monthly = calculateMonthlyNetFlows('scenario2');
            
            charts.comparison.data.datasets[0].data = scenario1Monthly;
            charts.comparison.data.datasets[1].data = scenario2Monthly;
            charts.comparison.update('none');
        }
        
    } catch (error) {
        console.error('Error updating chart data:', error);
    }
}

// ===== UPDATE SUMMARY =====
function updateSummary() {
    try {
        const totals1 = calculateScenarioTotals(currentData.scenario1);
        const totals2 = calculateScenarioTotals(currentData.scenario2);
        
        // Update scenario 1 summary
        const elements1 = {
            capital: document.getElementById('summary-s1-capital'),
            income: document.getElementById('summary-s1-income'),
            expenses: document.getElementById('summary-s1-expenses'),
            net: document.getElementById('summary-s1-net')
        };
        
        if (elements1.capital) elements1.capital.textContent = `${totals1.netFlow.toFixed(1)}K`;
        if (elements1.income) elements1.income.textContent = `${totals1.totalIncome.toFixed(1)}K`;
        if (elements1.expenses) elements1.expenses.textContent = `${totals1.totalExpenses.toFixed(1)}K`;
        if (elements1.net) elements1.net.textContent = `${totals1.netFlow >= 0 ? '+' : ''}${totals1.netFlow.toFixed(1)}K`;
        
        // Update scenario 2 summary
        const elements2 = {
            capital: document.getElementById('summary-s2-capital'),
            income: document.getElementById('summary-s2-income'),
            expenses: document.getElementById('summary-s2-expenses'),
            net: document.getElementById('summary-s2-net')
        };
        
        if (elements2.capital) elements2.capital.textContent = `${totals2.netFlow.toFixed(1)}K`;
        if (elements2.income) elements2.income.textContent = `${totals2.totalIncome.toFixed(1)}K`;
        if (elements2.expenses) elements2.expenses.textContent = `${totals2.totalExpenses.toFixed(1)}K`;
        if (elements2.net) elements2.net.textContent = `${totals2.netFlow >= 0 ? '+' : ''}${totals2.netFlow.toFixed(1)}K`;
        
        // Update comparison table
        const compElements = {
            s1Income: document.getElementById('comp-s1-income'),
            s2Income: document.getElementById('comp-s2-income'),
            incomeDiff: document.getElementById('comp-income-diff'),
            s1Expenses: document.getElementById('comp-s1-expenses'),
            s2Expenses: document.getElementById('comp-s2-expenses'),
            expensesDiff: document.getElementById('comp-expenses-diff'),
            s1Net: document.getElementById('comp-s1-net'),
            s2Net: document.getElementById('comp-s2-net'),
            netDiff: document.getElementById('comp-net-diff')
        };
        
        if (compElements.s1Income) compElements.s1Income.textContent = `${totals1.totalIncome.toFixed(1)}K MXN`;
        if (compElements.s2Income) compElements.s2Income.textContent = `${totals2.totalIncome.toFixed(1)}K MXN`;
        if (compElements.incomeDiff) {
            const diff = totals1.totalIncome - totals2.totalIncome;
            compElements.incomeDiff.textContent = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}K MXN`;
        }
        
        if (compElements.s1Expenses) compElements.s1Expenses.textContent = `${totals1.totalExpenses.toFixed(1)}K MXN`;
        if (compElements.s2Expenses) compElements.s2Expenses.textContent = `${totals2.totalExpenses.toFixed(1)}K MXN`;
        if (compElements.expensesDiff) {
            const diff = totals1.totalExpenses - totals2.totalExpenses;
            compElements.expensesDiff.textContent = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}K MXN`;
        }
        
        if (compElements.s1Net) compElements.s1Net.textContent = `${totals1.netFlow >= 0 ? '+' : ''}${totals1.netFlow.toFixed(1)}K MXN`;
        if (compElements.s2Net) compElements.s2Net.textContent = `${totals2.netFlow >= 0 ? '+' : ''}${totals2.netFlow.toFixed(1)}K MXN`;
        if (compElements.netDiff) {
            const diff = totals1.netFlow - totals2.netFlow;
            compElements.netDiff.textContent = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}K MXN`;
        }
        
    } catch (error) {
        console.error('Error updating summary:', error);
    }
}

// ===== UPDATE RECOMMENDATIONS =====
function updateRecommendations() {
    try {
        const totals1 = calculateScenarioTotals(currentData.scenario1);
        const totals2 = calculateScenarioTotals(currentData.scenario2);
        
        const recommendationsDiv = document.getElementById('dynamic-recommendations');
        if (!recommendationsDiv) return;
        
        let recommendationHTML = '';
        
        // Determine which scenario is better
        const netDiff = totals1.netFlow - totals2.netFlow;
        const betterScenario = netDiff > 0 ? 1 : 2;
        const betterScenarioName = netDiff > 0 ? 'Consultoría' : 'Nuevo Trabajo';
        
        recommendationHTML += `
            <div class="recommendation-item">
                <h4>🎯 RECOMENDACIÓN PRINCIPAL BASADA EN TUS DATOS</h4>
                <p><strong>Escenario ${betterScenario} (${betterScenarioName}) es superior por ${Math.abs(netDiff).toFixed(1)}K MXN</strong></p>
                <ul>
                    <li><strong>Escenario 1 (Consultoría):</strong> ${totals1.netFlow >= 0 ? '+' : ''}${totals1.netFlow.toFixed(1)}K MXN netos</li>
                    <li><strong>Escenario 2 (Nuevo Trabajo):</strong> ${totals2.netFlow >= 0 ? '+' : ''}${totals2.netFlow.toFixed(1)}K MXN netos</li>
                    <li><strong>Diferencia:</strong> ${Math.abs(netDiff).toFixed(1)}K MXN a favor del Escenario ${betterScenario}</li>
                </ul>
            </div>
        `;
        
        // Risk analysis
        const consultoriaTotal = (currentData.scenario1.consultoria || []).reduce((sum, val) => sum + (val || 0), 0);
        const nuevoTrabajoTotal = (currentData.scenario2.nuevotrabajo || []).reduce((sum, val) => sum + (val || 0), 0);
        const isConsultoriaRisky = consultoriaTotal < 100; // Threshold for risk
        
        recommendationHTML += `
            <div class="recommendation-item">
                <h4>⚠️ ANÁLISIS DE RIESGO</h4>
                <ul>
                    <li><strong>Consultoría Total Escenario 1:</strong> ${consultoriaTotal.toFixed(1)}K MXN</li>
                    <li><strong>Nuevo Trabajo Total Escenario 2:</strong> ${nuevoTrabajoTotal.toFixed(1)}K MXN</li>
                    <li><strong>Nivel de Riesgo Consultoría:</strong> ${isConsultoriaRisky ? 'ALTO - Ingresos bajos de consultoría' : 'MEDIO - Ingresos razonables'}</li>
                    <li><strong>Estabilidad Nuevo Trabajo:</strong> ${nuevoTrabajoTotal > 0 ? 'ALTA - Trabajo fijo garantizado' : 'Variable'}</li>
                </ul>
            </div>
        `;
        
        // Monthly cash flow analysis
        const scenario1Monthly = calculateMonthlyNetFlows('scenario1');
        const scenario2Monthly = calculateMonthlyNetFlows('scenario2');
        const negativeMonths1 = scenario1Monthly.filter(flow => flow < 0).length;
        const negativeMonths2 = scenario2Monthly.filter(flow => flow < 0).length;
        
        recommendationHTML += `
            <div class="recommendation-item">
                <h4>📊 ANÁLISIS DE FLUJO MENSUAL</h4>
                <ul>
                    <li><strong>Meses negativos Escenario 1:</strong> ${negativeMonths1} de 8 meses</li>
                    <li><strong>Meses negativos Escenario 2:</strong> ${negativeMonths2} de 8 meses</li>
                    <li><strong>Estabilidad:</strong> ${negativeMonths1 < negativeMonths2 ? 'Escenario 1 más estable' : negativeMonths2 < negativeMonths1 ? 'Escenario 2 más estable' : 'Ambos escenarios similares'}</li>
                    <li><strong>Flujo promedio Escenario 1:</strong> ${(scenario1Monthly.reduce((a, b) => a + b, 0) / 8).toFixed(1)}K MXN/mes</li>
                    <li><strong>Flujo promedio Escenario 2:</strong> ${(scenario2Monthly.reduce((a, b) => a + b, 0) / 8).toFixed(1)}K MXN/mes</li>
                </ul>
            </div>
        `;
        
        // Income breakdown analysis
        const scenario1Breakdown = getIncomeBreakdown(currentData.scenario1);
        const scenario2Breakdown = getIncomeBreakdown(currentData.scenario2);
        
        recommendationHTML += `
            <div class="recommendation-item">
                <h4>💰 ANÁLISIS DE COMPOSICIÓN DE INGRESOS</h4>
                <p><strong>Escenario 1 - Diversificación:</strong></p>
                <ul>
                    <li>Salario: ${scenario1Breakdown.salario.toFixed(1)}K (${((scenario1Breakdown.salario / totals1.totalIncome) * 100).toFixed(0)}%)</li>
                    <li>Consultoría: ${scenario1Breakdown.consultoria.toFixed(1)}K (${((scenario1Breakdown.consultoria / totals1.totalIncome) * 100).toFixed(0)}%)</li>
                    <li>Otros: ${scenario1Breakdown.otros.toFixed(1)}K (${((scenario1Breakdown.otros / totals1.totalIncome) * 100).toFixed(0)}%)</li>
                </ul>
                <p><strong>Escenario 2 - Diversificación:</strong></p>
                <ul>
                    <li>Salario: ${scenario2Breakdown.salario.toFixed(1)}K (${((scenario2Breakdown.salario / totals2.totalIncome) * 100).toFixed(0)}%)</li>
                    <li>Nuevo Trabajo: ${scenario2Breakdown.nuevoTrabajo.toFixed(1)}K (${((scenario2Breakdown.nuevoTrabajo / totals2.totalIncome) * 100).toFixed(0)}%)</li>
                    <li>Otros: ${scenario2Breakdown.otros.toFixed(1)}K (${((scenario2Breakdown.otros / totals2.totalIncome) * 100).toFixed(0)}%)</li>
                </ul>
            </div>
        `;
        
        // Final recommendation based on comprehensive analysis
        if (betterScenario === 1 && !isConsultoriaRisky && negativeMonths1 <= negativeMonths2) {
            recommendationHTML += `
                <div class="recommendation-item" style="background: rgba(40, 167, 69, 0.2); border-left-color: #28a745;">
                    <h4>✅ RECOMENDACIÓN FINAL: ESCENARIO 1 - CONSULTORÍA</h4>
                    <p>Con tus números actuales, la consultoría independiente es la mejor opción:</p>
                    <ul>
                        <li>Mayor flujo neto anual (+${netDiff.toFixed(1)}K MXN)</li>
                        <li>Ingresos de consultoría robustos (${consultoriaTotal.toFixed(1)}K MXN)</li>
                        <li>Mejor estabilidad mensual (${negativeMonths1} meses negativos vs ${negativeMonths2})</li>
                        <li>Libertad y flexibilidad total</li>
                        <li>Potencial de crecimiento ilimitado</li>
                    </ul>
                </div>
            `;
        } else if (betterScenario === 2) {
            recommendationHTML += `
                <div class="recommendation-item" style="background: rgba(39, 174, 96, 0.2); border-left-color: #27ae60;">
                    <h4>✅ RECOMENDACIÓN FINAL: ESCENARIO 2 - NUEVO TRABAJO</h4>
                    <p>El nuevo trabajo es la opción más segura y rentable:</p>
                    <ul>
                        <li>Mayor flujo neto anual (+${Math.abs(netDiff).toFixed(1)}K MXN)</li>
                        <li>Ingresos garantizados y estables (${nuevoTrabajoTotal.toFixed(1)}K MXN)</li>
                        <li>Menor riesgo financiero</li>
                        <li>Base sólida para desarrollo futuro</li>
                        <li>Mejor estabilidad mensual (${negativeMonths2} meses negativos)</li>
                    </ul>
                </div>
            `;
        } else {
            recommendationHTML += `
                <div class="recommendation-item" style="background: rgba(255, 193, 7, 0.2); border-left-color: #ffc107;">
                    <h4>⚠️ RECOMENDACIÓN CONDICIONAL: EVALUAR RIESGOS</h4>
                    <p>La consultoría tiene mejor flujo pero presenta algunos riesgos:</p>
                    <ul>
                        <li>Ventaja de flujo neto: +${netDiff.toFixed(1)}K MXN</li>
                        <li>Ingresos de consultoría: ${consultoriaTotal.toFixed(1)}K MXN ${isConsultoriaRisky ? '(BAJO)' : '(ADECUADO)'}</li>
                        <li>Estabilidad: ${negativeMonths1} meses negativos vs ${negativeMonths2} del Escenario 2</li>
                        <li>Considera aumentar tarifas o número de clientes si eliges consultoría</li>
                        <li>El Escenario 2 puede ser más seguro inicialmente</li>
                    </ul>
                </div>
            `;
        }
        
        // Action items
        recommendationHTML += `
            <div class="recommendation-item">
                <h4>🎯 PRÓXIMOS PASOS RECOMENDADOS</h4>
                <ul>
                    <li><strong>Inmediato:</strong> Revisa y ajusta las proyecciones de consultoría/nuevo trabajo</li>
                    <li><strong>Corto plazo:</strong> Evalúa oportunidades reales en ambos escenarios</li>
                    <li><strong>Mediano plazo:</strong> Desarrolla plan B independientemente del escenario elegido</li>
                    <li><strong>Continuo:</strong> Monitorea y actualiza este modelo mensualmente</li>
                </ul>
            </div>
        `;
        
        recommendationsDiv.innerHTML = recommendationHTML;
        
    } catch (error) {
        console.error('Error updating recommendations:', error);
    }
}

// ===== HELPER FUNCTION FOR INCOME BREAKDOWN =====
function getIncomeBreakdown(scenario) {
    const breakdown = {
        salario: 0,
        consultoria: 0,
        nuevoTrabajo: 0,
        otros: 0
    };
    
    for (const concept in scenario) {
        if (scenario[concept] && Array.isArray(scenario[concept])) {
            const total = scenario[concept].reduce((sum, value) => sum + (value || 0), 0);
            
            if (concept.includes('salario')) {
                breakdown.salario += total;
            } else if (concept === 'consultoria') {
                breakdown.consultoria += total;
            } else if (concept === 'nuevotrabajo') {
                breakdown.nuevoTrabajo += total;
            } else if (['cobros', 'cobros2', 'rendimientos', 'rendimientos2', 'lumpsum', 'lumpsum2', 'interesespareja'].includes(concept)) {
                breakdown.otros += total;
            }
        }
    }
    
    return breakdown;
}

// ===== SAVE SCENARIO DATA =====
function saveScenarioData(scenarioKey) {
    try {
        const button = document.getElementById(`save-${scenarioKey}`);
        if (!button) return;
        
        // Show loading state
        button.textContent = '💾 Saving...';
        button.disabled = true;
        
        // Get current data for the scenario
        const scenarioData = currentData[scenarioKey];
        
        // Store in localStorage
        localStorage.setItem(`cashflow-${scenarioKey}-data`, JSON.stringify(scenarioData));
        localStorage.setItem(`cashflow-${scenarioKey}-timestamp`, new Date().toISOString());
        
        // Show success animation
        setTimeout(() => {
            button.classList.add('saved');
            button.textContent = '✅ Saved!';
            button.disabled = false;
            
            setTimeout(() => {
                button.classList.remove('saved');
                button.textContent = '💾 Save';
            }, 2000);
        }, 500);
        
        console.log(`${scenarioKey} data saved successfully`);
        showNotification(`${scenarioKey.toUpperCase()} data saved successfully!`, 'success');
        
    } catch (error) {
        console.error('Error saving scenario data:', error);
        showNotification('Error saving data', 'error');
        
        // Reset button
        const button = document.getElementById(`save-${scenarioKey}`);
        if (button) {
            button.textContent = '💾 Save';
            button.disabled = false;
        }
    }
}

// ===== AUTO-SAVE FUNCTIONALITY =====
function autoSave() {
    try {
        localStorage.setItem('cashflow-scenario1-data', JSON.stringify(currentData.scenario1));
        localStorage.setItem('cashflow-scenario2-data', JSON.stringify(currentData.scenario2));
        localStorage.setItem('cashflow-last-autosave', new Date().toISOString());
    } catch (error) {
        console.error('Auto-save failed:', error);
    }
}

// ===== LOAD DATA =====
function loadData() {
    try {
        // Try to load from localStorage
        const scenario1Data = localStorage.getItem('cashflow-scenario1-data');
        const scenario2Data = localStorage.getItem('cashflow-scenario2-data');
        
        if (scenario1Data) {
            currentData.scenario1 = JSON.parse(scenario1Data);
        }
        
        if (scenario2Data) {
            currentData.scenario2 = JSON.parse(scenario2Data);
        }
        
        // Update inputs with loaded data
        updateInputsFromData();
        updateAllCalculations();
        
        console.log('Data loaded successfully');
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// ===== UPDATE INPUTS FROM DATA =====
function updateInputsFromData() {
    ['scenario1', 'scenario2'].forEach(scenarioKey => {
        const tableId = scenarioKey === 'scenario1' ? 'scenario1-2025' : 'scenario2-2025';
        const scenario = currentData[scenarioKey];
        
        for (const concept in scenario) {
            if (Array.isArray(scenario[concept])) {
                scenario[concept].forEach((value, month) => {
                    const input = document.querySelector(`#${tableId} input[data-concept="${concept}"][data-month="${month}"]`);
                    if (input) {
                        input.value = value || 0;
                    }
                });
            }
        }
    });
}

// ===== UTILITY FUNCTIONS =====
function formatCurrency(value, decimals = 1) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value * 1000);
}

function formatNumber(value, decimals = 1) {
    return new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

function exportData() {
    try {
        const data = {
            timestamp: new Date().toISOString(),
            scenario1: currentData.scenario1,
            scenario2: currentData.scenario2,
            calculations: {
                scenario1: calculateScenarioTotals(currentData.scenario1),
                scenario2: calculateScenarioTotals(currentData.scenario2)
            },
            metadata: {
                version: '2.0.0',
                lastModified: localStorage.getItem('cashflow-last-autosave'),
                userAgent: navigator.userAgent
            }
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `cashflow-analysis-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('Data exported successfully');
        showNotification('Data exported successfully!', 'success');
        
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('Error exporting data', 'error');
    }
}

function printReport() {
    try {
        // Hide navigation and show all content for printing
        const navTabs = document.querySelector('.nav-tabs');
        const tabContents = document.querySelectorAll('.tab-content');
        const saveButtons = document.querySelectorAll('.save-button');
        
        if (navTabs) navTabs.style.display = 'none';
        saveButtons.forEach(btn => btn.style.display = 'none');
        
        tabContents.forEach(tab => {
            tab.classList.add('active');
            tab.style.display = 'block';
        });
        
        window.print();
        
        // Restore navigation after printing
        setTimeout(() => {
            if (navTabs) navTabs.style.display = 'flex';
            saveButtons.forEach(btn => btn.style.display = 'block');
            
            tabContents.forEach((tab, index) => {
                if (index !== 0) {
                    tab.classList.remove('active');
                    tab.style.display = 'none';
                }
            });
        }, 1000);
        
        console.log('Print dialog opened');
        
    } catch (error) {
        console.error('Error opening print dialog:', error);
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    try {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
        
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showNotification('Se produjo un error. Consulta la consola para más detalles.', 'error');
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('Error de procesamiento. Por favor, revisa los datos ingresados.', 'warning');
});

// ===== AUTO-SAVE TIMER =====
setInterval(() => {
    autoSave();
}, 30000); // Auto-save every 30 seconds

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.CashFlowApp = {
    showTab,
    updateAllCalculations,
    saveScenarioData,
    exportData,
    loadData,
    printReport,
    formatCurrency,
    formatNumber,
    initializeCharts,
    currentData,
    charts
};

// ===== PERFORMANCE MONITORING =====
function measurePerformance(functionName, fn) {
    return function(...args) {
        const start = performance.now();
        const result = fn.apply(this, args);
        const end = performance.now();
        console.log(`${functionName} took ${(end - start).toFixed(2)} milliseconds`);
        return result;
    };
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function enhanceAccessibility() {
    // Add ARIA labels to interactive elements
    const editableInputs = document.querySelectorAll('.editable input');
    editableInputs.forEach((input, index) => {
        const concept = input.dataset.concept;
        const month = input.dataset.month;
        input.setAttribute('aria-label', `${concept} mes ${parseInt(month) + 1}`);
        input.setAttribute('role', 'spinbutton');
    });
    
    // Add keyboard shortcuts info
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 1000;
        display: none;
    `;
    shortcutsInfo.innerHTML = `
        <strong>Atajos de teclado:</strong><br>
        Ctrl+1: Análisis Mensual<br>
        Ctrl+2: Gráficos<br>
        Ctrl+3: Resumen<br>
        Ctrl+4: Recomendaciones
    `;
    shortcutsInfo.id = 'shortcuts-info';
    document.body.appendChild(shortcutsInfo);
    
    // Show shortcuts on Alt key
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'Alt') {
            shortcutsInfo.style.display = 'block';
        }
    });
    
    document.addEventListener('keyup', function(event) {
        if (!event.altKey) {
            shortcutsInfo.style.display = 'none';
        }
    });
}

// ===== INITIALIZATION COMPLETE =====
document.addEventListener('DOMContentLoaded', function() {
    enhanceAccessibility();
    
    // Add version info to console
    console.log('🚀 Enhanced Cash Flow Analysis Tool v2.0.0 - Initialized Successfully!');
    console.log('📊 All cells are now editable with real-time calculations');
    console.log('💾 Use Save buttons to persist changes');
    console.log('📈 Charts update automatically with your data changes');
    console.log('🎯 Dynamic recommendations based on your data');
    console.log('For support, press Alt to see keyboard shortcuts');
});
