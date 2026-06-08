import React, { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useSignerAccount } from "./popupWithSigner/context";
import { GreyPanel } from "./styled/containers/greyPanel";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import LoadableContent from "./common/loadableContent";
import {
  useFeeAssetType,
  FEE_ASSET_TYPES,
  STABLE_COIN_DECIMALS,
  USDC_ASSET_ID,
  USDT_ASSET_ID,
  getFeeAssetXcmLocation,
} from "./popupWithSigner/context/feeAsset";
import FeeAssetTypeSwitcher from "./popup/fields/feeAssetTypeSwitcher";

function useAssetBalance(api, assetId, address) {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!api || !address || assetId == null) {
      setBalance(null);
      return;
    }
    setIsLoading(true);
    api.query.assets
      .account(assetId, address)
      .then((data) => {
        const b = data?.balance;
        setBalance(b != null ? BigInt(b.toString()) : 0n);
      })
      .catch(() => setBalance(0n))
      .finally(() => setIsLoading(false));
  }, [api, address, assetId]);

  return { balance, isLoading };
}

function getFeeAssetId(feeAssetType) {
  if (feeAssetType === FEE_ASSET_TYPES.USDC) return USDC_ASSET_ID;
  if (feeAssetType === FEE_ASSET_TYPES.USDT) return USDT_ASSET_ID;
  return null;
}

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
  const { decimals, symbol } = useChainSettings();
  const signerAccount = useSignerAccount();
  const [tx, setTx] = useState(null);
  const [isGasLoading, setIsGasLoading] = useState(false);
  const [isNonceLoading, setIsNonceLoading] = useState(false);
  const { feeAssetType } = useFeeAssetType();

  // Query balance of the selected fee asset for insufficient check
  const assetId = getFeeAssetId(feeAssetType);
  const { balance: feeAssetBalance, isLoading: isBalanceLoading } =
    useAssetBalance(api, assetId, signerAccount?.realAddress);

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

  const getDisplayDecimals = () =>
    feeAssetType === FEE_ASSET_TYPES.native ? decimals : STABLE_COIN_DECIMALS;

  const getDisplaySymbol = () =>
    feeAssetType === FEE_ASSET_TYPES.native ? symbol : feeAssetType;

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
                : `≈ ${toPrecision(
                    displayFee,
                    getDisplayDecimals(),
                    4,
                  )} ${getDisplaySymbol()}`}
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
          Insufficient {getDisplaySymbol()} balance to pay the transaction fee
        </span>
      )}
    </div>
  );
}
