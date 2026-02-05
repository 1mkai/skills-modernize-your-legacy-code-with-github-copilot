// Core accounting logic extracted for unit testing and reuse
let storageBalance = 1000.00;

const MAX_INTEGER_PART = 999999; // PIC 9(6)

function round2(n) {
  return Math.round(n * 100) / 100;
}

function formatBalance(value) {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(round2(value));
  const intPart = Math.floor(abs).toString().padStart(6, '0');
  const frac = (abs % 1).toFixed(2).split('.')[1];
  return `${sign}${intPart}.${frac}`;
}

function getBalanceNumber() {
  return round2(storageBalance);
}

function getFormattedBalance() {
  return formatBalance(storageBalance);
}

function validateAmount(amount) {
  if (!Number.isFinite(amount)) throw new Error('Invalid amount');
  if (amount < 0) throw new Error('Negative amounts not allowed');
}

function checkOverflow(value) {
  const intPart = Math.floor(Math.abs(value));
  if (intPart > MAX_INTEGER_PART) throw new Error('Amount exceeds allowed range');
}

function credit(amount) {
  const n = Number(amount);
  validateAmount(n);
  const newVal = round2(storageBalance + n);
  checkOverflow(newVal);
  storageBalance = newVal;
  return { success: true, balance: storageBalance };
}

function debit(amount) {
  const n = Number(amount);
  validateAmount(n);
  if (storageBalance >= n) {
    const newVal = round2(storageBalance - n);
    checkOverflow(newVal);
    storageBalance = newVal;
    return { success: true, balance: storageBalance };
  }
  return { success: false, message: 'Insufficient funds', balance: storageBalance };
}

function writeBalance(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error('Invalid balance');
  checkOverflow(n);
  storageBalance = round2(n);
}

function resetBalance(value = 1000.00) {
  storageBalance = Number(value);
}

module.exports = {
  getBalanceNumber,
  getFormattedBalance,
  credit,
  debit,
  writeBalance,
  resetBalance,
  formatBalance,
};
