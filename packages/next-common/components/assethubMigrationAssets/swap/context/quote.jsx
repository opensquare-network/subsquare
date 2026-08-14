import { isNil } from "lodash-es";
import { createContext, useCallback, useContext, useMemo } from "react";
import { calculateMinimumReceived, getPriceImpact } from "../amm";
import useSwapQuoteState from "../hooks/useSwapQuote";
import { useSwap } from "./swap";

const SwapQuoteContext = createContext(null);

export function useSwapQuote() {
  const value = useContext(SwapQuoteContext);
  if (!value) {
    throw new Error("useSwapQuote must be used within a SwapQuoteProvider");
  }
  return value;
}

function getQuotePriceImpact({ feeAdjustedSpotOut, quote }) {
  if (isNil(quote) || isNil(feeAdjustedSpotOut)) {
    return null;
  }
  return getPriceImpact(feeAdjustedSpotOut, quote);
}

function getSubmitDisabledReason({
  address,
  amountIn,
  api,
  balances,
  minimumReceived,
  payBalance,
  pools,
  quote,
  swapPath,
}) {
  if (!api) {
    return "Asset Hub network is not connected yet";
  }
  if (!address) {
    return "Please connect your wallet";
  }
  if (pools.loading) {
    return "Loading liquidity pools";
  }
  if (!pools.tokenIn || !pools.tokenOut) {
    return "Please select a token pair";
  }
  if (amountIn <= 0n) {
    return "Please enter an amount";
  }
  if (quote.loading) {
    return "Fetching a swap quote";
  }
  if (quote.error) {
    return "Unable to refresh the swap quote. Please try again";
  }
  if (isNil(quote.quote) || isNil(minimumReceived)) {
    return "No quote is available for this amount";
  }
  if (!swapPath) {
    return "No swap route is available for this token pair";
  }
  if (balances.tokenInLoading) {
    return "Loading your balance";
  }
  if (isNil(payBalance.maxAmount)) {
    return "Balance information is unavailable";
  }
  if (payBalance.insufficient) {
    return "Insufficient balance";
  }
  return null;
}

export function SwapQuoteProvider({ children }) {
  const {
    address,
    amountIn,
    api,
    balances,
    payBalance,
    pools,
    slippageBps,
    swapPath,
  } = useSwap();
  const { tokenIn, tokenOut } = pools;
  const quote = useSwapQuoteState({ amountIn, tokenIn, tokenOut });
  const minimumReceived = calculateMinimumReceived(quote.quote, slippageBps);
  const priceImpact = getQuotePriceImpact(quote);

  const canBuildTx = Boolean(
    api &&
      address &&
      tokenIn &&
      swapPath &&
      amountIn > 0n &&
      !isNil(minimumReceived),
  );
  const submitDisabledReason = getSubmitDisabledReason({
    address,
    amountIn,
    api,
    balances,
    minimumReceived,
    payBalance,
    pools,
    quote,
    swapPath,
  });

  const getTxFunc = useCallback(() => {
    if (!canBuildTx) {
      return null;
    }

    return api.tx.assetConversion.swapExactTokensForTokens(
      swapPath,
      amountIn.toString(),
      minimumReceived.toString(),
      address,
      tokenIn.type === "native",
    );
  }, [address, amountIn, api, canBuildTx, minimumReceived, swapPath, tokenIn]);

  const value = useMemo(
    () => ({
      getTxFunc,
      minimumReceived,
      priceImpact,
      quote,
      submitDisabledReason,
    }),
    [getTxFunc, minimumReceived, priceImpact, quote, submitDisabledReason],
  );

  return (
    <SwapQuoteContext.Provider value={value}>
      {children}
    </SwapQuoteContext.Provider>
  );
}
