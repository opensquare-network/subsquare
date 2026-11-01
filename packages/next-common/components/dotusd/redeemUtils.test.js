import { describe, expect, it } from "vitest";
import { computeRedeemQuote, getRedeemDisabledReason } from "./redeemUtils";

// Values below are copied from Polkadot Asset Hub storage reads: the pair is dotUSD/USDt,
// both 6 decimals, redemption fee 100 permill (0.01%), min_swap_amount 1 dotUSD.
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
  redemptionFeePermill: 100,
  debt: "2878244935005",
};

describe("computeRedeemQuote", () => {
  const base = {
    internalDecimals: 6,
    externalDecimals: 6,
    redemptionFeePermill: 100,
    minSwapAmount: "1000000",
    debt: "2878244935005",
  };

  it("mirrors the pallet maths for a 1:1 pair", () => {
    const quote = computeRedeemQuote({ ...base, internalAmount: 1_000_000n });

    // 0.01% of 1 dotUSD ceils to a single planck.
    expect(quote.fee).toBe(100n);
    expect(quote.internalNet).toBe(999_900n);
    expect(quote.externalOut).toBe(999_900n);
    expect(quote.effectiveInternalNet).toBe(999_900n);
    expect(quote.consumed).toBe(1_000_000n);
    expect(quote.belowMinimum).toBe(false);
    expect(quote.exceedsDebt).toBe(false);
  });

  it("takes the fee with ceiling rounding", () => {
    // 0.01% of 3 planck is 0.0003, which still rounds up to a whole planck.
    const dust = computeRedeemQuote({
      ...base,
      internalAmount: 3n,
      minSwapAmount: "0",
    });
    expect(dust.fee).toBe(1n);
    expect(dust.internalNet).toBe(2n);
    expect(dust.externalOut).toBe(2n);
  });

  it("leaves truncation dust with the user", () => {
    // External with more decimals multiplies up, so nothing is lost going out; coming back
    // the other way is a floor divide, which is where dust would appear.
    const up = computeRedeemQuote({
      ...base,
      internalAmount: 1_000_000n,
      externalDecimals: 10,
      redemptionFeePermill: 0,
    });
    expect(up.externalOut).toBe(10_000_000_000n);
    expect(up.effectiveInternalNet).toBe(1_000_000n);
    expect(up.consumed).toBe(1_000_000n);

    // Going out to a coarser asset floors, and the round trip burns only what survived:
    // 1.000001 dotUSD floors to 1.0000 of a 4 decimal asset.
    const down = computeRedeemQuote({
      ...base,
      internalAmount: 1_000_001n,
      externalDecimals: 4,
      redemptionFeePermill: 0,
    });
    expect(down.externalOut).toBe(10_000n);
    expect(down.effectiveInternalNet).toBe(1_000_000n);
    // The 1 planck of dust stays behind, so less is consumed than was typed.
    expect(down.consumed).toBe(1_000_000n);
  });

  it("flags a payout that rounds away", () => {
    const quote = computeRedeemQuote({
      ...base,
      internalAmount: 1_000_000n,
      externalDecimals: 2,
    });
    // 0.9999 dotUSD floors to 99 whole cents-worth of a 2 decimal asset.
    expect(quote.externalOut).toBe(99n);
    expect(quote.amountTooSmall).toBe(false);

    const tiny = computeRedeemQuote({
      ...base,
      internalAmount: 1n,
      minSwapAmount: "0",
      redemptionFeePermill: 0,
      externalDecimals: 10,
    });
    expect(tiny.externalOut).toBe(10_000n);
    expect(tiny.amountTooSmall).toBe(false);
  });

  it("flags the instance minimum against the raw amount", () => {
    expect(
      computeRedeemQuote({ ...base, internalAmount: 999_999n }).belowMinimum,
    ).toBe(true);
    expect(
      computeRedeemQuote({ ...base, internalAmount: 1_000_000n }).belowMinimum,
    ).toBe(false);
  });

  it("flags redeeming past the pair's outstanding debt", () => {
    // The debt is compared against what actually gets burned, so the fee has to be out of the
    // way before the boundary is the debt itself.
    const atDebt = { ...base, minSwapAmount: "0", redemptionFeePermill: 0 };

    expect(
      computeRedeemQuote({
        ...atDebt,
        internalAmount: 2_878_244_935_005n,
      }).exceedsDebt,
    ).toBe(false);
    expect(
      computeRedeemQuote({
        ...atDebt,
        internalAmount: 2_878_244_935_006n,
      }).exceedsDebt,
    ).toBe(true);
  });

  it("returns null without an amount", () => {
    expect(computeRedeemQuote({ ...base, internalAmount: null })).toBeNull();
    expect(computeRedeemQuote({ ...base, internalAmount: 0n })).toBeNull();
  });
});

describe("getRedeemDisabledReason", () => {
  const ready = {
    apiReady: true,
    address: "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5",
    dataLoading: false,
    internal,
    external,
    balanceLoading: false,
    balance: 10_000_000n,
    amount: { amount: 2_000_000n, isEmpty: false, error: null },
    quote: computeRedeemQuote({
      internalAmount: 2_000_000n,
      internalDecimals: 6,
      externalDecimals: 6,
      redemptionFeePermill: 100,
      minSwapAmount: "1000000",
      debt: "2878244935005",
    }),
    minSwapAmount: "1000000",
  };

  it("allows a well formed redeem", () => {
    expect(getRedeemDisabledReason(ready)).toBeNull();
  });

  it("names the next thing to fix, in order", () => {
    expect(
      getRedeemDisabledReason({ ...ready, apiReady: false, address: null }),
    ).toBe("Asset Hub RPC is not connected yet");
    expect(getRedeemDisabledReason({ ...ready, address: null })).toBe(
      "Please connect your wallet",
    );
    expect(getRedeemDisabledReason({ ...ready, dataLoading: true })).toBe(
      "Loading PSM data",
    );
    expect(getRedeemDisabledReason({ ...ready, internal: {} })).toBe(
      "The dotUSD asset is unknown",
    );
    expect(getRedeemDisabledReason({ ...ready, external: null })).toBe(
      "No approved external asset",
    );
    expect(
      getRedeemDisabledReason({
        ...ready,
        external: { ...external, location: { parents: 1, interior: {} } },
      }),
    ).toBe("Unsupported PSM asset location");
  });

  it("keeps redeeming open while minting is disabled", () => {
    // The middle circuit breaker state is redeem-only, so it must not block here.
    expect(
      getRedeemDisabledReason({
        ...ready,
        external: { ...external, status: "MintingDisabled" },
      }),
    ).toBeNull();
    expect(
      getRedeemDisabledReason({
        ...ready,
        external: { ...external, status: "AllDisabled" },
      }),
    ).toBe("Swaps are disabled for this asset");
    expect(
      getRedeemDisabledReason({
        ...ready,
        external: { ...external, status: null },
      }),
    ).toBe("Redemption availability is unknown");
  });

  it("checks the amount before the balance", () => {
    expect(
      getRedeemDisabledReason({ ...ready, amount: { amount: null, isEmpty: true } }),
    ).toBe("Please enter an amount");
    expect(
      getRedeemDisabledReason({
        ...ready,
        amount: { amount: null, isEmpty: false, error: "Invalid amount" },
      }),
    ).toBe("Invalid amount");
    expect(getRedeemDisabledReason({ ...ready, balanceLoading: true })).toBe(
      "Loading your balance",
    );
    expect(getRedeemDisabledReason({ ...ready, balance: null })).toBe(
      "Balance information is unavailable",
    );
    expect(getRedeemDisabledReason({ ...ready, balance: 1_000_000n })).toBe(
      "Insufficient dotUSD balance",
    );
  });

  it("checks the chain limits", () => {
    const quoteFor = (internalAmount) =>
      computeRedeemQuote({
        internalAmount,
        internalDecimals: 6,
        externalDecimals: 6,
        redemptionFeePermill: 100,
        minSwapAmount: "1000000",
        debt: "2878244935005",
      });

    expect(
      getRedeemDisabledReason({
        ...ready,
        balance: 10_000_000n,
        amount: { amount: 500_000n, isEmpty: false, error: null },
        quote: quoteFor(500_000n),
      }),
    ).toBe("Minimum redeem is 1 dotUSD");

    // Redeeming more of an asset than is still outstanding against it.
    expect(
      getRedeemDisabledReason({
        ...ready,
        balance: 10_000_000n,
        amount: { amount: 2_000_000n, isEmpty: false, error: null },
        external: { ...external, debt: "1000000" },
        quote: computeRedeemQuote({
          internalAmount: 2_000_000n,
          internalDecimals: 6,
          externalDecimals: 6,
          redemptionFeePermill: 100,
          minSwapAmount: "1000000",
          debt: "1000000",
        }),
      }),
    ).toBe("Amount exceeds what the PSM can redeem for this asset");
  });
});
