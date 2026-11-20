import { useCallback, useEffect, useMemo, useState } from "react";
import { useDotUsdContext } from "./context";
import useDotUsdBalance from "./useDotUsdBalance";
import { computeRedeemQuote, getRedeemDisabledReason } from "./redeemUtils";
import {
  buildLocalAssetLocation,
  parseAssetAmount,
  pickDefaultExternal,
  resolveMaxFeePermill,
} from "./psmUtils";

/**
 * The redeem popup's state. It is the mirror of useMintForm: the amount the user types is in
 * dotUSD rather than in the external asset, so the balance that caps it is their dotUSD one.
 */
export default function useRedeemForm({ address, apiReady }) {
  const { data, isLoading: dataLoading } = useDotUsdContext();
  const externals = useMemo(() => data?.externals ?? [], [data]);
  const internal = data?.internalAsset ?? null;

  const [externalIndex, setExternalIndex] = useState(null);
  const [inputAmount, setInputAmount] = useState("");

  const external = useMemo(
    () => pickDefaultExternal(externals, externalIndex),
    [externals, externalIndex],
  );

  // transferrable, not balance: a frozen asset account cannot be burned from.
  const { transferrable, isLoading: balanceLoading } = useDotUsdBalance({
    address,
    assetId: internal?.index,
  });

  // The amount is in dotUSD, which does not change when the payout asset does, but the quote
  // does — so the number stays and only the figure beside it moves.
  useEffect(() => {
    setInputAmount("");
  }, [external?.index]);

  const amount = useMemo(
    () => parseAssetAmount(inputAmount, internal?.decimals),
    [inputAmount, internal?.decimals],
  );

  const quote = useMemo(
    () =>
      computeRedeemQuote({
        internalAmount: amount.amount,
        internalDecimals: internal?.decimals,
        externalDecimals: external?.decimals,
        redemptionFeePermill: external?.redemptionFeePermill,
        minSwapAmount: data?.minSwapAmount,
        debt: external?.debt,
      }),
    [amount.amount, external, internal, data],
  );

  const maxFeePermill = useMemo(
    () => resolveMaxFeePermill(external?.redemptionFeePermill),
    [external?.redemptionFeePermill],
  );

  const internalLocation = useMemo(
    () => buildLocalAssetLocation(internal?.index),
    [internal?.index],
  );
  const externalLocation = useMemo(
    () => buildLocalAssetLocation(external?.index),
    [external?.index],
  );

  const getCheckedAmount = useCallback(() => {
    if (amount.isEmpty) {
      throw new Error("Please enter an amount");
    }

    if (amount.error) {
      throw new Error(amount.error);
    }

    return amount.amount.toString();
  }, [amount]);

  const disabledReason = getRedeemDisabledReason({
    apiReady,
    address,
    dataLoading,
    internal,
    external,
    balanceLoading,
    balance: transferrable,
    amount,
    quote,
    minSwapAmount: data?.minSwapAmount,
  });

  return {
    data,
    dataLoading,
    internal,
    external,
    externals,
    setExternalIndex,
    internalLocation,
    externalLocation,
    inputAmount,
    setInputAmount,
    balance: transferrable,
    balanceLoading,
    quote,
    getCheckedAmount,
    maxFeePermill,
    disabledReason,
  };
}
