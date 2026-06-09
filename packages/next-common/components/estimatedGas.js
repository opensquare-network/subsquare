import React, { useEffect, useState } from "react";
import { toPrecision } from "next-common/utils";
import { useSignerAccount } from "./popupWithSigner/context";
import { GreyPanel } from "./styled/containers/greyPanel";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import LoadableContent from "./common/loadableContent";
import {
  useFeeAssetType,
  useNativeBalance,
  useAssetBalance,
  FEE_ASSET_TYPES,
  getFeeAssetXcmLocation,
} from "./popupWithSigner/context/feeAsset";
import FeeAssetTypeSwitcher from "./popup/fields/feeAssetTypeSwitcher";

async function convertFeeToAsset(api, partialFee, weight, feeAssetType) {
  if (feeAssetType === FEE_ASSET_TYPES.native) {
    return partialFee;
  }

  if (!api?.call?.transactionPaymentApi?.queryWeightToFee) {
    throw new Error("transactionPaymentApi not available on this chain");
  }
  if (!api?.call?.xcmPaymentApi?.queryWeightToAssetFee) {
    throw new Error("xcmPaymentApi not available on this chain");
  }

  const location = getFeeAssetXcmLocation(feeAssetType);
  if (!location) {
    return partialFee;
  }

  const weightFeeBn = await api.call.transactionPaymentApi.queryWeightToFee(
    weight,
  );
  const nativeWeightFee = BigInt(weightFeeBn.toString());

  const assetWeightFeeResult =
    await api.call.xcmPaymentApi.queryWeightToAssetFee(weight, location);

  if (!assetWeightFeeResult.isOk) {
    throw new Error(`queryWeightToAssetFee failed for ${feeAssetType}`);
  }

  const assetWeightFee = BigInt(assetWeightFeeResult.asOk.toString());
  const nativePartialFee = BigInt(partialFee.toString());

  return (nativePartialFee * assetWeightFee) / nativeWeightFee;
}

export default function EstimatedGas({ getTxFunc }) {
  const api = useContextApi();
  const [accountNonce, setAccountNonce] = useState();
  const [displayFee, setDisplayFee] = useState(null);
  const signerAccount = useSignerAccount();
  const [tx, setTx] = useState(null);
  const [isGasLoading, setIsGasLoading] = useState(false);
  const [isNonceLoading, setIsNonceLoading] = useState(false);
  const { feeAssetType, feeAssetInfo } = useFeeAssetType();

  // Query balance of the selected fee asset for insufficient check
  const { balance: nativeBalance } = useNativeBalance();
  const { balance: assetBalance, isLoading: isAssetBalanceLoading } =
    useAssetBalance(feeAssetInfo.assetId);

  const feeAssetBalance =
    feeAssetType === FEE_ASSET_TYPES.native ? nativeBalance : assetBalance;
  const isBalanceLoading =
    feeAssetType === FEE_ASSET_TYPES.native ? false : isAssetBalanceLoading;

  useEffect(() => {
    if (typeof getTxFunc !== "function") {
      return;
    }
    Promise.resolve()
      .then(getTxFunc)
      .then(setTx)
      .catch(() => setTx(null));
  }, [getTxFunc]);

  useEffect(() => {
    if (!api || !signerAccount?.realAddress) {
      return;
    }
    setIsNonceLoading(true);
    api.query.system
      .account(signerAccount?.realAddress)
      .then((account) => {
        setAccountNonce(account.nonce.toNumber());
      })
      .finally(() => {
        setIsNonceLoading(false);
      });
  }, [api, signerAccount?.realAddress]);

  const address = signerAccount?.realAddress;

  useEffect(() => {
    if (!api || !tx || !address) {
      setDisplayFee(null);
      setIsGasLoading(false);
      return;
    }

    let cancelled = false;
    setIsGasLoading(true);

    tx.paymentInfo(address)
      .then(async (info) => {
        if (cancelled) return;

        if (feeAssetType === FEE_ASSET_TYPES.native) {
          setDisplayFee(info.partialFee);
          return;
        }

        const convertedFee = await convertFeeToAsset(
          api,
          info.partialFee,
          info.weight,
          feeAssetType,
        );

        if (!cancelled) setDisplayFee(convertedFee);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Fee conversion error:", err);
          setDisplayFee(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsGasLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [api, tx, address, feeAssetType]);

  // Determine if the balance is insufficient for the estimated fee
  const isInsufficient =
    feeAssetType !== FEE_ASSET_TYPES.native &&
    !isGasLoading &&
    !isBalanceLoading &&
    displayFee != null &&
    feeAssetBalance != null &&
    BigInt(feeAssetBalance) < BigInt(displayFee);

  return (
    <div className="gap-y-2">
      <GreyPanel className="flex-col gap-y-1 justify-start !items-start text14Medium text-textSecondary px-4 py-2.5 relative">
        <FeeAssetTypeSwitcher />

        <div className="flex gap-x-2 items-center">
          <span>Estimated Gas Fee: </span>
          <LoadableContent isLoading={isGasLoading} size={20}>
            <span>
              {isNil(displayFee)
                ? "-"
                : `≈ ${toPrecision(displayFee, feeAssetInfo.decimals, 4)} ${
                    feeAssetInfo.symbol
                  }`}
            </span>
          </LoadableContent>
        </div>
        <span className="flex gap-x-2">
          Nonce:{" "}
          <LoadableContent isLoading={isNonceLoading} size={20}>
            <span>{!isNil(accountNonce) && accountNonce}</span>
          </LoadableContent>
        </span>
      </GreyPanel>
      {isInsufficient && (
        <span className="text12Medium text-red500 ml-4">
          Insufficient {feeAssetInfo.symbol} balance to pay the transaction fee
        </span>
      )}
    </div>
  );
}
