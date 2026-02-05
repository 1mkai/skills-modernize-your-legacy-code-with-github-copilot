const readline = require('readline-sync');
const lib = require('./lib');

function showMenu() {
  console.log('--------------------------------');
  console.log('Account Management System');
  console.log('1. View Balance');
  console.log('2. Credit Account');
  console.log('3. Debit Account');
  console.log('4. Exit');
  console.log('--------------------------------');
}

function readChoice() {
  const input = readline.question('Enter your choice (1-4): ');
  const n = parseInt(input, 10);
  return Number.isNaN(n) ? null : n;
}

function viewBalance() {
  console.log('Current balance: ' + lib.getFormattedBalance());
}

function creditAccount() {
  const input = readline.question('Enter credit amount: ');
  try {
    const result = lib.credit(input);
    if (result.success) {
      console.log('Amount credited. New balance: ' + lib.formatBalance(result.balance));
    }
  } catch (e) {
    console.log('Invalid amount; credit aborted.');
  }
}

function debitAccount() {
  const input = readline.question('Enter debit amount: ');
  try {
    const result = lib.debit(input);
    if (result.success) {
      console.log('Amount debited. New balance: ' + lib.formatBalance(result.balance));
    } else {
      console.log(result.message);
    }
  } catch (e) {
    console.log('Invalid amount; debit aborted.');
  }
}

function main() {
  let continueFlag = true;
  while (continueFlag) {
    showMenu();
    const choice = readChoice();
    switch (choice) {
      case 1:
        viewBalance();
        break;
      case 2:
        creditAccount();
        break;
      case 3:
        debitAccount();
        break;
      case 4:
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }
  console.log('Exiting the program. Goodbye!');
}

if (require.main === module) {
  main();
}
