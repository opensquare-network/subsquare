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

export function SwapProvider({ children }) {
  const api = useAssetHubApi();
  const address = useRealAddress();
  const [amount, setAmount] = useState("");
  const [slippageBps, setSlippageBps] = useState(DEFAULT_SLIPPAGE_BPS);

  const pools = useSwapPools();
  const { tokenIn, tokenOut } = pools;

  const amountIn = parseTokenAmount(amount, tokenIn?.decimals ?? 0);
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

  const payBalance = getPayBalance({
    amountIn,
    balance: balances.tokenIn,
    existentialDeposit,
    tokenIn,
  });

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

  const value = useMemo(
    () => ({
      address,
      amount,
      amountIn,
      api,
      balances,
      existentialDeposit,
      payBalance,
      pools,
      setAmount,
      setAmountByPercentage,
      setAmountToMax,
      setSlippageBps,
      slippageBps,
      swapPath,
    }),
    [
      address,
      amount,
      amountIn,
      api,
      balances,
      existentialDeposit,
      payBalance,
      pools,
      setAmountByPercentage,
      setAmountToMax,
      slippageBps,
      swapPath,
    ],
  );

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
}
