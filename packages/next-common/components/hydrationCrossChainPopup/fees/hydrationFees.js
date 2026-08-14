import {
  DOT_SYMBOL,
  getFeeAssetLocation,
  getTransferAsset,
  USDC_SYMBOL,
  USDT_SYMBOL,
} from "../transferAssets";

// Hydration's MultiTransactionPayment currency ids for the supported symbols
// (verified on-chain against assetRegistry: DOT=5, USDT=10, USDC=22).
const HYDRATION_FEE_CURRENCY_IDS = {
  [DOT_SYMBOL]: 5,
  [USDC_SYMBOL]: 22,
  [USDT_SYMBOL]: 10,
};

// Hydration source fee: resolve the signer's fee currency, then convert the
// native fee into it when a supported currency is configured. `partialFee` is
// the already-converted BigInt weight fee, `weight` the payment-info weight
// codec used for the conversions.
export async function estimateHydrationSourceFee({
  sourceApi,
  sourceChain,
  address,
  partialFee,
  weight,
  nativeSymbol,
  nativeDecimals,
}) {
  const {
    symbol: feeSymbol,
    decimals: feeDecimals,
    location,
  } = await getHydrationFeeCurrency({
    api: sourceApi,
    sourceChain,
    address,
    nativeSymbol,
    nativeDecimals,
  });

  if (!location) {
    return { amount: partialFee, symbol: feeSymbol, decimals: feeDecimals };
  }

  try {
    const converted = await convertNativeFeeToAsset({
      api: sourceApi,
      partialFee,
      weight,
      location,
    });
    return { amount: converted, symbol: feeSymbol, decimals: feeDecimals };
  } catch (e) {
    console.error("Hydration fee currency conversion failed:", e);
    return {
      amount: partialFee,
      symbol: nativeSymbol,
      decimals: nativeDecimals,
    };
  }
}

// Resolves the fee currency a Hydration account pays with. Returns the native
// currency when none is configured; the `location` (XcmVersionedAssetId) is
// only set for supported symbols, which is what enables the fee conversion.
async function getHydrationFeeCurrency({
  api,
  sourceChain,
  address,
  nativeSymbol,
  nativeDecimals,
}) {
  let assetId = 0;
  try {
    const currency =
      await api.query.multiTransactionPayment?.accountCurrencyMap?.(address);
    assetId = currency?.isSome ? Number(currency.unwrap().toString()) : 0;
  } catch (e) {
    console.error("MultiTransactionPayment query failed:", e);
    assetId = 0;
  }

  if (assetId === 0) {
    return { symbol: nativeSymbol, decimals: nativeDecimals, location: null };
  }

  const known = Object.entries(HYDRATION_FEE_CURRENCY_IDS).find(
    ([, id]) => id === assetId,
  );
  if (known) {
    const [symbol] = known;
    const asset = getTransferAsset(symbol);
    return {
      symbol,
      decimals: asset.decimals,
      location: getFeeAssetLocation({ chain: sourceChain, symbol }),
    };
  }

  // Unsupported fee currency: fall back to showing the native HDX fee.
  console.warn(
    `Unsupported Hydration fee currency id ${assetId}, falling back to ${nativeSymbol}`,
  );
  return { symbol: nativeSymbol, decimals: nativeDecimals, location: null };
}

// Converts a native-asset weight fee into the requested fee asset, using the
// weight-based conversion (same approach as next-common/hooks/useGasFeeEstimate).
async function convertNativeFeeToAsset({ api, partialFee, weight, location }) {
  const weightFee = await api.call.transactionPaymentApi.queryWeightToFee(
    weight,
  );
  const nativeWeightFee = BigInt(weightFee.toString());

  const assetWeightFeeResult =
    await api.call.xcmPaymentApi.queryWeightToAssetFee(weight, location);
  if (!assetWeightFeeResult.isOk) {
    throw new Error("queryWeightToAssetFee failed");
  }

  const assetWeightFee = BigInt(assetWeightFeeResult.asOk.toString());
  return (partialFee * assetWeightFee) / nativeWeightFee;
}
