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
import useSwapPools from "../hooks/useSwapPools";
import useSwapPreflight from "../hooks/useSwapPreflight";
import useWatchTokenBalance from "../hooks/useWatchTokenBalance";
import { DEFAULT_SLIPPAGE_BPS } from "../constants";
import { getSwapLocationKey } from "../location";
import { parseTokenAmount } from "../utils";

const SwapContext = createContext(null);

export function useSwap() {
  const value = useContext(SwapContext);
  if (!value) {
    throw new Error("useSwap must be used within a SwapProvider");
  }
  return value;
}

export function SwapProvider({ children }) {
  const api = useAssetHubApi();
  const address = useRealAddress();
  const [amount, setAmount] = useState("");
  const [slippageBps, setSlippageBps] = useState(DEFAULT_SLIPPAGE_BPS);

  const pools = useSwapPools();
  const { tokenIn, tokenOut } = pools;

  const amountIn = parseTokenAmount(amount, tokenIn?.decimals ?? 0);
  const watchedTokenIn = useWatchTokenBalance({ address, token: tokenIn });
  const watchedTokenOut = useWatchTokenBalance({ address, token: tokenOut });
  const balances = useMemo(
    () => ({
      tokenIn: watchedTokenIn.balance,
      tokenInLoading: watchedTokenIn.loading,
      tokenOut: watchedTokenOut.balance,
      tokenOutLoading: watchedTokenOut.loading,
    }),
    [
      watchedTokenIn.balance,
      watchedTokenIn.loading,
      watchedTokenOut.balance,
      watchedTokenOut.loading,
    ],
  );
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

  const value = useMemo(
    () => ({
      address,
      amount,
      amountIn,
      api,
      balances,
      existentialDeposit,
      pools,
      setAmount,
      setAmountByPercentage,
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
      pools,
      setAmountByPercentage,
      slippageBps,
      swapPath,
    ],
  );

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
}
