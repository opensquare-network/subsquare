import { useCallback, useEffect, useMemo, useState } from "react";
import { useDotUsdContext } from "./context";
import useDotUsdBalance from "./useDotUsdBalance";
import { computeMintQuote, getMintDisabledReason } from "./mintUtils";
import {
  buildLocalAssetLocation,
  parseAssetAmount,
  pickDefaultExternal,
  resolveMaxFeePermill,
} from "./psmUtils";

/**
 * The mint popup's state: which external asset is being paid with, how much, what that would
 * yield, and whether it can be submitted. The arithmetic lives in mintUtils; this only wires it
 * to the page's PSM data and to the connected account's balance.
 */
export default function useMintForm({ address, apiReady }) {
  const { data, isLoading: dataLoading } = useDotUsdContext();
  const externals = useMemo(() => data?.externals ?? [], [data]);
  const internal = data?.internalAsset ?? null;

  const [externalIndex, setExternalIndex] = useState(null);
  const [inputAmount, setInputAmount] = useState("");

  const external = useMemo(
    () => pickDefaultExternal(externals, externalIndex),
    [externals, externalIndex],
  );

  // transferrable rather than balance: a frozen asset account shows a balance the PSM cannot
  // debit. Subscribed, so it follows the mint that just spent it.
  const { transferrable, isLoading: balanceLoading } = useDotUsdBalance({
    address,
    assetId: external?.index,
  });

  // The amount is denominated in the asset being paid with, so a number typed against the
  // previous asset's decimals must not survive a switch.
  useEffect(() => {
    setInputAmount("");
  }, [external?.index]);

  const amount = useMemo(
    () => parseAssetAmount(inputAmount, external?.decimals),
    [inputAmount, external?.decimals],
  );

  const quote = useMemo(
    () =>
      computeMintQuote({
        externalAmount: amount.amount,
        externalDecimals: external?.decimals,
        internalDecimals: internal?.decimals,
        minSwapAmount: data?.minSwapAmount,
        mintingFeePermill: external?.mintingFeePermill,
        debt: external?.debt,
        cap: external?.cap,
        maxDebt: data?.maxDebt,
        totalDebt: data?.totalDebt,
      }),
    [amount.amount, external, internal, data],
  );

  const maxFeePermill = useMemo(
    () => resolveMaxFeePermill(external?.mintingFeePermill),
    [external?.mintingFeePermill],
  );

  const internalLocation = useMemo(
    () => buildLocalAssetLocation(internal?.index),
    [internal?.index],
  );
  const externalLocation = useMemo(
    () => buildLocalAssetLocation(external?.index),
    [external?.index],
  );

  // Throws, so the tx builder can turn it into a toast — the same contract as
  // useTransferAmount's getCheckedValue.
  const getCheckedAmount = useCallback(() => {
    if (amount.isEmpty) {
      throw new Error("Please enter an amount");
    }

    if (amount.error) {
      throw new Error(amount.error);
    }

    return amount.amount.toString();
  }, [amount]);

  const disabledReason = getMintDisabledReason({
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
