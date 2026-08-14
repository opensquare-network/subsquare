import { isNil } from "lodash-es";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFeeAssetConfig } from "next-common/components/popupWithSigner/context/feeAsset";
import useGasFeeEstimate from "next-common/hooks/useGasFeeEstimate";
import { toPrecision } from "next-common/utils";
import { calculateMinimumReceived, getPriceImpact } from "../amm";
import useSwapQuoteState from "../hooks/useSwapQuote";
import { getFeeEstimateTx, getPayBalance, isFeeAssetToken } from "../utils";
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
  gasFee,
  isGasFeeLoading,
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
  if (payBalance.insufficient) {
    return "Insufficient balance";
  }
  if (isGasFeeLoading) {
    return "Estimating transaction fee";
  }
  if (isNil(gasFee)) {
    return "Unable to estimate transaction fee";
  }
  if (isNil(payBalance.maxAmount)) {
    return "Balance information is unavailable";
  }
  if (payBalance.insufficientFee) {
    return "Insufficient balance to pay the transaction fee";
  }
  return null;
}

function useMaxFeeEstimate({ feeAssetType, gasFee, isGasFeeLoading }) {
  const previousFeeAssetType = useRef(feeAssetType);
  const [lastSuccessfulEstimate, setLastSuccessfulEstimate] = useState({
    feeAssetType,
    value: null,
  });

  useEffect(() => {
    if (previousFeeAssetType.current !== feeAssetType) {
      previousFeeAssetType.current = feeAssetType;
      setLastSuccessfulEstimate({ feeAssetType, value: null });
      return;
    }

    if (!isNil(gasFee)) {
      setLastSuccessfulEstimate({
        feeAssetType,
        value: BigInt(gasFee.toString()),
      });
      return;
    }

    if (!isGasFeeLoading) {
      setLastSuccessfulEstimate({ feeAssetType, value: null });
    }
  }, [feeAssetType, gasFee, isGasFeeLoading]);

  if (lastSuccessfulEstimate.feeAssetType !== feeAssetType) {
    return null;
  }

  if (!isNil(gasFee)) {
    return BigInt(gasFee.toString());
  }

  return isGasFeeLoading ? lastSuccessfulEstimate.value : null;
}

function useSwapTransaction({
  address,
  amountIn,
  api,
  existentialDeposit,
  feeAssetType,
  minimumReceived,
  swapPath,
  tokenIn,
}) {
  const getTxFunc = useCallback(() => {
    if (
      !api ||
      !address ||
      !tokenIn ||
      !swapPath ||
      amountIn <= 0n ||
      isNil(minimumReceived)
    ) {
      return null;
    }

    return api.tx.assetConversion.swapExactTokensForTokens(
      swapPath,
      amountIn.toString(),
      minimumReceived.toString(),
      address,
      tokenIn.type === "native",
    );
  }, [address, amountIn, api, minimumReceived, swapPath, tokenIn]);

  const getFakeTxFunc = useCallback(() => {
    if (
      !api ||
      !address ||
      !tokenIn ||
      !swapPath ||
      (tokenIn.type === "native" && isNil(existentialDeposit))
    ) {
      return null;
    }

    const fakeAmountIn =
      tokenIn.type === "native" ? existentialDeposit || 1n : 1n;
    return api.tx.assetConversion.swapExactTokensForTokens(
      swapPath,
      fakeAmountIn.toString(),
      "0",
      address,
      tokenIn.type === "native",
    );
  }, [address, api, existentialDeposit, swapPath, tokenIn]);

  const getFeeTxFunc = useCallback(
    () => getFeeEstimateTx(getTxFunc, getFakeTxFunc),
    [getFakeTxFunc, getTxFunc],
  );
  const { gasFee, isGasFeeLoading } = useGasFeeEstimate(
    getFeeTxFunc,
    feeAssetType,
  );
  const estimatedFee = useMaxFeeEstimate({
    feeAssetType,
    gasFee,
    isGasFeeLoading,
  });

  return {
    estimatedFee,
    gasFee,
    getTxFunc,
    isGasFeeLoading,
  };
}

function useSwapPayBalance({
  amountIn,
  balance,
  estimatedFee,
  existentialDeposit,
  feeAssetInfo,
  setAmount,
  tokenIn,
}) {
  const feePaidFromInput = isFeeAssetToken(tokenIn, feeAssetInfo);

  const payBalance = getPayBalance({
    amountIn,
    balance,
    estimatedFee,
    existentialDeposit,
    feePaidFromInput,
    isNative: tokenIn?.type === "native",
  });

  const setAmountToMax = useCallback(() => {
    if (isNil(payBalance.maxAmount) || !tokenIn) {
      return;
    }
    setAmount(toPrecision(payBalance.maxAmount, tokenIn.decimals));
  }, [payBalance.maxAmount, setAmount, tokenIn]);

  return { payBalance, setAmountToMax };
}

export function SwapQuoteProvider({ children }) {
  const {
    address,
    amountIn,
    api,
    balances,
    existentialDeposit,
    pools,
    slippageBps,
    swapPath,
    setAmount,
  } = useSwap();
  const { feeAssetInfo, feeAssetType } = useFeeAssetConfig();
  const { tokenIn, tokenOut } = pools;
  const quote = useSwapQuoteState({ amountIn, tokenIn, tokenOut });
  const minimumReceived = calculateMinimumReceived(quote.quote, slippageBps);
  const priceImpact = getQuotePriceImpact(quote);

  const { estimatedFee, gasFee, getTxFunc, isGasFeeLoading } =
    useSwapTransaction({
      address,
      amountIn,
      api,
      existentialDeposit,
      feeAssetType,
      minimumReceived,
      swapPath,
      tokenIn,
    });
  const { payBalance, setAmountToMax } = useSwapPayBalance({
    amountIn,
    balance: balances.tokenIn,
    estimatedFee,
    existentialDeposit,
    feeAssetInfo,
    setAmount,
    tokenIn,
  });

  const submitDisabledReason = getSubmitDisabledReason({
    address,
    amountIn,
    api,
    balances,
    gasFee: estimatedFee,
    isGasFeeLoading,
    minimumReceived,
    payBalance,
    pools,
    quote,
    swapPath,
  });

  const value = useMemo(
    () => ({
      gasFee,
      getTxFunc,
      isGasFeeLoading,
      minimumReceived,
      payBalance,
      priceImpact,
      quote,
      setAmountToMax,
      submitDisabledReason,
    }),
    [
      gasFee,
      getTxFunc,
      isGasFeeLoading,
      minimumReceived,
      payBalance,
      priceImpact,
      quote,
      setAmountToMax,
      submitDisabledReason,
    ],
  );

  return (
    <SwapQuoteContext.Provider value={value}>
      {children}
    </SwapQuoteContext.Provider>
  );
}
