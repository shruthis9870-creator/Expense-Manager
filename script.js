/**
 * ==============================================================================
 * EXPENSELY - PERSONAL EXPENSE TRACKER
 * Vanilla JavaScript Core Engine
 * ==============================================================================
 */

// Strict mode for cleaner and safer code execution
'use strict';

/* ==============================================================================
   1. CONSTANTS & CATEGORY DEFINITIONS
   ============================================================================== */

const EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', icon: 'utensils', color: '#F97316' },
  { name: 'Transportation', icon: 'car', color: '#0EA5E9' },
  { name: 'Shopping', icon: 'shopping-bag', color: '#EC4899' },
  { name: 'Entertainment', icon: 'film', color: '#8B5CF6' },
  { name: 'Education', icon: 'graduation-cap', color: '#3B82F6' },
  { name: 'Health', icon: 'heart-pulse', color: '#EF4444' },
  { name: 'Bills & Utilities', icon: 'zap', color: '#EAB308' },
  { name: 'Groceries', icon: 'shopping-cart', color: '#10B981' },
  { name: 'Travel', icon: 'plane', color: '#06B6D4' },
  { name: 'Personal Care', icon: 'smile', color: '#F43F5E' },
  { name: 'Other', icon: 'tag', color: '#64748B' }
];

const INCOME_CATEGORIES = [
  { name: 'Salary', icon: 'briefcase', color: '#16A36A' },
  { name: 'Freelance', icon: 'laptop', color: '#0D9488' },
  { name: 'Allowance', icon: 'gift', color: '#6366F1' },
  { name: 'Scholarship', icon: 'award', color: '#8B5CF6' },
  { name: 'Business', icon: 'trending-up', color: '#2563EB' },
  { name: 'Other', icon: 'plus-circle', color: '#64748B' }
];

const STORAGE_KEYS = {
  TRANSACTIONS: 'expensely_transactions',
  THEME: 'expensely_theme',
  SEEDED: 'expensely_seeded'
};

/* ==============================================================================
   2. APPLICATION STATE
   ============================================================================== */

const state = {
  transactions: [],
  currentView: 'dashboard',
  selectedMonth: new Date().getMonth(),      // 0 - 11
  selectedYear: new Date().getFullYear(),
  analyticsMonth: new Date().getMonth(),
  analyticsYear: new Date().getFullYear(),
  theme: 'light',
  editingTxId: null,
  deleteTxId: null,
  charts: {
    dashboardCategory: null,
    monthlyTrend: null,
    analyticsCategory: null
  },
  filters: {
    search: '',
    type: 'all',
    category: 'all',
    datePeriod: 'all',
    startDate: '',
    endDate: ''
  }
};

/* ==============================================================================
   3. DOM ELEMENT REFERENCES
   ============================================================================== */

const DOM = {
  // Navigation & Layout
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay'),
  menuToggleBtn: document.getElementById('menu-toggle-btn'),
  closeSidebarBtn: document.getElementById('close-sidebar-btn'),
  navLinks: document.querySelectorAll('.nav-link'),
  views: document.querySelectorAll('.app-view'),
  currentPageTitle: document.getElementById('current-page-title'),
  currentDateDisplay: document.getElementById('current-date-display'),
  sidebarBalance: document.getElementById('sidebar-balance'),
  sidebarAddBtn: document.getElementById('sidebar-add-btn'),

  // Search & Notifications
  topbarSearchInput: document.getElementById('topbar-search-input'),
  topbarSearchClear: document.getElementById('topbar-search-clear'),
  notificationsBtn: document.getElementById('notifications-btn'),
  notificationsPanel: document.getElementById('notifications-panel'),
  clearNotificationsBtn: document.getElementById('clear-notifications-btn'),
  notificationBadge: document.getElementById('notification-badge'),
  toastContainer: document.getElementById('toast-container'),

  // Dashboard View Elements
  greetingTitle: document.getElementById('greeting-title'),
  welcomeMonthYear: document.getElementById('welcome-month-year'),
  monthSelect: document.getElementById('month-select'),
  yearSelect: document.getElementById('year-select'),
  prevMonthBtn: document.getElementById('prev-month-btn'),
  nextMonthBtn: document.getElementById('next-month-btn'),
  currentMonthBtn: document.getElementById('current-month-btn'),
  quickAddExpenseBtn: document.getElementById('quick-add-expense-btn'),
  quickAddIncomeBtn: document.getElementById('quick-add-income-btn'),
  dashboardViewAllBtn: document.getElementById('dashboard-view-all-btn'),
  viewAllTransactionsLink: document.getElementById('view-all-transactions-link'),
  dashExportCsvBtn: document.getElementById('dash-export-csv-btn'),
  dashGotoAnalyticsBtn: document.getElementById('dash-goto-analytics-btn'),
  dashChartMonthLabel: document.getElementById('dash-chart-month-label'),

  // Summary Cards
  cardTotalBalance: document.getElementById('card-total-balance'),
  cardTotalIncome: document.getElementById('card-total-income'),
  cardTotalExpenses: document.getElementById('card-total-expenses'),
  cardMonthlySpending: document.getElementById('card-monthly-spending'),
  cardMonthlySubtitle: document.getElementById('card-monthly-subtitle'),

  // Dashboard Tables & Charts
  dashboardTbody: document.getElementById('dashboard-transactions-tbody'),
  dashboardEmptyState: document.getElementById('dashboard-empty-state'),
  dashCategoryChartCanvas: document.getElementById('dashboardCategoryChart'),
  dashChartEmpty: document.getElementById('dash-chart-empty'),
  dashCategoryLegend: document.getElementById('dash-category-legend'),

  // Transactions View Elements
  allTransactionsTbody: document.getElementById('all-transactions-tbody'),
  allEmptyState: document.getElementById('all-empty-state'),
  filterSearchInput: document.getElementById('filter-search-input'),
  filterTypeSelect: document.getElementById('filter-type-select'),
  filterCategorySelect: document.getElementById('filter-category-select'),
  filterDateSelect: document.getElementById('filter-date-select'),
  customDateContainer: document.getElementById('custom-date-container'),
  filterStartDate: document.getElementById('filter-start-date'),
  filterEndDate: document.getElementById('filter-end-date'),
  filterResultsCounter: document.getElementById('filter-results-counter'),
  clearFiltersBtn: document.getElementById('clear-filters-btn'),
  emptyClearFiltersBtn: document.getElementById('empty-clear-filters-btn'),
  transactionsExportBtn: document.getElementById('transactions-export-btn'),

  // Analytics View Elements
  analyticsMonthSelect: document.getElementById('analytics-month-select'),
  analyticsYearSelect: document.getElementById('analytics-year-select'),
  analyticsMonthSpend: document.getElementById('analytics-month-spend'),
  analyticsMonthNameBadge: document.getElementById('analytics-month-name-badge'),
  analyticsTopCategory: document.getElementById('analytics-top-category'),
  analyticsTopCategoryAmount: document.getElementById('analytics-top-category-amount'),
  analyticsSavingsRate: document.getElementById('analytics-savings-rate'),
  analyticsDoughnutSubtitle: document.getElementById('analytics-doughnut-subtitle'),
  monthlyTrendChartCanvas: document.getElementById('monthlyTrendChart'),
  analyticsCategoryChartCanvas: document.getElementById('analyticsCategoryChart'),
  analyticsChartEmpty: document.getElementById('analytics-chart-empty'),
  analyticsCategoryLegend: document.getElementById('analytics-category-legend'),
  categoryBreakdownTbody: document.getElementById('category-breakdown-tbody'),

  // Settings View Elements
  themeLightBtn: document.getElementById('theme-light-btn'),
  themeDarkBtn: document.getElementById('theme-dark-btn'),
  settingsExportCsvBtn: document.getElementById('settings-export-csv-btn'),
  settingsLoadSampleBtn: document.getElementById('settings-load-sample-btn'),
  settingsClearDataBtn: document.getElementById('settings-clear-data-btn'),
  settingsStorageCount: document.getElementById('settings-storage-count'),

  // Add / Edit Modal Elements
  transactionModal: document.getElementById('transaction-modal'),
  modalTitle: document.getElementById('modal-title'),
  modalSubtitle: document.getElementById('modal-subtitle'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalCancelBtn: document.getElementById('modal-cancel-btn'),
  transactionForm: document.getElementById('transaction-form'),
  txIdInput: document.getElementById('tx-id'),
  txTypeInput: document.getElementById('tx-type'),
  typeBtns: document.querySelectorAll('.type-btn'),
  txTitleInput: document.getElementById('tx-title'),
  txTitleError: document.getElementById('tx-title-error'),
  txAmountInput: document.getElementById('tx-amount'),
  txAmountError: document.getElementById('tx-amount-error'),
  txDateInput: document.getElementById('tx-date'),
  txDateError: document.getElementById('tx-date-error'),
  txCategorySelect: document.getElementById('tx-category'),
  txCategoryError: document.getElementById('tx-category-error'),
  txNotesInput: document.getElementById('tx-notes'),

  // Delete Modal Elements
  deleteModal: document.getElementById('delete-modal'),
  deleteModalMsg: document.getElementById('delete-modal-msg'),
  deleteCancelBtn: document.getElementById('delete-cancel-btn'),
  deleteConfirmBtn: document.getElementById('delete-confirm-btn'),

  // Clear All Modal Elements
  clearAllModal: document.getElementById('clear-all-modal'),
  clearCancelBtn: document.getElementById('clear-cancel-btn'),
  clearConfirmBtn: document.getElementById('clear-confirm-btn')
};

/* ==============================================================================
   4. UTILITY FUNCTIONS (Currency, Date, Helpers)
   ============================================================================== */

/**
 * Format numbers into Indian Rupee (₹) format.
 * Shows decimals only when there are fractional paise.
 */
function formatCurrency(amount) {
  const num = Number(amount) || 0;
  const isWhole = num % 1 === 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2
  }).format(num);
}

/**
 * Formats a Date object or YYYY-MM-DD string to a readable format (e.g. 24 Oct, 2026).
 */
function formatDate(dateInput) {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Returns today's date formatted as YYYY-MM-DD for date input defaults.
 */
function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get category metadata (icon and color) by category name.
 */
function getCategoryMeta(categoryName, type = 'expense') {
  const pool = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const found = pool.find(c => c.name.toLowerCase() === (categoryName || '').toLowerCase());
  if (found) return found;

  // Fallback to checking the other pool
  const fallbackPool = type === 'income' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const fallbackFound = fallbackPool.find(c => c.name.toLowerCase() === (categoryName || '').toLowerCase());
  return fallbackFound || { name: categoryName || 'Other', icon: 'tag', color: '#64748B' };
}

/**
 * Refreshes all Lucide icons on screen.
 */
function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/**
 * Displays an animated toast notification.
 */
function showToast(message, type = 'success') {
  if (!DOM.toastContainer) return;

  const iconName = type === 'success' ? 'check-circle' : (type === 'error' ? 'alert-circle' : 'info');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <span class="toast-msg">${escapeHtml(message)}</span>
    <button class="toast-close-btn" aria-label="Dismiss toast">
      <i data-lucide="x"></i>
    </button>
  `;

  DOM.toastContainer.appendChild(toast);
  refreshIcons();

  const closeBtn = toast.querySelector('.toast-close-btn');
  const dismissToast = () => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 250);
  };

  closeBtn.addEventListener('click', dismissToast);
  setTimeout(dismissToast, 4000);
}

/**
 * Prevent XSS attacks when rendering text strings.
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==============================================================================
   5. LOCAL STORAGE MANAGEMENT
   ============================================================================== */

/**
 * Loads transactions from browser Local Storage.
 */
function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse transactions from LocalStorage:', error);
    showToast('Failed to load saved transactions from storage', 'error');
    return [];
  }
}

/**
 * Saves transactions to browser Local Storage.
 */
function saveTransactions(transactions) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    updateStorageCountDisplay();
    return true;
  } catch (error) {
    console.error('Failed to save transactions to LocalStorage:', error);
    showToast('Could not save data to browser storage', 'error');
    return false;
  }
}

/**
 * Update storage counter in Settings view.
 */
function updateStorageCountDisplay() {
  if (DOM.settingsStorageCount) {
    const count = state.transactions.length;
    DOM.settingsStorageCount.textContent = `${count} transaction${count === 1 ? '' : 's'} stored`;
  }
}

/**
 * Seed realistic sample data if the user is visiting for the first time.
 */
function checkAndSeedSampleData() {
  const hasSeeded = localStorage.getItem(STORAGE_KEYS.SEEDED);
  if (!hasSeeded) {
    loadSampleData(false);
    localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
  } else {
    state.transactions = loadTransactions();
  }
}

/**
 * Generates sample data spanning the current and previous months.
 */
function loadSampleData(showNotification = true) {
  const now = new Date();
  const curY = now.getFullYear();
  const curM = now.getMonth();

  const pad = (n) => String(n).padStart(2, '0');
  const makeDate = (year, monthIndex, day) => `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

  // Helper to get past month offset
  const getPastMonth = (offset) => {
    let m = curM - offset;
    let y = curY;
    while (m < 0) {
      m += 12;
      y -= 1;
    }
    return { year: y, month: m };
  };

  const sampleData = [
    // Current Month Transactions
    {
      id: 'tx_seed_1',
      title: 'Monthly Salary',
      amount: 85000,
      type: 'income',
      category: 'Salary',
      date: makeDate(curY, curM, 1),
      notes: 'Direct bank deposit from employer'
    },
    {
      id: 'tx_seed_2',
      title: 'House Rent & Maintenance',
      amount: 22000,
      type: 'expense',
      category: 'Bills & Utilities',
      date: makeDate(curY, curM, 3),
      notes: 'UPI transfer to landlord'
    },
    {
      id: 'tx_seed_3',
      title: 'Organic Groceries & Staples',
      amount: 5420,
      type: 'expense',
      category: 'Groceries',
      date: makeDate(curY, curM, 6),
      notes: 'Nature Basket weekly purchase'
    },
    {
      id: 'tx_seed_4',
      title: 'Freelance Web Design',
      amount: 24500,
      type: 'income',
      category: 'Freelance',
      date: makeDate(curY, curM, 10),
      notes: 'Payment for landing page development'
    },
    {
      id: 'tx_seed_5',
      title: 'Dinner at Olive Bistro',
      amount: 3200,
      type: 'expense',
      category: 'Food & Dining',
      date: makeDate(curY, curM, 12),
      notes: 'Family dinner celebration'
    },
    {
      id: 'tx_seed_6',
      title: 'Electricity & Broadband Bill',
      amount: 2850,
      type: 'expense',
      category: 'Bills & Utilities',
      date: makeDate(curY, curM, 15),
      notes: 'Tata Power & Jio Fiber'
    },
    {
      id: 'tx_seed_7',
      title: 'Uber Cab Rides',
      amount: 1450,
      type: 'expense',
      category: 'Transportation',
      date: makeDate(curY, curM, 18),
      notes: 'Office commute trips'
    },
    {
      id: 'tx_seed_8',
      title: 'Amazon Festival Shopping',
      amount: 4890,
      type: 'expense',
      category: 'Shopping',
      date: makeDate(curY, curM, 21),
      notes: 'Desk ergonomic accessories'
    },
    {
      id: 'tx_seed_9',
      title: 'Weekend Cinema & Popcorn',
      amount: 1200,
      type: 'expense',
      category: 'Entertainment',
      date: makeDate(curY, curM, 24),
      notes: 'IMAX movie night'
    },
    {
      id: 'tx_seed_10',
      title: 'Pharmacy & Wellness Checkup',
      amount: 1950,
      type: 'expense',
      category: 'Health',
      date: makeDate(curY, curM, 26),
      notes: 'Apollo pharmacy'
    }
  ];

  // Historical expenses across past 6 months to give rich charts
  for (let offset = 1; offset <= 6; offset++) {
    const { year, month } = getPastMonth(offset);
    sampleData.push(
      {
        id: `tx_hist_sal_${offset}`,
        title: 'Monthly Salary',
        amount: 80000 + (offset * 500),
        type: 'income',
        category: 'Salary',
        date: makeDate(year, month, 1),
        notes: 'Monthly pay'
      },
      {
        id: `tx_hist_rent_${offset}`,
        title: 'House Rent',
        amount: 22000,
        type: 'expense',
        category: 'Bills & Utilities',
        date: makeDate(year, month, 3),
        notes: 'Monthly rent'
      },
      {
        id: `tx_hist_groc_${offset}`,
        title: 'Supermarket Groceries',
        amount: 4500 + (offset * 320),
        type: 'expense',
        category: 'Groceries',
        date: makeDate(year, month, 8),
        notes: 'Monthly groceries'
      },
      {
        id: `tx_hist_dine_${offset}`,
        title: 'Dining & Takeout',
        amount: 2800 + (offset * 180),
        type: 'expense',
        category: 'Food & Dining',
        date: makeDate(year, month, 15),
        notes: 'Food deliveries'
      },
      {
        id: `tx_hist_trans_${offset}`,
        title: 'Metro & Fuel',
        amount: 1500 + (offset * 120),
        type: 'expense',
        category: 'Transportation',
        date: makeDate(year, month, 22),
        notes: 'Commute'
      }
    );
  }

  state.transactions = sampleData;
  saveTransactions(state.transactions);
  updateDashboard();

  if (showNotification) {
    showToast('Demo transactions loaded successfully!', 'success');
  }
}

/* ==============================================================================
   6. FINANCIAL CALCULATIONS
   ============================================================================== */

/**
 * Calculates total income from all transactions.
 */
function calculateTotalIncome(transactions = state.transactions) {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

/**
 * Calculates total expenses from all transactions.
 */
function calculateTotalExpenses(transactions = state.transactions) {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

/**
 * Calculates net balance (Total Income - Total Expenses).
 */
function calculateBalance(transactions = state.transactions) {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
}

/**
 * Calculates total expenses for a specific month and year.
 */
function calculateMonthlySpending(month, year, transactions = state.transactions) {
  return transactions
    .filter(t => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

/**
 * Calculates total income for a specific month and year.
 */
function calculateMonthlyIncome(month, year, transactions = state.transactions) {
  return transactions
    .filter(t => {
      if (t.type !== 'income') return false;
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

/**
 * Aggregates expense totals grouped by category for a selected month and year.
 */
function calculateCategoryTotals(month, year, transactions = state.transactions) {
  const categoryMap = {};

  transactions.forEach(t => {
    if (t.type !== 'expense') return;
    const d = new Date(t.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const cat = t.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(t.amount || 0);
    }
  });

  const totalMonthExpense = Object.values(categoryMap).reduce((a, b) => a + b, 0);

  return Object.keys(categoryMap).map(categoryName => {
    const meta = getCategoryMeta(categoryName, 'expense');
    const amount = categoryMap[categoryName];
    const percentage = totalMonthExpense > 0 ? (amount / totalMonthExpense) * 100 : 0;
    return {
      name: categoryName,
      amount,
      percentage: Number(percentage.toFixed(1)),
      icon: meta.icon,
      color: meta.color
    };
  }).sort((a, b) => b.amount - a.amount);
}

/* ==============================================================================
   7. DASHBOARD & SUMMARY CARDS UPDATE
   ============================================================================== */

/**
 * Master update function to re-render all dashboard components.
 */
function updateDashboard() {
  // Update Topbar Greeting & Date
  updateGreeting();

  // Calculate high-level financial metrics
  const totalBalance = calculateBalance();
  const totalIncome = calculateTotalIncome();
  const totalExpenses = calculateTotalExpenses();
  const monthlySpending = calculateMonthlySpending(state.selectedMonth, state.selectedYear);

  // Update Summary Cards
  if (DOM.cardTotalBalance) {
    DOM.cardTotalBalance.textContent = formatCurrency(totalBalance);
    DOM.cardTotalBalance.className = `card-value ${totalBalance >= 0 ? 'text-income' : 'text-expenses'}`;
  }
  if (DOM.cardTotalIncome) {
    DOM.cardTotalIncome.textContent = formatCurrency(totalIncome);
  }
  if (DOM.cardTotalExpenses) {
    DOM.cardTotalExpenses.textContent = formatCurrency(totalExpenses);
  }
  if (DOM.cardMonthlySpending) {
    DOM.cardMonthlySpending.textContent = formatCurrency(monthlySpending);
  }
  if (DOM.sidebarBalance) {
    DOM.sidebarBalance.textContent = formatCurrency(totalBalance);
    DOM.sidebarBalance.className = `balance-amount ${totalBalance >= 0 ? 'text-income' : 'text-expenses'}`;
  }

  // Update Month Subtitles
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const selectedMonthText = `${monthNames[state.selectedMonth]} ${state.selectedYear}`;

  if (DOM.welcomeMonthYear) {
    DOM.welcomeMonthYear.textContent = selectedMonthText;
  }
  if (DOM.cardMonthlySubtitle) {
    DOM.cardMonthlySubtitle.textContent = `Spent in ${selectedMonthText}`;
  }
  if (DOM.dashChartMonthLabel) {
    DOM.dashChartMonthLabel.textContent = selectedMonthText;
  }

  // Render Recent Transactions (Top 5) on Dashboard
  renderRecentTransactions();

  // Render Charts & Legends
  renderCharts();

  // Render Full Transactions Table & Filters
  renderTransactions();

  // Render Analytics View
  renderAnalytics();

  // Update Settings Storage Count
  updateStorageCountDisplay();

  // Refresh dynamic icons
  refreshIcons();
}

/**
 * Updates dynamic greeting based on system time of day.
 */
function updateGreeting() {
  const now = new Date();
  const hours = now.getHours();
  let greeting = 'Good morning!';

  if (hours >= 12 && hours < 17) {
    greeting = 'Good afternoon!';
  } else if (hours >= 17) {
    greeting = 'Good evening!';
  }

  if (DOM.greetingTitle) {
    DOM.greetingTitle.textContent = greeting;
  }

  if (DOM.currentDateDisplay) {
    DOM.currentDateDisplay.textContent = now.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

/* ==============================================================================
   8. TRANSACTION LISTS RENDERING
   ============================================================================== */

/**
 * Renders the top 5 most recent transactions on the Dashboard view.
 */
function renderRecentTransactions() {
  if (!DOM.dashboardTbody) return;

  const sorted = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recent = sorted.slice(0, 5);

  if (recent.length === 0) {
    DOM.dashboardTbody.innerHTML = '';
    if (DOM.dashboardEmptyState) DOM.dashboardEmptyState.classList.remove('hidden');
    return;
  }

  if (DOM.dashboardEmptyState) DOM.dashboardEmptyState.classList.add('hidden');

  DOM.dashboardTbody.innerHTML = recent.map(tx => createTransactionRowHtml(tx)).join('');
}

/**
 * Helper to build single transaction table row HTML.
 */
function createTransactionRowHtml(tx) {
  const isIncome = tx.type === 'income';
  const meta = getCategoryMeta(tx.category, tx.type);
  const sign = isIncome ? '+' : '-';
  const amountClass = isIncome ? 'text-income' : 'text-expenses';
  const badgeClass = isIncome ? 'badge-income' : 'badge-expense';

  return `
    <tr data-id="${tx.id}">
      <td>
        <div class="tx-cell-title">
          <div class="tx-cat-icon" style="color: ${meta.color}; border-color: ${meta.color}33;">
            <i data-lucide="${meta.icon}"></i>
          </div>
          <div>
            <span class="tx-name">${escapeHtml(tx.title)}</span>
            ${tx.notes ? `<span class="tx-notes-preview" title="${escapeHtml(tx.notes)}">${escapeHtml(tx.notes)}</span>` : ''}
          </div>
        </div>
      </td>
      <td>
        <span class="badge badge-category">
          <i data-lucide="${meta.icon}"></i>
          <span>${escapeHtml(tx.category)}</span>
        </span>
      </td>
      <td>${formatDate(tx.date)}</td>
      <td>
        <span class="badge ${badgeClass}">
          ${isIncome ? 'Income' : 'Expense'}
        </span>
      </td>
      <td class="${amountClass}" style="font-weight: 700;">
        ${sign}${formatCurrency(tx.amount)}
      </td>
      <td>
        <div class="row-actions">
          <button class="row-action-btn btn-edit" onclick="openEditModal('${tx.id}')" title="Edit transaction">
            <i data-lucide="edit-2"></i>
          </button>
          <button class="row-action-btn btn-delete" onclick="openDeleteModal('${tx.id}')" title="Delete transaction">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Filter transactions based on active search & filter toolbar controls.
 */
function filterTransactions() {
  const { search, type, category, datePeriod, startDate, endDate } = state.filters;

  return state.transactions.filter(tx => {
    // 1. Search Query
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = (tx.title || '').toLowerCase().includes(q);
      const matchCat = (tx.category || '').toLowerCase().includes(q);
      const matchNotes = (tx.notes || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchNotes) return false;
    }

    // 2. Type Filter
    if (type !== 'all' && tx.type !== type) {
      return false;
    }

    // 3. Category Filter
    if (category !== 'all' && (tx.category || '').toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    // 4. Date Period Filter
    const txDate = new Date(tx.date);
    const now = new Date();

    if (datePeriod === 'this-month') {
      if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) {
        return false;
      }
    } else if (datePeriod === 'last-month') {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const lastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      if (txDate.getMonth() !== lastMonth || txDate.getFullYear() !== lastYear) {
        return false;
      }
    } else if (datePeriod === 'custom') {
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (txDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (txDate > end) return false;
      }
    }

    return true;
  });
}

/**
 * Renders the full transactions table under the Transactions view.
 */
function renderTransactions() {
  if (!DOM.allTransactionsTbody) return;

  const filtered = filterTransactions().sort((a, b) => new Date(b.date) - new Date(a.date));

  // Update results counter badge
  if (DOM.filterResultsCounter) {
    const total = state.transactions.length;
    DOM.filterResultsCounter.textContent = `Showing ${filtered.length} of ${total} transaction${total === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    DOM.allTransactionsTbody.innerHTML = '';
    if (DOM.allEmptyState) DOM.allEmptyState.classList.remove('hidden');
    return;
  }

  if (DOM.allEmptyState) DOM.allEmptyState.classList.add('hidden');

  DOM.allTransactionsTbody.innerHTML = filtered.map(tx => createTransactionRowHtml(tx)).join('');
}

/* ==============================================================================
   9. CHARTS RENDERING (Chart.js)
   ============================================================================== */

/**
 * Master chart render function that updates all 3 charts across views.
 */
function renderCharts() {
  renderDashboardCategoryChart();
  renderMonthlyTrendChart();
  renderAnalyticsCategoryChart();
}

/**
 * Returns theme-aware colors for Chart.js text, gridlines, and backgrounds.
 */
function getChartThemeColors() {
  const isDark = state.theme === 'dark';
  return {
    textColor: isDark ? '#94A3B8' : '#788391',
    gridColor: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(233, 237, 240, 0.8)',
    cardBg: isDark ? '#1E293B' : '#FFFFFF',
    tooltipBg: isDark ? '#0F172A' : '#1E293B',
    tooltipText: '#FFFFFF'
  };
}

/**
 * 1. Category Doughnut Chart on Dashboard View.
 */
function renderDashboardCategoryChart() {
  if (!DOM.dashCategoryChartCanvas) return;

  const categoryTotals = calculateCategoryTotals(state.selectedMonth, state.selectedYear);
  const theme = getChartThemeColors();

  if (state.charts.dashboardCategory) {
    state.charts.dashboardCategory.destroy();
    state.charts.dashboardCategory = null;
  }

  // If no expenses in this month
  if (categoryTotals.length === 0) {
    DOM.dashCategoryChartCanvas.style.display = 'none';
    if (DOM.dashChartEmpty) DOM.dashChartEmpty.classList.remove('hidden');
    if (DOM.dashCategoryLegend) DOM.dashCategoryLegend.innerHTML = '';
    return;
  }

  DOM.dashCategoryChartCanvas.style.display = 'block';
  if (DOM.dashChartEmpty) DOM.dashChartEmpty.classList.add('hidden');

  const labels = categoryTotals.map(c => c.name);
  const data = categoryTotals.map(c => c.amount);
  const colors = categoryTotals.map(c => c.color);

  state.charts.dashboardCategory = new Chart(DOM.dashCategoryChartCanvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor: theme.cardBg,
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: theme.tooltipBg,
          titleColor: theme.tooltipText,
          bodyColor: theme.tooltipText,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => {
              const val = ctx.raw || 0;
              const total = data.reduce((a, b) => a + b, 0);
              const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
              return ` ${ctx.label}: ${formatCurrency(val)} (${pct}%)`;
            }
          }
        }
      },
      cutout: '68%'
    }
  });

  // Render custom HTML legend
  renderLegendHtml(DOM.dashCategoryLegend, categoryTotals);
}

/**
 * 2. 7-Month Expense Trend Bar Chart (Analytics View).
 */
function renderMonthlyTrendChart() {
  if (!DOM.monthlyTrendChartCanvas) return;

  const theme = getChartThemeColors();

  if (state.charts.monthlyTrend) {
    state.charts.monthlyTrend.destroy();
    state.charts.monthlyTrend = null;
  }

  // Calculate past 6 months + current month
  const monthLabels = [];
  const expenseValues = [];
  const now = new Date();
  const curY = now.getFullYear();
  const curM = now.getMonth();

  const shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 6; i >= 0; i--) {
    let m = curM - i;
    let y = curY;
    while (m < 0) {
      m += 12;
      y -= 1;
    }
    const label = `${shortMonthNames[m]} ${y !== curY ? `'${String(y).slice(-2)}` : ''}`;
    monthLabels.push(label);
    const spend = calculateMonthlySpending(m, y);
    expenseValues.push(spend);
  }

  state.charts.monthlyTrend = new Chart(DOM.monthlyTrendChartCanvas, {
    type: 'bar',
    data: {
      labels: monthLabels,
      datasets: [{
        label: 'Expenses (₹)',
        data: expenseValues,
        backgroundColor: '#E65B5B',
        hoverBackgroundColor: '#D04848',
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.55
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: theme.tooltipBg,
          titleColor: theme.tooltipText,
          bodyColor: theme.tooltipText,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => ` Expenses: ${formatCurrency(ctx.raw || 0)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: theme.textColor, font: { family: 'Inter', size: 12 } }
        },
        y: {
          grid: { color: theme.gridColor, drawBorder: false },
          ticks: {
            color: theme.textColor,
            font: { family: 'Inter', size: 11 },
            callback: (val) => {
              if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
              if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
              return `₹${val}`;
            }
          }
        }
      }
    }
  });
}

/**
 * 3. Category-wise Spending Doughnut Chart (Analytics View).
 */
function renderAnalyticsCategoryChart() {
  if (!DOM.analyticsCategoryChartCanvas) return;

  const categoryTotals = calculateCategoryTotals(state.analyticsMonth, state.analyticsYear);
  const theme = getChartThemeColors();

  if (state.charts.analyticsCategory) {
    state.charts.analyticsCategory.destroy();
    state.charts.analyticsCategory = null;
  }

  if (categoryTotals.length === 0) {
    DOM.analyticsCategoryChartCanvas.style.display = 'none';
    if (DOM.analyticsChartEmpty) DOM.analyticsChartEmpty.classList.remove('hidden');
    if (DOM.analyticsCategoryLegend) DOM.analyticsCategoryLegend.innerHTML = '';
    return;
  }

  DOM.analyticsCategoryChartCanvas.style.display = 'block';
  if (DOM.analyticsChartEmpty) DOM.analyticsChartEmpty.classList.add('hidden');

  const labels = categoryTotals.map(c => c.name);
  const data = categoryTotals.map(c => c.amount);
  const colors = categoryTotals.map(c => c.color);

  state.charts.analyticsCategory = new Chart(DOM.analyticsCategoryChartCanvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor: theme.cardBg,
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: theme.tooltipBg,
          titleColor: theme.tooltipText,
          bodyColor: theme.tooltipText,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => {
              const val = ctx.raw || 0;
              const total = data.reduce((a, b) => a + b, 0);
              const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
              return ` ${ctx.label}: ${formatCurrency(val)} (${pct}%)`;
            }
          }
        }
      },
      cutout: '68%'
    }
  });

  renderLegendHtml(DOM.analyticsCategoryLegend, categoryTotals);
}

/**
 * Builds HTML legend for Doughnut charts.
 */
function renderLegendHtml(container, categoryTotals) {
  if (!container) return;
  container.innerHTML = categoryTotals.map(c => `
    <div class="legend-item">
      <div class="legend-info">
        <span class="legend-color-dot" style="background-color: ${c.color}"></span>
        <span>${escapeHtml(c.name)}</span>
      </div>
      <div class="legend-values">
        <span>${formatCurrency(c.amount)}</span>
        <span class="legend-pct">${c.percentage}%</span>
      </div>
    </div>
  `).join('');
}

/* ==============================================================================
   10. ANALYTICS VIEW RENDERING
   ============================================================================== */

/**
 * Renders KPIs and breakdown table in Analytics view.
 */
function renderAnalytics() {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthStr = `${monthNames[state.analyticsMonth]} ${state.analyticsYear}`;

  if (DOM.analyticsMonthNameBadge) DOM.analyticsMonthNameBadge.textContent = monthStr;
  if (DOM.analyticsDoughnutSubtitle) DOM.analyticsDoughnutSubtitle.textContent = `Expense share for ${monthStr}`;

  // Calculate monthly KPIs
  const monthSpend = calculateMonthlySpending(state.analyticsMonth, state.analyticsYear);
  const monthIncome = calculateMonthlyIncome(state.analyticsMonth, state.analyticsYear);
  const categoryTotals = calculateCategoryTotals(state.analyticsMonth, state.analyticsYear);

  if (DOM.analyticsMonthSpend) {
    DOM.analyticsMonthSpend.textContent = formatCurrency(monthSpend);
  }

  // Top Category
  if (DOM.analyticsTopCategory && DOM.analyticsTopCategoryAmount) {
    if (categoryTotals.length > 0) {
      DOM.analyticsTopCategory.textContent = categoryTotals[0].name;
      DOM.analyticsTopCategoryAmount.textContent = `${formatCurrency(categoryTotals[0].amount)} spent`;
    } else {
      DOM.analyticsTopCategory.textContent = 'None';
      DOM.analyticsTopCategoryAmount.textContent = '₹0 spent';
    }
  }

  // Savings rate
  if (DOM.analyticsSavingsRate) {
    if (monthIncome > 0) {
      const retained = Math.max(0, monthIncome - monthSpend);
      const rate = ((retained / monthIncome) * 100).toFixed(1);
      DOM.analyticsSavingsRate.textContent = `${rate}%`;
      DOM.analyticsSavingsRate.className = `kpi-value ${rate > 20 ? 'text-income' : 'text-expenses'}`;
    } else {
      DOM.analyticsSavingsRate.textContent = '0%';
      DOM.analyticsSavingsRate.className = 'kpi-value';
    }
  }

  // Category Breakdown Table
  if (DOM.categoryBreakdownTbody) {
    if (categoryTotals.length === 0) {
      DOM.categoryBreakdownTbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center" style="padding: 2rem; color: var(--text-muted);">
            No expenses found for ${monthStr}.
          </td>
        </tr>
      `;
      return;
    }

    // Count transactions per category
    const countMap = {};
    state.transactions.forEach(t => {
      if (t.type !== 'expense') return;
      const d = new Date(t.date);
      if (d.getMonth() === state.analyticsMonth && d.getFullYear() === state.analyticsYear) {
        countMap[t.category] = (countMap[t.category] || 0) + 1;
      }
    });

    DOM.categoryBreakdownTbody.innerHTML = categoryTotals.map(c => `
      <tr>
        <td>
          <div class="tx-cell-title">
            <span class="legend-color-dot" style="background-color: ${c.color}"></span>
            <span style="font-weight: 600;">${escapeHtml(c.name)}</span>
          </div>
        </td>
        <td>${countMap[c.name] || 0}</td>
        <td style="font-weight: 600;">${formatCurrency(c.amount)}</td>
        <td>${c.percentage}%</td>
        <td>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${c.percentage}%; background-color: ${c.color};"></div>
          </div>
        </td>
      </tr>
    `).join('');
  }
}

/* ==============================================================================
   11. TRANSACTION MODAL (ADD / EDIT)
   ============================================================================== */

/**
 * Populate category dropdown based on Expense or Income type.
 */
function populateCategorySelect(type = 'expense', selectedCategory = '') {
  if (!DOM.txCategorySelect) return;

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  DOM.txCategorySelect.innerHTML = categories.map(cat => `
    <option value="${escapeHtml(cat.name)}" ${cat.name === selectedCategory ? 'selected' : ''}>
      ${escapeHtml(cat.name)}
    </option>
  `).join('');
}

/**
 * Opens modal for adding a new transaction.
 */
function openAddModal(defaultType = 'expense') {
  state.editingTxId = null;

  if (DOM.modalTitle) DOM.modalTitle.textContent = 'Add Transaction';
  if (DOM.modalSubtitle) DOM.modalSubtitle.textContent = 'Enter details to record your financial activity';
  if (DOM.txIdInput) DOM.txIdInput.value = '';

  // Reset form inputs
  if (DOM.txTitleInput) DOM.txTitleInput.value = '';
  if (DOM.txAmountInput) DOM.txAmountInput.value = '';
  if (DOM.txDateInput) DOM.txDateInput.value = getTodayString();
  if (DOM.txNotesInput) DOM.txNotesInput.value = '';

  // Reset type toggle
  setModalType(defaultType);

  // Clear validation errors
  clearFormErrors();

  if (DOM.transactionModal) DOM.transactionModal.classList.remove('hidden');
  if (DOM.txTitleInput) DOM.txTitleInput.focus();
  refreshIcons();
}

/**
 * Opens modal for editing an existing transaction.
 */
function openEditModal(txId) {
  const tx = state.transactions.find(t => t.id === txId);
  if (!tx) {
    showToast('Transaction not found', 'error');
    return;
  }

  state.editingTxId = txId;

  if (DOM.modalTitle) DOM.modalTitle.textContent = 'Edit Transaction';
  if (DOM.modalSubtitle) DOM.modalSubtitle.textContent = 'Update details for this financial record';
  if (DOM.txIdInput) DOM.txIdInput.value = tx.id;

  if (DOM.txTitleInput) DOM.txTitleInput.value = tx.title || '';
  if (DOM.txAmountInput) DOM.txAmountInput.value = tx.amount || '';
  if (DOM.txDateInput) DOM.txDateInput.value = tx.date || getTodayString();
  if (DOM.txNotesInput) DOM.txNotesInput.value = tx.notes || '';

  // Set type and populate matching categories
  setModalType(tx.type || 'expense', tx.category);

  clearFormErrors();

  if (DOM.transactionModal) DOM.transactionModal.classList.remove('hidden');
  if (DOM.txTitleInput) DOM.txTitleInput.focus();
  refreshIcons();
}

/**
 * Changes active type in Add/Edit modal.
 */
function setModalType(type, selectedCategory = '') {
  if (DOM.txTypeInput) DOM.txTypeInput.value = type;

  DOM.typeBtns.forEach(btn => {
    if (btn.getAttribute('data-type') === type) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  populateCategorySelect(type, selectedCategory);
}

/**
 * Closes the Add / Edit modal.
 */
function closeTransactionModal() {
  if (DOM.transactionModal) DOM.transactionModal.classList.add('hidden');
  state.editingTxId = null;
  clearFormErrors();
}

/**
 * Clears in-line validation error messages.
 */
function clearFormErrors() {
  const errorElements = [DOM.txTitleError, DOM.txAmountError, DOM.txDateError, DOM.txCategoryError];
  errorElements.forEach(el => {
    if (el) el.classList.add('hidden');
  });
}

/**
 * Handles submission of Add/Edit transaction form.
 */
function handleTransactionFormSubmit(e) {
  e.preventDefault();
  clearFormErrors();

  const title = (DOM.txTitleInput ? DOM.txTitleInput.value : '').trim();
  const amountStr = DOM.txAmountInput ? DOM.txAmountInput.value : '';
  const amount = parseFloat(amountStr);
  const type = DOM.txTypeInput ? DOM.txTypeInput.value : 'expense';
  const category = DOM.txCategorySelect ? DOM.txCategorySelect.value : '';
  const date = DOM.txDateInput ? DOM.txDateInput.value : '';
  const notes = (DOM.txNotesInput ? DOM.txNotesInput.value : '').trim();

  let hasError = false;

  // Validation
  if (!title) {
    if (DOM.txTitleError) DOM.txTitleError.classList.remove('hidden');
    hasError = true;
  }

  if (isNaN(amount) || amount <= 0) {
    if (DOM.txAmountError) DOM.txAmountError.classList.remove('hidden');
    hasError = true;
  }

  if (!date) {
    if (DOM.txDateError) DOM.txDateError.classList.remove('hidden');
    hasError = true;
  }

  if (!category) {
    if (DOM.txCategoryError) DOM.txCategoryError.classList.remove('hidden');
    hasError = true;
  }

  if (hasError) {
    showToast('Please fix the errors in the form.', 'error');
    return;
  }

  if (state.editingTxId) {
    // Edit existing transaction
    editTransaction(state.editingTxId, { title, amount, type, category, date, notes });
  } else {
    // Add new transaction
    addTransaction({ title, amount, type, category, date, notes });
  }

  closeTransactionModal();
}

/**
 * Adds a new transaction to state and storage.
 */
function addTransaction(txData) {
  const newTx = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    title: txData.title,
    amount: Number(txData.amount),
    type: txData.type,
    category: txData.category,
    date: txData.date,
    notes: txData.notes || '',
    createdAt: Date.now()
  };

  state.transactions.unshift(newTx);
  saveTransactions(state.transactions);
  updateDashboard();
  showToast('Transaction added successfully!', 'success');
}

/**
 * Updates an existing transaction in state and storage.
 */
function editTransaction(id, updatedFields) {
  const index = state.transactions.findIndex(t => t.id === id);
  if (index === -1) {
    showToast('Transaction not found', 'error');
    return;
  }

  state.transactions[index] = {
    ...state.transactions[index],
    title: updatedFields.title,
    amount: Number(updatedFields.amount),
    type: updatedFields.type,
    category: updatedFields.category,
    date: updatedFields.date,
    notes: updatedFields.notes || ''
  };

  saveTransactions(state.transactions);
  updateDashboard();
  showToast('Transaction updated successfully!', 'success');
}

/* ==============================================================================
   12. DELETE TRANSACTION FUNCTIONALITY
   ============================================================================== */

/**
 * Opens delete confirmation modal.
 */
function openDeleteModal(txId) {
  const tx = state.transactions.find(t => t.id === txId);
  if (!tx) return;

  state.deleteTxId = txId;

  if (DOM.deleteModalMsg) {
    DOM.deleteModalMsg.textContent = `Are you sure you want to delete "${tx.title}" (${formatCurrency(tx.amount)})? This cannot be undone.`;
  }

  if (DOM.deleteModal) DOM.deleteModal.classList.remove('hidden');
  refreshIcons();
}

/**
 * Closes delete modal.
 */
function closeDeleteModal() {
  if (DOM.deleteModal) DOM.deleteModal.classList.add('hidden');
  state.deleteTxId = null;
}

/**
 * Confirms deletion of selected transaction.
 */
function deleteTransaction(id) {
  state.transactions = state.transactions.filter(t => t.id !== id);
  saveTransactions(state.transactions);
  updateDashboard();
  showToast('Transaction deleted.', 'info');
}

/* ==============================================================================
   13. EXPORT TO CSV
   ============================================================================== */

/**
 * Exports all transactions to a downloadable RFC 4180 compliant CSV file.
 */
function exportToCSV() {
  if (state.transactions.length === 0) {
    showToast('No transactions to export', 'error');
    return;
  }

  const headers = ['Transaction ID', 'Date', 'Title', 'Type', 'Category', 'Amount (INR)', 'Notes'];

  const rows = state.transactions.map(t => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${t.type}"`,
    `"${t.category}"`,
    t.amount,
    `"${(t.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const today = getTodayString();
  link.setAttribute('href', url);
  link.setAttribute('download', `expensely_transactions_${today}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Transactions exported to CSV successfully!', 'success');
}

/* ==============================================================================
   14. THEME MANAGEMENT (LIGHT / DARK)
   ============================================================================== */

/**
 * Applies theme to body and updates Settings buttons.
 */
function applyTheme(theme) {
  state.theme = theme;
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEYS.THEME, theme);

  if (DOM.themeLightBtn && DOM.themeDarkBtn) {
    if (theme === 'dark') {
      DOM.themeLightBtn.classList.remove('active');
      DOM.themeDarkBtn.classList.add('active');
    } else {
      DOM.themeLightBtn.classList.add('active');
      DOM.themeDarkBtn.classList.remove('active');
    }
  }

  // Refresh charts with updated grid and font colors
  renderCharts();
}

/**
 * Initializes saved theme on startup.
 */
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }
}

/* ==============================================================================
   15. NAVIGATION & VIEW SWITCHING
   ============================================================================== */

/**
 * Switches the active app view.
 */
function switchView(viewName) {
  state.currentView = viewName;

  // Update sidebar nav links
  DOM.navLinks.forEach(link => {
    if (link.getAttribute('data-view') === viewName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update views
  DOM.views.forEach(view => {
    if (view.id === `view-${viewName}`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Update topbar title
  if (DOM.currentPageTitle) {
    const titles = {
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      analytics: 'Analytics',
      settings: 'Settings'
    };
    DOM.currentPageTitle.textContent = titles[viewName] || 'Dashboard';
  }

  // Close mobile drawer if open
  closeMobileSidebar();

  // Resize charts if switching into views containing charts
  setTimeout(() => {
    if (viewName === 'dashboard' && state.charts.dashboardCategory) {
      state.charts.dashboardCategory.resize();
    }
    if (viewName === 'analytics') {
      if (state.charts.monthlyTrend) state.charts.monthlyTrend.resize();
      if (state.charts.analyticsCategory) state.charts.analyticsCategory.resize();
    }
  }, 100);

  refreshIcons();
}

/**
 * Open / Close mobile drawer.
 */
function openMobileSidebar() {
  if (DOM.sidebar) DOM.sidebar.classList.add('open');
  if (DOM.sidebarOverlay) DOM.sidebarOverlay.classList.add('active');
}

function closeMobileSidebar() {
  if (DOM.sidebar) DOM.sidebar.classList.remove('open');
  if (DOM.sidebarOverlay) DOM.sidebarOverlay.classList.remove('active');
}

/* ==============================================================================
   16. YEAR & MONTH SELECTORS SETUP
   ============================================================================== */

/**
 * Populates year dropdown options (current year - 4 to current year + 2).
 */
function initYearSelectors() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 4; y <= currentYear + 2; y++) {
    years.push(y);
  }

  const buildOptions = (selected) => years.map(y => `<option value="${y}" ${y === selected ? 'selected' : ''}>${y}</option>`).join('');

  if (DOM.yearSelect) {
    DOM.yearSelect.innerHTML = buildOptions(state.selectedYear);
  }
  if (DOM.analyticsYearSelect) {
    DOM.analyticsYearSelect.innerHTML = buildOptions(state.analyticsYear);
  }

  // Populate month selectors
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const buildMonthOptions = (selected) => monthNames.map((m, idx) => `<option value="${idx}" ${idx === selected ? 'selected' : ''}>${m}</option>`).join('');

  if (DOM.monthSelect) {
    DOM.monthSelect.value = state.selectedMonth;
  }
  if (DOM.analyticsMonthSelect) {
    DOM.analyticsMonthSelect.innerHTML = buildMonthOptions(state.analyticsMonth);
  }
}

/**
 * Populates Category Filter dropdown in Transactions view.
 */
function initFilterCategories() {
  if (!DOM.filterCategorySelect) return;

  const combined = [
    ...EXPENSE_CATEGORIES.map(c => c.name),
    ...INCOME_CATEGORIES.map(c => c.name)
  ];
  const unique = Array.from(new Set(combined)).sort();

  DOM.filterCategorySelect.innerHTML = `
    <option value="all">All Categories</option>
    ${unique.map(cat => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join('')}
  `;
}

/* ==============================================================================
   17. EVENT LISTENERS ATTACHMENT
   ============================================================================== */

function attachEventListeners() {
  // 1. Navigation switching
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewName = link.getAttribute('data-view');
      switchView(viewName);
    });
  });

  // Mobile menu buttons
  if (DOM.menuToggleBtn) DOM.menuToggleBtn.addEventListener('click', openMobileSidebar);
  if (DOM.closeSidebarBtn) DOM.closeSidebarBtn.addEventListener('click', closeMobileSidebar);
  if (DOM.sidebarOverlay) DOM.sidebarOverlay.addEventListener('click', closeMobileSidebar);

  // Quick Action Buttons
  if (DOM.sidebarAddBtn) DOM.sidebarAddBtn.addEventListener('click', () => openAddModal('expense'));
  if (DOM.quickAddExpenseBtn) DOM.quickAddExpenseBtn.addEventListener('click', () => openAddModal('expense'));
  if (DOM.quickAddIncomeBtn) DOM.quickAddIncomeBtn.addEventListener('click', () => openAddModal('income'));

  document.querySelectorAll('.open-add-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => openAddModal('expense'));
  });

  // View All Transactions shortcuts
  if (DOM.dashboardViewAllBtn) DOM.dashboardViewAllBtn.addEventListener('click', () => switchView('transactions'));
  if (DOM.viewAllTransactionsLink) DOM.viewAllTransactionsLink.addEventListener('click', () => switchView('transactions'));
  if (DOM.dashGotoAnalyticsBtn) DOM.dashGotoAnalyticsBtn.addEventListener('click', () => switchView('analytics'));

  // CSV Export Buttons
  if (DOM.dashExportCsvBtn) DOM.dashExportCsvBtn.addEventListener('click', exportToCSV);
  if (DOM.transactionsExportBtn) DOM.transactionsExportBtn.addEventListener('click', exportToCSV);
  if (DOM.settingsExportCsvBtn) DOM.settingsExportCsvBtn.addEventListener('click', exportToCSV);

  // Topbar Global Search
  if (DOM.topbarSearchInput) {
    DOM.topbarSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (DOM.topbarSearchClear) {
        if (query) DOM.topbarSearchClear.classList.remove('hidden');
        else DOM.topbarSearchClear.classList.add('hidden');
      }
      // If user searches from topbar, switch to Transactions view and apply search
      state.filters.search = query;
      if (DOM.filterSearchInput) DOM.filterSearchInput.value = query;
      if (state.currentView !== 'transactions') switchView('transactions');
      renderTransactions();
    });
  }

  if (DOM.topbarSearchClear) {
    DOM.topbarSearchClear.addEventListener('click', () => {
      if (DOM.topbarSearchInput) DOM.topbarSearchInput.value = '';
      if (DOM.filterSearchInput) DOM.filterSearchInput.value = '';
      DOM.topbarSearchClear.classList.add('hidden');
      state.filters.search = '';
      renderTransactions();
    });
  }

  // Notifications Toggle
  if (DOM.notificationsBtn && DOM.notificationsPanel) {
    DOM.notificationsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.notificationsPanel.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!DOM.notificationsPanel.contains(e.target) && !DOM.notificationsBtn.contains(e.target)) {
        DOM.notificationsPanel.classList.add('hidden');
      }
    });
  }

  if (DOM.clearNotificationsBtn) {
    DOM.clearNotificationsBtn.addEventListener('click', () => {
      const list = document.getElementById('notifications-list');
      if (list) list.innerHTML = '<li class="notification-item" style="color: var(--text-muted); justify-content: center; padding: 1rem 0;">No new notifications</li>';
      if (DOM.notificationBadge) DOM.notificationBadge.style.display = 'none';
    });
  }

  // Dashboard Month / Year Selector
  if (DOM.monthSelect) {
    DOM.monthSelect.addEventListener('change', (e) => {
      state.selectedMonth = parseInt(e.target.value, 10);
      updateDashboard();
    });
  }

  if (DOM.yearSelect) {
    DOM.yearSelect.addEventListener('change', (e) => {
      state.selectedYear = parseInt(e.target.value, 10);
      updateDashboard();
    });
  }

  if (DOM.prevMonthBtn) {
    DOM.prevMonthBtn.addEventListener('click', () => {
      if (state.selectedMonth === 0) {
        state.selectedMonth = 11;
        state.selectedYear -= 1;
      } else {
        state.selectedMonth -= 1;
      }
      if (DOM.monthSelect) DOM.monthSelect.value = state.selectedMonth;
      if (DOM.yearSelect) DOM.yearSelect.value = state.selectedYear;
      updateDashboard();
    });
  }

  if (DOM.nextMonthBtn) {
    DOM.nextMonthBtn.addEventListener('click', () => {
      if (state.selectedMonth === 11) {
        state.selectedMonth = 0;
        state.selectedYear += 1;
      } else {
        state.selectedMonth += 1;
      }
      if (DOM.monthSelect) DOM.monthSelect.value = state.selectedMonth;
      if (DOM.yearSelect) DOM.yearSelect.value = state.selectedYear;
      updateDashboard();
    });
  }

  if (DOM.currentMonthBtn) {
    DOM.currentMonthBtn.addEventListener('click', () => {
      const now = new Date();
      state.selectedMonth = now.getMonth();
      state.selectedYear = now.getFullYear();
      if (DOM.monthSelect) DOM.monthSelect.value = state.selectedMonth;
      if (DOM.yearSelect) DOM.yearSelect.value = state.selectedYear;
      updateDashboard();
    });
  }

  // Analytics Month / Year Selector
  if (DOM.analyticsMonthSelect) {
    DOM.analyticsMonthSelect.addEventListener('change', (e) => {
      state.analyticsMonth = parseInt(e.target.value, 10);
      renderAnalytics();
      renderAnalyticsCategoryChart();
    });
  }

  if (DOM.analyticsYearSelect) {
    DOM.analyticsYearSelect.addEventListener('change', (e) => {
      state.analyticsYear = parseInt(e.target.value, 10);
      renderAnalytics();
      renderAnalyticsCategoryChart();
    });
  }

  // Filter Toolbar in Transactions View
  if (DOM.filterSearchInput) {
    DOM.filterSearchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value.trim();
      renderTransactions();
    });
  }

  if (DOM.filterTypeSelect) {
    DOM.filterTypeSelect.addEventListener('change', (e) => {
      state.filters.type = e.target.value;
      renderTransactions();
    });
  }

  if (DOM.filterCategorySelect) {
    DOM.filterCategorySelect.addEventListener('change', (e) => {
      state.filters.category = e.target.value;
      renderTransactions();
    });
  }

  if (DOM.filterDateSelect) {
    DOM.filterDateSelect.addEventListener('change', (e) => {
      state.filters.datePeriod = e.target.value;
      if (DOM.customDateContainer) {
        if (e.target.value === 'custom') {
          DOM.customDateContainer.classList.remove('hidden');
        } else {
          DOM.customDateContainer.classList.add('hidden');
        }
      }
      renderTransactions();
    });
  }

  if (DOM.filterStartDate) {
    DOM.filterStartDate.addEventListener('change', (e) => {
      state.filters.startDate = e.target.value;
      renderTransactions();
    });
  }

  if (DOM.filterEndDate) {
    DOM.filterEndDate.addEventListener('change', (e) => {
      state.filters.endDate = e.target.value;
      renderTransactions();
    });
  }

  const resetAllFilters = () => {
    state.filters = {
      search: '',
      type: 'all',
      category: 'all',
      datePeriod: 'all',
      startDate: '',
      endDate: ''
    };
    if (DOM.filterSearchInput) DOM.filterSearchInput.value = '';
    if (DOM.topbarSearchInput) DOM.topbarSearchInput.value = '';
    if (DOM.topbarSearchClear) DOM.topbarSearchClear.classList.add('hidden');
    if (DOM.filterTypeSelect) DOM.filterTypeSelect.value = 'all';
    if (DOM.filterCategorySelect) DOM.filterCategorySelect.value = 'all';
    if (DOM.filterDateSelect) DOM.filterDateSelect.value = 'all';
    if (DOM.filterStartDate) DOM.filterStartDate.value = '';
    if (DOM.filterEndDate) DOM.filterEndDate.value = '';
    if (DOM.customDateContainer) DOM.customDateContainer.classList.add('hidden');
    renderTransactions();
  };

  if (DOM.clearFiltersBtn) DOM.clearFiltersBtn.addEventListener('click', resetAllFilters);
  if (DOM.emptyClearFiltersBtn) DOM.emptyClearFiltersBtn.addEventListener('click', resetAllFilters);

  // Modal Type Segmented Control
  DOM.typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      setModalType(type);
    });
  });

  // Modal Form Submission
  if (DOM.transactionForm) {
    DOM.transactionForm.addEventListener('submit', handleTransactionFormSubmit);
  }

  if (DOM.modalCloseBtn) DOM.modalCloseBtn.addEventListener('click', closeTransactionModal);
  if (DOM.modalCancelBtn) DOM.modalCancelBtn.addEventListener('click', closeTransactionModal);

  // Close modals on backdrop click
  if (DOM.transactionModal) {
    DOM.transactionModal.addEventListener('click', (e) => {
      if (e.target === DOM.transactionModal) closeTransactionModal();
    });
  }

  if (DOM.deleteModal) {
    DOM.deleteModal.addEventListener('click', (e) => {
      if (e.target === DOM.deleteModal) closeDeleteModal();
    });
  }

  if (DOM.clearAllModal) {
    DOM.clearAllModal.addEventListener('click', (e) => {
      if (e.target === DOM.clearAllModal) DOM.clearAllModal.classList.add('hidden');
    });
  }

  // Delete Modal Confirmation
  if (DOM.deleteCancelBtn) DOM.deleteCancelBtn.addEventListener('click', closeDeleteModal);
  if (DOM.deleteConfirmBtn) {
    DOM.deleteConfirmBtn.addEventListener('click', () => {
      if (state.deleteTxId) {
        deleteTransaction(state.deleteTxId);
        closeDeleteModal();
      }
    });
  }

  // Settings Theme Toggle
  if (DOM.themeLightBtn) DOM.themeLightBtn.addEventListener('click', () => applyTheme('light'));
  if (DOM.themeDarkBtn) DOM.themeDarkBtn.addEventListener('click', () => applyTheme('dark'));

  // Settings Sample Data
  if (DOM.settingsLoadSampleBtn) {
    DOM.settingsLoadSampleBtn.addEventListener('click', () => loadSampleData(true));
  }

  // Settings Wipe Data
  if (DOM.settingsClearDataBtn && DOM.clearAllModal) {
    DOM.settingsClearDataBtn.addEventListener('click', () => {
      DOM.clearAllModal.classList.remove('hidden');
      refreshIcons();
    });
  }

  if (DOM.clearCancelBtn && DOM.clearAllModal) {
    DOM.clearCancelBtn.addEventListener('click', () => {
      DOM.clearAllModal.classList.add('hidden');
    });
  }

  if (DOM.clearConfirmBtn && DOM.clearAllModal) {
    DOM.clearConfirmBtn.addEventListener('click', () => {
      state.transactions = [];
      saveTransactions(state.transactions);
      updateDashboard();
      DOM.clearAllModal.classList.add('hidden');
      showToast('All transaction records have been wiped clean.', 'info');
    });
  }

  // Keyboard accessibility: Escape closes open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (DOM.transactionModal && !DOM.transactionModal.classList.contains('hidden')) {
        closeTransactionModal();
      }
      if (DOM.deleteModal && !DOM.deleteModal.classList.contains('hidden')) {
        closeDeleteModal();
      }
      if (DOM.clearAllModal && !DOM.clearAllModal.classList.contains('hidden')) {
        DOM.clearAllModal.classList.add('hidden');
      }
    }
  });
}

/* ==============================================================================
   18. GLOBAL WINDOW ATTACHMENTS (for onclick in generated HTML rows)
   ============================================================================== */

window.openEditModal = openEditModal;
window.openDeleteModal = openDeleteModal;

/* ==============================================================================
   19. APPLICATION INITIALIZATION
   ============================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme
  initTheme();

  // 2. Initialize Month / Year Dropdowns
  initYearSelectors();
  initFilterCategories();

  // 3. Attach Event Listeners
  attachEventListeners();

  // 4. Load Data & Seed on First Visit
  checkAndSeedSampleData();

  // 5. Initial Render
  updateDashboard();

  // 6. Refresh Icons
  refreshIcons();

  console.log('Expensely Expense Tracker initialized successfully.');
});
