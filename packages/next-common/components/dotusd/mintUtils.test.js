import { describe, expect, it } from "vitest";
import { computeMintQuote, getMintDisabledReason } from "./mintUtils";

// Values below are copied from Polkadot Asset Hub storage reads.
const dotUsdLocation = {
  parents: 0,
  interior: {
    type: "X2",
    value: [
      { type: "PalletInstance", value: 50 },
      { type: "GeneralIndex", value: 7873 },
    ],
  },
};

const usdtLocation = {
  parents: 0,
  interior: {
    type: "X2",
    value: [
      { type: "PalletInstance", value: 50 },
      { type: "GeneralIndex", value: 1984n },
    ],
  },
};

const internal = {
  index: 7873,
  location: dotUsdLocation,
  symbol: "dotUSD",
  decimals: 6,
};
const external = {
  index: 1984,
  location: usdtLocation,
  symbol: "USDt",
  decimals: 6,
  status: "AllEnabled",
  mintingFeePermill: 0,
};

describe("computeMintQuote", () => {
  // The live instance: 6/6 decimals, 0% fee, min_swap_amount 1 dotUSD.
  const base = {
    externalDecimals: 6,
    internalDecimals: 6,
    minSwapAmount: "1000000",
    mintingFeePermill: 0,
    debt: "2996624883933",
    cap: "10000000000000",
    maxDebt: "10000000000000",
    totalDebt: "2996624883933",
  };

  it("mirrors the pallet maths for a 1:1 pair", () => {
    const quote = computeMintQuote({ ...base, externalAmount: 1_000_000n });

    expect(quote.internalEquivalent).toBe(1_000_000n);
    expect(quote.fee).toBe(0n);
    expect(quote.received).toBe(1_000_000n);
    expect(quote.belowMinimum).toBe(false);
    expect(quote.exceedsCap).toBe(false);
    expect(quote.exceedsMaxDebt).toBe(false);
  });

  it("takes the fee with ceiling rounding", () => {
    // fee_rate.mul_ceil: an inexact product still charges a whole unit.
    const half = computeMintQuote({
      ...base,
      externalAmount: 1_000_000n,
      mintingFeePermill: 5_000,
    });
    expect(half.fee).toBe(5_000n);
    expect(half.received).toBe(995_000n);

    const dust = computeMintQuote({
      ...base,
      externalAmount: 3n,
      mintingFeePermill: 3_333,
    });
    expect(dust.fee).toBe(1n);
    expect(dust.received).toBe(2n);
  });

  it("scales across a decimals difference", () => {
    // External with fewer decimals multiplies up.
    expect(
      computeMintQuote({ ...base, externalAmount: 10_000n, externalDecimals: 4 })
        .internalEquivalent,
    ).toBe(1_000_000n);

    // More decimals floor-divides, and dust below one internal unit rounds away.
    expect(
      computeMintQuote({
        ...base,
        externalAmount: 1_000_000_000n,
        externalDecimals: 10,
      }).internalEquivalent,
    ).toBe(100_000n);
    expect(
      computeMintQuote({ ...base, externalAmount: 1n, externalDecimals: 10 })
        .amountTooSmall,
    ).toBe(true);
  });

  it("flags the instance minimum", () => {
    expect(
      computeMintQuote({ ...base, externalAmount: 999_999n }).belowMinimum,
    ).toBe(true);
    expect(
      computeMintQuote({ ...base, externalAmount: 1_000_000n }).belowMinimum,
    ).toBe(false);
  });

  it("flags the debt ceilings", () => {
    const overCap = computeMintQuote({
      ...base,
      externalAmount: 8_000_000_000_000n,
    });
    expect(overCap.exceedsCap).toBe(true);
    expect(overCap.exceedsMaxDebt).toBe(true);

    // Debt already above the ceiling, e.g. after the weights were reallocated.
    const atCap = computeMintQuote({
      ...base,
      externalAmount: 1_000_000n,
      debt: "10000000000000",
    });
    expect(atCap.atCap).toBe(true);
    expect(atCap.exceedsCap).toBe(true);
  });

  it("returns null without an amount", () => {
    expect(computeMintQuote({ ...base, externalAmount: null })).toBeNull();
    expect(computeMintQuote({ ...base, externalAmount: 0n })).toBeNull();
  });
});

describe("getMintDisabledReason", () => {
  const ready = {
    apiReady: true,
    address: "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
    dataLoading: false,
    internal,
    external,
    balanceLoading: false,
    balance: 10_000_000n,
    amount: { amount: 2_000_000n, isEmpty: false, error: null },
    quote: computeMintQuote({
      externalAmount: 2_000_000n,
      externalDecimals: 6,
      internalDecimals: 6,
      minSwapAmount: "1000000",
      mintingFeePermill: 0,
      debt: "2996624883933",
      cap: "10000000000000",
      maxDebt: "10000000000000",
      totalDebt: "2996624883933",
    }),
    minSwapAmount: "1000000",
  };

  it("allows a well formed mint", () => {
    expect(getMintDisabledReason(ready)).toBeNull();
  });

  it("names the next thing to fix, in order", () => {
    // Connectivity outranks everything, then the wallet, then missing data.
    expect(
      getMintDisabledReason({ ...ready, apiReady: false, address: null }),
    ).toBe("Asset Hub RPC is not connected yet");
    expect(getMintDisabledReason({ ...ready, address: null })).toBe(
      "Please connect your wallet",
    );
    expect(getMintDisabledReason({ ...ready, dataLoading: true })).toBe(
      "Loading PSM data",
    );
    expect(getMintDisabledReason({ ...ready, internal: {} })).toBe(
      "The dotUSD asset is unknown",
    );
    expect(getMintDisabledReason({ ...ready, external: null })).toBe(
      "No approved external asset",
    );
  });

  it("refuses a location it cannot encode", () => {
    expect(
      getMintDisabledReason({
        ...ready,
        external: { ...external, location: { parents: 1, interior: {} } },
      }),
    ).toBe("Unsupported PSM asset location");
  });

  it("reads the circuit breaker", () => {
    expect(
      getMintDisabledReason({
        ...ready,
        external: { ...external, status: "MintingDisabled" },
      }),
    ).toBe("Minting is disabled for this asset");
    expect(
      getMintDisabledReason({
        ...ready,
        external: { ...external, status: "AllDisabled" },
      }),
    ).toBe("Swaps are disabled for this asset");
    expect(
      getMintDisabledReason({ ...ready, external: { ...external, status: null } }),
    ).toBe("Minting availability is unknown");
  });

  it("checks the amount before the balance", () => {
    expect(
      getMintDisabledReason({ ...ready, amount: { amount: null, isEmpty: true } }),
    ).toBe("Please enter an amount");
    expect(
      getMintDisabledReason({
        ...ready,
        amount: { amount: null, isEmpty: false, error: "Invalid amount" },
      }),
    ).toBe("Invalid amount");
    expect(getMintDisabledReason({ ...ready, balanceLoading: true })).toBe(
      "Loading your balance",
    );
    expect(getMintDisabledReason({ ...ready, balance: null })).toBe(
      "Balance information is unavailable",
    );
    expect(getMintDisabledReason({ ...ready, balance: 1_000_000n })).toBe(
      "Insufficient USDt balance",
    );
  });

  it("checks the chain limits", () => {
    const quoteFor = (externalAmount, debt = "2996624883933") =>
      computeMintQuote({
        externalAmount,
        externalDecimals: 6,
        internalDecimals: 6,
        minSwapAmount: "1000000",
        mintingFeePermill: 0,
        debt,
        cap: "10000000000000",
        maxDebt: "10000000000000",
        totalDebt: "2996624883933",
      });

    // Below the 1 dotUSD instance minimum.
    expect(
      getMintDisabledReason({
        ...ready,
        balance: 10_000_000n,
        amount: { amount: 500_000n, isEmpty: false, error: null },
        quote: quoteFor(500_000n),
      }),
    ).toBe("Minimum mint is 1 dotUSD");

    // Already at the ceiling after a reallocation.
    expect(
      getMintDisabledReason({
        ...ready,
        amount: { amount: 2_000_000n, isEmpty: false, error: null },
        quote: quoteFor(2_000_000n, "10000000000000"),
      }),
    ).toBe("This asset is already at its cap");

    // This mint is what pushes it over.
    expect(
      getMintDisabledReason({
        ...ready,
        balance: 20_000_000_000_000n,
        amount: { amount: 8_000_000_000_000n, isEmpty: false, error: null },
        quote: quoteFor(8_000_000_000_000n),
      }),
    ).toBe("Amount exceeds the remaining cap for this asset");
  });
});
