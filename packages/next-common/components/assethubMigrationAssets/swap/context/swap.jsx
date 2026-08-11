import { isNil } from "lodash-es";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { toPrecision } from "next-common/utils";
import useApiPoolLocations from "../hooks/useApiPoolLocations";
import useSwapBalances from "../hooks/useSwapBalances";
import useSwapPools from "../hooks/useSwapPools";
import useSwapPreflight from "../hooks/useSwapPreflight";
import useSwapQuote from "../hooks/useSwapQuote";
import { calculateMinimumReceived, getPriceImpact } from "../amm";
import { DEFAULT_SLIPPAGE_BPS } from "../constants";
import { getSwapLocationKey } from "../location";
import {
  calculateMaxAmount,
  isInsufficientBalance,
  parseTokenAmount,
} from "../utils";

const SwapContext = createContext(null);

export function useSwap() {
  const value = useContext(SwapContext);
  if (!value) {
    throw new Error("useSwap must be used within a SwapProvider");
  }
  return value;
}

function getPayBalance({ amountIn, balance, existentialDeposit, tokenIn }) {
  const isNative = tokenIn?.type === "native";

  if (isNil(balance) || (isNative && isNil(existentialDeposit))) {
    return { insufficient: false, maxAmount: null };
  }

  const maxAmount = calculateMaxAmount({
    balance,
    existentialDeposit: existentialDeposit ?? 0n,
    isNative,
  });

  return {
    insufficient: isInsufficientBalance({
      amountIn,
      balance,
      isNative,
      maxAmount,
    }),
    maxAmount,
  };
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

export function SwapProvider({ children }) {
  const api = useAssetHubApi();
  const address = useRealAddress();
  const [amount, setAmount] = useState("");
  const [slippageBps, setSlippageBps] = useState(DEFAULT_SLIPPAGE_BPS);

  const pools = useSwapPools();
  const { tokenIn, tokenOut } = pools;

  const amountIn = parseTokenAmount(amount, tokenIn?.decimals ?? 0);
  const quote = useSwapQuote({ amountIn, tokenIn, tokenOut });
  const minimumReceived = calculateMinimumReceived(quote.quote, slippageBps);
  const balances = useSwapBalances({ address, tokenIn, tokenOut });
  const existentialDeposit = useSwapPreflight();
  const apiPoolLocations = useApiPoolLocations();
  const tokenInIsNative = tokenIn?.type === "native";
  const tokenOutIsNative = tokenOut?.type === "native";
  const poolToken = tokenInIsNative ? tokenOut : tokenIn;
  const poolTokenLocationKey = getSwapLocationKey(poolToken);

  const swapPath = useMemo(() => {
    if (
      !poolTokenLocationKey ||
      tokenInIsNative === tokenOutIsNative ||
      isNil(apiPoolLocations)
    ) {
      return null;
    }
    const poolLocations = apiPoolLocations.get(poolTokenLocationKey);

    if (!poolLocations) {
      return null;
    }

    const { nativeLocation, tokenLocation } = poolLocations;
    return tokenInIsNative
      ? [nativeLocation, tokenLocation]
      : [tokenLocation, nativeLocation];
  }, [
    apiPoolLocations,
    poolTokenLocationKey,
    tokenInIsNative,
    tokenOutIsNative,
  ]);

  const priceImpact = getQuotePriceImpact(quote);
  const payBalance = getPayBalance({
    amountIn,
    balance: balances.tokenIn,
    existentialDeposit,
    tokenIn,
  });

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

  const setAmountByPercentage = useCallback(
    (percentage) => {
      if (isNil(balances.tokenIn) || !tokenIn) {
        return;
      }
      const next = (balances.tokenIn * BigInt(percentage)) / 100n;
      setAmount(toPrecision(next, tokenIn.decimals));
    },
    [balances.tokenIn, tokenIn],
  );

  const setAmountToMax = useCallback(() => {
    if (isNil(payBalance.maxAmount) || !tokenIn) {
      return;
    }
    setAmount(toPrecision(payBalance.maxAmount, tokenIn.decimals));
  }, [payBalance.maxAmount, tokenIn]);

  const value = {
    amount,
    amountIn,
    api,
    balances,
    existentialDeposit,
    getTxFunc,
    minimumReceived,
    pools,
    priceImpact,
    quote,
    setAmount,
    setAmountByPercentage,
    setAmountToMax,
    setSlippageBps,
    slippageBps,
    submitDisabledReason,
  };

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
}
