const { expect } = require('chai');
const lib = require('..//lib');

describe('Accounting library tests (mirrors TESTPLAN)', () => {
  beforeEach(() => {
    lib.resetBalance(1000.00);
  });

  it('TC-01: View current balance (TOTAL)', () => {
    expect(lib.getFormattedBalance()).to.equal('001000.00');
  });

  it('TC-02: Credit account (normal case)', () => {
    const r = lib.credit(50);
    expect(r.success).to.be.true;
    expect(lib.getFormattedBalance()).to.equal('001050.00');
  });

  it('TC-03: Debit account (sufficient funds)', () => {
    const r = lib.debit(200);
    expect(r.success).to.be.true;
    expect(lib.getFormattedBalance()).to.equal('000800.00');
  });

  it('TC-04: Debit account (insufficient funds)', () => {
    lib.resetBalance(100);
    const r = lib.debit(200);
    expect(r.success).to.be.false;
    expect(lib.getFormattedBalance()).to.equal('000100.00');
  });

  it('TC-07: Non-numeric amount input should be rejected', () => {
    expect(() => lib.credit('abc')).to.throw();
    expect(() => lib.debit('abc')).to.throw();
  });

  it('TC-08: Negative amount input rejected', () => {
    expect(() => lib.credit(-10)).to.throw();
    expect(() => lib.debit(-10)).to.throw();
  });

  it('TC-09: Large amount handling / overflow', () => {
    // try to exceed PIC 9(6) integer part limit
    expect(() => lib.credit(10000000)).to.throw();
  });

  it('TC-11: Sequential operations consistency', () => {
    lib.credit(20);
    lib.debit(5);
    expect(lib.getFormattedBalance()).to.equal('001015.00');
  });

  it('TC-12: WRITE/READ behavior via writeBalance and getBalance', () => {
    lib.writeBalance(500.5);
    expect(lib.getBalanceNumber()).to.equal(500.5);
    expect(lib.getFormattedBalance()).to.equal('000500.50');
  });
});
