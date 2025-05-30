// ===== GLOBAL VARIABLES =====
let charts = {};
let currentData = {
    scenario1: {
        consultation: [0, 15, 25, 20, 0, 40, 50, 35]
    }
};

// ===== DOM READY INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== APP INITIALIZATION =====
function initializeApp() {
    // Add event listeners for editable inputs
    const editableInputs = document.querySelectorAll('.editable input');
    editableInputs.forEach(input => {
        input.addEventListener('input', updateCalculations);
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
    });

    // Initialize calculations with default values
    updateCalculations();
    
    // Add keyboard navigation for tabs
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    console.log('Cash Flow Application Initialized Successfully');
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
        
        // Log tab change
        console.log(`Switched to tab: ${tabId}`);
        
    } catch (error) {
        console.error('Error switching tabs:', error);
    }
}

// ===== CALCULATION FUNCTIONS =====
function updateCalculations() {
    try {
        // Get all consultation input values for scenario 1, 2025
        const consultoriaInputs = document.querySelectorAll('#scenario1-2025 .editable input');
        let consultoriaTotal = 0;
        let consultoriaValues = [];
        
        consultoriaInputs.forEach(input => {
            const value = parseFloat(input.value) || 0;
            consultoriaTotal += value;
            consultoriaValues.push(value);
        });
        
        // Update stored data
        currentData.scenario1.consultation = consultoriaValues;
        
        // Update the total consultation cell
        const consultoriaTotalCell = document.getElementById('consultoria-total-s1-2025');
        if (consultoriaTotalCell) {
            consultoriaTotalCell.textContent = consultoriaTotal.toFixed(1);
        }
        
        // Recalculate monthly totals for income
        const months = ['may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthlyTotals = [];
        let yearTotal = 0;
        
        months.forEach((month, index) => {
            const salario = index === 0 ? 40.3 : index < 4 ? 80.5 : index === 4 ? 40.3 : 0;
            const consultoria = consultoriaValues[index] || 0;
            const cobros = month === 'jun' ? 22 : month === 'jul' ? 13.5 : month === 'sep' ? 170 : 0;
            const rendimientos = index === 0 ? 0.2 : 0.3;
            const lumpSum = month === 'dec' ? 600 : 0;
            const interesesPareja = month === 'dec' ? 440 : 0;
            
            const monthTotal = salario + consultoria + cobros + rendimientos + lumpSum + interesesPareja;
            monthlyTotals.push(monthTotal);
            yearTotal += monthTotal;
            
            // Update the corresponding income total cell
            const incomeCell = document.getElementById(`total-income-s1-2025-${month}`);
            if (incomeCell) {
                incomeCell.innerHTML = `<strong>${monthTotal.toFixed(1)}</strong>`;
            }
        });
        
        // Update year total
        const yearTotalCell = document.getElementById('total-income-s1-2025-year');
        if (yearTotalCell) {
            yearTotalCell.innerHTML = `<strong>${yearTotal.toFixed(1)}</strong>`;
        }
        
        // Recalculate net flow (income - expenses)
        const expensesByMonth = [8.8, 85.3, 78.6, 135.2, 91.4, 71.4, 81.4, 461.4];
        let yearNetFlowTotal = 0;
        
        months.forEach((month, index) => {
            const netFlow = monthlyTotals[index] - expensesByMonth[index];
            yearNetFlowTotal += netFlow;
            
            const netFlowCell = document.getElementById(`net-flow-s1-2025-${month}`);
            if (netFlowCell) {
                const sign = netFlow >= 0 ? '+' : '';
                netFlowCell.innerHTML = `<strong>${sign}${netFlow.toFixed(1)}</strong>`;
                netFlowCell.className = netFlow >= 0 ? 'positive' : 'negative';
            }
        });
        
        // Update year net flow
        const yearNetFlowCell = document.getElementById('net-flow-s1-2025-year');
        if (yearNetFlowCell) {
            const sign = yearNetFlowTotal >= 0 ? '+' : '';
            yearNetFlowCell.innerHTML = `<strong>${sign}${yearNetFlowTotal.toFixed(1)}</strong>`;
            yearNetFlowCell.className = yearNetFlowTotal >= 0 ? 'positive' : 'negative';
        }
        
        // Update charts if they exist
        updateChartsData();
        
        console.log('Calculations updated successfully');
        
    } catch (error) {
        console.error('Error updating calculations:', error);
    }
}

// ===== INPUT HANDLERS =====
function handleInputFocus(event) {
    event.target.parentElement.style.boxShadow = '0 0 10px rgba(255, 193, 7, 0.5)';
    event.target.select();
}

function handleInputBlur(event) {
    event.target.parentElement.style.boxShadow = '';
    
    // Validate input value
    const value = parseFloat(event.target.value);
    if (isNaN(value) || value < 0) {
        event.target.value = 0;
        updateCalculations();
    }
}

// ===== KEYBOARD NAVIGATION =====
function handleKeyboardNavigation(event) {
    // Tab navigation with Ctrl + number keys
    if (event.ctrlKey) {
        switch(event.keyCode) {
            case 49: // Ctrl + 1
                showTab('monthly-analysis');
                break;
            case 50: // Ctrl + 2
                showTab('waterfall-charts');
                break;
            case 51: // Ctrl + 3
                showTab('executive-summary');
                break;
            case 52: // Ctrl + 4
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
            // Initialize waterfall charts
            createWaterfallChart1_2025();
            createWaterfallChart2_2025();
            createWaterfallChart1_2026();
            createWaterfallChart2_2026();
            createComparisonChart();
            
            console.log('Charts initialized successfully');
        }, 100);
        
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// ===== INDIVIDUAL CHART CREATION FUNCTIONS =====
function createWaterfallChart1_2025() {
    const ctx = document.getElementById('waterfall1-2025');
    if (!ctx) return;

    const consultoriaTotal = currentData.scenario1.consultation.reduce((a, b) => a + b, 0);
    
    charts.waterfall1_2025 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Salario', 'Consultoría', 'Cobros/Finiquito', 'Rendimientos', 'Lump Sum 5M', 'Intereses Pareja', 'Gastos Personales', 'Pago Deudas', 'Meta Ahorro', 'Flujo Neto'],
            datasets: [{
                label: 'Miles MXN',
                data: [322.1, consultoriaTotal, 205.5, 2.3, 600.0, 440.0, -295.2, -118.3, -600.0, (322.1 + consultoriaTotal + 205.5 + 2.3 + 600.0 + 440.0 - 295.2 - 118.3 - 600.0)],
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
                    text: 'Flujo de Efectivo Anual 2025',
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
                        maxRotation: 45,
                        font: { size: 10 }
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
                    bottom: 10
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}

function createWaterfallChart2_2025() {
    const ctx = document.getElementById('waterfall2-2025');
    if (!ctx) return;
    
    charts.waterfall2_2025 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Salario', 'Nuevo Trabajo', 'Cobros/Finiquito', 'Rendimientos', 'Lump Sum 5M', 'Gastos Personales', 'Pago Deudas', 'Meta Ahorro', 'Flujo Neto'],
            datasets: [{
                label: 'Miles MXN',
                data: [322.1, 265.8, 205.5, 2.3, 600.0, -286.8, -118.3, -300.0, 690.6],
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
                    text: 'Flujo de Efectivo Anual 2025',
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
                        maxRotation: 45,
                        font: { size: 10 }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function createWaterfallChart1_2026() {
    const ctx = document.getElementById('waterfall1-2026');
    if (!ctx) return;
    
    charts.waterfall1_2026 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Superávit 2025', 'Intereses 5.35M', 'Smability', 'Gastos Vida', 'Flujo Neto'],
            datasets: [{
                label: 'Miles MXN',
                data: [140.4, 542.4, 331.0, -496.8, 517.0],
                backgroundColor: ['#28a745', '#28a745', '#28a745', '#dc3545', '#007bff'],
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
                    text: 'Flujo de Efectivo Anual 2026',
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
                        font: { size: 10 }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function createWaterfallChart2_2026() {
    const ctx = document.getElementById('waterfall2-2026');
    if (!ctx) return;
    
    charts.waterfall2_2026 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Nuevo Trabajo', 'Intereses Ahorro', 'Smability', 'Gastos Vida', 'Flujo Neto'],
            datasets: [{
                label: 'Miles MXN',
                data: [1063.2, 325.2, 90.0, -463.2, 1015.2],
                backgroundColor: ['#28a745', '#28a745', '#28a745', '#dc3545', '#007bff'],
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
                    text: 'Flujo de Efectivo Anual 2026',
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
                        font: { size: 10 }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function createComparisonChart() {
    const ctx = document.getElementById('comparison-chart');
    if (!ctx) return;
    
    // Calculate dynamic data for Scenario 1 based on current consultation values
    const consultoriaValues = currentData.scenario1.consultation;
    const scenario1_2025_data = [];
    const expensesByMonth = [8.8, 85.3, 78.6, 135.2, 91.4, 71.4, 81.4, 461.4];
    
    // Calculate 2025 net flows for Scenario 1
    const months_2025 = [40.3, 80.5, 80.5, 80.5, 40.3, 0, 0, 0]; // Salarios
    const cobros_2025 = [0, 22, 13.5, 0, 170, 0, 0, 0];
    const rendimientos_2025 = [0.2, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3];
    const lumpSum_2025 = [0, 0, 0, 0, 0, 0, 0, 600];
    const interesesPareja_2025 = [0, 0, 0, 0, 0, 0, 0, 440];
    
    for (let i = 0; i < 8; i++) {
        const income = months_2025[i] + consultoriaValues[i] + cobros_2025[i] + rendimientos_2025[i] + lumpSum_2025[i] + interesesPareja_2025[i];
        const netFlow = income - expensesByMonth[i];
        scenario1_2025_data.push(netFlow);
    }
    
    // 2026 data for Scenario 1 (static)
    const scenario1_2026_data = [20.5, 20.5, 30.5, 35.5, 40.5, 40.5, 45.5, 50.5, 55.5, 57.5, 59.5, 60.5];
    
    charts.comparison = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [
                'May 2025', 'Jun 2025', 'Jul 2025', 'Ago 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dic 2025',
                'Ene 2026', 'Feb 2026', 'Mar 2026', 'Abr 2026', 'May 2026', 'Jun 2026', 
                'Jul 2026', 'Ago 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dic 2026'
            ],
            datasets: [{
                label: 'Escenario 1: Consultoría',
                data: [...scenario1_2025_data, ...scenario1_2026_data],
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
                data: [31.7, 22.5, 25.7, -39.4, 144.2, 30.3, 25.3, 450.3, 82.1, 82.1, 85.1, 85.1, 85.1, 85.1, 85.1, 85.1, 85.1, 85.1, 85.1, 85.1],
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
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(0) + 'K';
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Período',
                        font: { size: 12, weight: 'bold' }
                    },
                    ticks: {
                        maxRotation: 45,
                        font: { size: 10 }
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
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}

// ===== CHART UPDATE FUNCTION =====
function updateChartsData() {
    try {
        // Update waterfall chart 1-2025 with new consultation data
        if (charts.waterfall1_2025) {
            const consultoriaTotal = currentData.scenario1.consultation.reduce((a, b) => a + b, 0);
            const newNetFlow = 322.1 + consultoriaTotal + 205.5 + 2.3 + 600.0 + 440.0 - 295.2 - 118.3 - 600.0;
            
            charts.waterfall1_2025.data.datasets[0].data[1] = consultoriaTotal;
            charts.waterfall1_2025.data.datasets[0].data[9] = newNetFlow;
            charts.waterfall1_2025.update('none');
        }
        
        // Update comparison chart with new data
        if (charts.comparison) {
            const consultoriaValues = currentData.scenario1.consultation;
            const scenario1_2025_data = [];
            const expensesByMonth = [8.8, 85.3, 78.6, 135.2, 91.4, 71.4, 81.4, 461.4];
            
            const months_2025 = [40.3, 80.5, 80.5, 80.5, 40.3, 0, 0, 0];
            const cobros_2025 = [0, 22, 13.5, 0, 170, 0, 0, 0];
            const rendimientos_2025 = [0.2, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3];
            const lumpSum_2025 = [0, 0, 0, 0, 0, 0, 0, 600];
            const interesesPareja_2025 = [0, 0, 0, 0, 0, 0, 0, 440];
            
            for (let i = 0; i < 8; i++) {
                const income = months_2025[i] + consultoriaValues[i] + cobros_2025[i] + rendimientos_2025[i] + lumpSum_2025[i] + interesesPareja_2025[i];
                const netFlow = income - expensesByMonth[i];
                scenario1_2025_data.push(netFlow);
            }
            
            const scenario1_2026_data = [20.5, 20.5, 30.5, 35.5, 40.5, 40.5, 45.5, 50.5, 55.5, 57.5, 59.5, 60.5];
            charts.comparison.data.datasets[0].data = [...scenario1_2025_data, ...scenario1_2026_data];
            charts.comparison.update('none');
        }
        
    } catch (error) {
        console.error('Error updating chart data:', error);
    }
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
            scenario1: {
                consultation: currentData.scenario1.consultation,
                calculations: getCurrentCalculations()
            }
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `cashflow-analysis-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('Data exported successfully');
        
    } catch (error) {
        console.error('Error exporting data:', error);
    }
}

function getCurrentCalculations() {
    const consultoriaInputs = document.querySelectorAll('#scenario1-2025 .editable input');
    const values = Array.from(consultoriaInputs).map(input => parseFloat(input.value) || 0);
    
    return {
        consultoriaValues: values,
        consultoriaTotal: values.reduce((a, b) => a + b, 0),
        lastUpdated: new Date().toISOString()
    };
}

function printReport() {
    try {
        // Hide navigation and show all content for printing
        const navTabs = document.querySelector('.nav-tabs');
        const tabContents = document.querySelectorAll('.tab-content');
        
        if (navTabs) navTabs.style.display = 'none';
        tabContents.forEach(tab => {
            tab.classList.add('active');
            tab.style.display = 'block';
        });
        
        window.print();
        
        // Restore navigation after printing
        setTimeout(() => {
            if (navTabs) navTabs.style.display = 'flex';
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

// ===== ERROR HANDLING =====
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    // Show user-friendly error message
    if (event.error && event.error.message) {
        showNotification('Error: ' + event.error.message, 'error');
    }
});

function showNotification(message, type = 'info') {
    try {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

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

// ===== BROWSER COMPATIBILITY CHECK =====
function checkBrowserCompatibility() {
    const features = {
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid'),
        customProperties: CSS.supports('--custom-property', 'value'),
        es6: typeof Symbol !== 'undefined'
    };
    
    const unsupported = Object.keys(features).filter(feature => !features[feature]);
    
    if (unsupported.length > 0) {
        console.warn('Browser compatibility issues:', unsupported);
        showNotification('Su navegador puede no ser completamente compatible. Considere actualizar.', 'warning');
    }
    
    return unsupported.length === 0;
}

// ===== ACCESSIBILITY HELPERS =====
function enhanceAccessibility() {
    // Add ARIA labels to interactive elements
    const editableInputs = document.querySelectorAll('.editable input');
    editableInputs.forEach((input, index) => {
        input.setAttribute('aria-label', `Consultoría mes ${index + 1}`);
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
        if (event.altKey) {
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
    checkBrowserCompatibility();
    enhanceAccessibility();
    
    // Add version info to console
    console.log('Cash Flow Analysis Tool v1.0.0 - Initialized Successfully');
    console.log('For support, press Alt to see keyboard shortcuts');
});

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.CashFlowApp = {
    showTab,
    updateCalculations,
    exportData,
    printReport,
    getCurrentCalculations,
    formatCurrency,
    formatNumber
};
