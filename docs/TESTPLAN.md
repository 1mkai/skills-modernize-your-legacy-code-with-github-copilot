# Test Plan for COBOL Account Management System

This test plan covers the business logic implemented in `src/cobol/main.cob`, `src/cobol/operations.cob`, and `src/cobol/data.cob`.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-01 | View current balance (TOTAL) | Program compiled and running; initial `STORAGE-BALANCE` = 1000.00 | 1) Start program. 2) Select menu option `1` (View Balance). | Program displays current balance `001000.00` (or formatted equivalent). |  |  | Verifies read flow and display. |
| TC-02 | Credit account (normal case) | Program running; initial balance known (e.g., 1000.00) | 1) Select menu option `2`. 2) Enter amount `50`. | Balance increments by 50; program displays updated balance `001050.00`. |  |  | Verifies read-add-write sequence. |
| TC-03 | Debit account (sufficient funds) | Program running; balance >= debit amount | 1) Select menu `3`. 2) Enter amount `200`. | Balance decrements by 200 and displays new balance. |  |  | Verifies subtraction and write-back. |
| TC-04 | Debit account (insufficient funds) | Program running; balance < debit amount | 1) Select menu `3`. 2) Enter amount greater than balance. | Program displays "Insufficient funds for this debit." and balance is unchanged. |  |  | Verifies guard condition preventing negative balances. |
| TC-05 | Menu invalid choice handling | Program running | 1) Enter choice outside 1-4 (e.g., `9` or letter). | Program displays error message "Invalid choice, please select 1-4." and returns to menu. |  |  | Ensures menu validates choices. |
| TC-06 | Operation codes exactness | Program compiled with current strings | 1) Confirm `MainProgram` calls `Operations` using exact 6-char codes `'TOTAL '`, `'CREDIT'`, `'DEBIT '`. | `Operations` recognizes codes exactly; any mismatch (wrong padding) may cause incorrect behavior. |  |  | Documents dependence on fixed-width codes. |
| TC-07 | Non-numeric amount input | Program running | 1) Select credit or debit. 2) Enter non-numeric input (e.g., `abc`). | Current program expects numeric input; behavior may be undefined (likely error or 0). Expected: reject input or show validation error. |  |  | Current app has no validation — record stakeholder acceptance or require validation in migration. |
| TC-08 | Negative amount input | Program running | 1) Select credit or debit. 2) Enter negative value (e.g., `-50`). | Expected: reject negative amounts. Current app accepts numeric input without sign checks — specify desired business behavior. |  |  | Important for business rules: disallow negative credits/debits unless explicitly allowed. |
| TC-09 | Large amount handling / overflow | Program running | 1) Enter a very large amount exceeding PIC 9(6)V99 capacity (e.g., `9999999.99`). | Expected: graceful failure or validation error; otherwise numeric overflow may occur. |  |  | Define limits for migration and input validation. |
| TC-10 | Persistence across runs | Program running, then restarted | 1) Credit account by amount X. 2) Stop program. 3) Restart program. 4) View balance. | Current system uses in-memory `STORAGE-BALANCE` so balance resets to initial 1000.00. Expected in production: persisted balance; note current behavior. |  |  | Confirms lack of persistence; record requirement change if persistence required. |
| TC-11 | Sequential operations consistency | Program running | 1) Credit 20. 2) Debit 5. 3) View balance. | Balance reflects cumulative operations (initial +20 -5). |  |  | Verifies multiple-step consistency using read/write cycle. |
| TC-12 | DataProgram READ/WRITE pair behavior | Program compiled | 1) Directly (via calls) exercise `DataProgram` with `READ` to get balance and `WRITE` to set balance. | `READ` returns `STORAGE-BALANCE`. `WRITE` sets `STORAGE-BALANCE` to supplied value. |  |  | Confirms data module contract. |

Notes for stakeholders:
- Fields use PIC 9(6)V99 (monetary with two decimals) — define acceptable ranges.
- Current app lacks input validation and persistence; tests that expose these gaps should be marked and used to define acceptance criteria for the Node.js migration.

Instructions for use:
- For each row, execute the test steps and record the Actual Result and Status.
- Add Comments to capture observed behavior, errors, or stakeholder decisions about acceptable behavior.

