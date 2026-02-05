Overview

This small COBOL repo implements a simple Account Management System (single shared account balance).

Files

- src/cobol/main.cob: Program entry point. `MAIN-LOGIC` renders a menu, accepts user choices (1-4), and calls `Operations` with a fixed 6-character operation code: `'TOTAL '`, `'CREDIT'`, or `'DEBIT '`.

- src/cobol/data.cob: Data access module. Exposes a `PROCEDURE DIVISION USING PASSED-OPERATION BALANCE` interface. Maintains an in-memory `STORAGE-BALANCE` (PIC 9(6)V99, initial value 1000.00). Supports two operation codes:
  - `READ` — moves `STORAGE-BALANCE` to the passed `BALANCE`.
  - `WRITE` — moves the passed `BALANCE` into `STORAGE-BALANCE`.

- src/cobol/operations.cob: Business-logic module. `PROCEDURE DIVISION USING PASSED-OPERATION` inspects the 6-character operation and implements:
  - `TOTAL `: Calls `DataProgram` with `READ` and displays the current balance.
  - `CREDIT`: Prompts for an amount, reads the balance, adds the amount, writes the new balance, and displays the result.
  - `DEBIT `: Prompts for an amount, reads the balance, checks sufficient funds, subtracts and writes the new balance if allowed, otherwise displays an "Insufficient funds" message.

Key Procedures / Symbols

- `MAIN-LOGIC` (in `main.cob`) — menu loop; user I/O and dispatch.
- `DataProgram` `PROCEDURE DIVISION USING PASSED-OPERATION BALANCE` (in `data.cob`) — single-point storage and read/write semantics.
- `Operations` `PROCEDURE DIVISION USING PASSED-OPERATION` (in `operations.cob`) — credits, debits, and total display.
- Important fields: `STORAGE-BALANCE` / `FINAL-BALANCE` / `AMOUNT` use PIC 9(6)V99 (monetary with two decimals).

Business Rules (observed)

- System operates on a single shared account balance (`STORAGE-BALANCE`) initialized to 1000.00.
- Credit flow: accept amount → read current balance → add amount → write back → display new balance.
- Debit flow: accept amount → read current balance → allow debit only if `FINAL-BALANCE >= AMOUNT`; otherwise, reject with "Insufficient funds".
- Operation codes are fixed 6-character strings and include trailing spaces for some codes (e.g., `'DEBIT '` and `'TOTAL '`). Calls depend on exact 6-char values.
- No persistence beyond in-memory `STORAGE-BALANCE` (no file or DB persistence). Balance resets when program restarts.
- No input validation for non-numeric or negative amounts; the program assumes well-formed numeric input via `ACCEPT`.

Notes & Migration Considerations

- If this is used for student accounts specifically, the code currently models a single account only; to support multiple student accounts you would need to introduce per-student records and persistent storage.
- Consider validating input (numeric, non-negative) and adding persistence (file/DB) and stronger operation codes (enum or constants) to avoid errors from fixed-width strings.

**Sequence Diagram**

The following Mermaid sequence diagram shows the data flow between the user, `MainProgram`, `Operations`, and `DataProgram` for the three main flows: view total, credit, and debit.

```mermaid
sequenceDiagram
  participant User
  participant Main as MainProgram
  participant Ops as Operations
  participant Data as DataProgram

  User->>Main: select option (1: Total, 2: Credit, 3: Debit)
  Main->>Ops: CALL 'Operations' USING operation-code

  alt View Total
    Ops->>Data: CALL 'DataProgram' USING 'READ', balance
    Data-->>Ops: return balance
    Ops-->>User: DISPLAY current balance
  end

  alt Credit flow
    Ops-->>User: DISPLAY "Enter credit amount"
    User-->>Ops: INPUT amount
    Ops->>Data: CALL 'DataProgram' USING 'READ', balance
    Data-->>Ops: return balance
    Ops: balance = balance + amount
    Ops->>Data: CALL 'DataProgram' USING 'WRITE', balance
    Data-->>Ops: acknowledge
    Ops-->>User: DISPLAY new balance
  end

  alt Debit flow
    Ops-->>User: DISPLAY "Enter debit amount"
    User-->>Ops: INPUT amount
    Ops->>Data: CALL 'DataProgram' USING 'READ', balance
    Data-->>Ops: return balance
    alt sufficient funds
      Ops: balance >= amount
      Ops: balance = balance - amount
      Ops->>Data: CALL 'DataProgram' USING 'WRITE', balance
      Data-->>Ops: acknowledge
      Ops-->>User: DISPLAY new balance
    else insufficient
      Ops-->>User: DISPLAY "Insufficient funds"
    end
  end

```
