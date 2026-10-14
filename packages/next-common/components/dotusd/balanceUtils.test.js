import { describe, expect, it } from "vitest";
import { isSpendable, readDotUsdAccount } from "./balanceUtils";

// The shapes below are what PAPI decodes from `Assets.Account` on Polkadot Asset Hub.
describe("readDotUsdAccount", () => {
  it("reads a liquid account", () => {
    expect(
      readDotUsdAccount({ balance: 123456789n, status: { type: "Liquid" } }),
    ).toEqual({
      balance: 123456789n,
      status: "Liquid",
      transferrable: 123456789n,
    });
  });

  it("reads an account without a status as empty", () => {
    // The account was reaped, e.g. by transferring the whole balance away.
    expect(readDotUsdAccount(null)).toEqual({
      balance: 0n,
      status: null,
      transferrable: 0n,
    });
    expect(readDotUsdAccount(undefined)).toEqual({
      balance: 0n,
      status: null,
      transferrable: 0n,
    });
  });

  it("keeps the balance of a frozen account but nothing can be transferred", () => {
    expect(
      readDotUsdAccount({ balance: 5_000n, status: { type: "Frozen" } }),
    ).toEqual({ balance: 5_000n, status: "Frozen", transferrable: 0n });
  });

  it("keeps the balance of a blocked account but nothing can be transferred", () => {
    expect(
      readDotUsdAccount({ balance: 5_000n, status: { type: "Blocked" } }),
    ).toEqual({ balance: 5_000n, status: "Blocked", transferrable: 0n });
  });

  it("accepts the balance wherever it arrives as a string", () => {
    expect(
      readDotUsdAccount({ balance: "42", status: { type: "Liquid" } }).balance,
    ).toBe(42n);
  });
});

describe("isSpendable", () => {
  it("only lets a liquid account transfer", () => {
    expect(isSpendable("Liquid")).toBe(true);
    expect(isSpendable(null)).toBe(true);
    expect(isSpendable("Frozen")).toBe(false);
    expect(isSpendable("Blocked")).toBe(false);
  });
});
