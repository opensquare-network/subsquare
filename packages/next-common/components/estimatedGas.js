import { useEffect, useState, useCallback, useRef } from "react";
import { createGlobalState } from "react-use";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useSignerAccount } from "./popupWithSigner/context";
import { GreyPanel } from "./styled/containers/greyPanel";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import LoadableContent from "./common/loadableContent";
import {
  AssetIconDot,
  AssetIconUsdc,
  AssetIconUsdt,
} from "@osn/icons/subsquare";
import {
  useFeeAssetType,
  FEE_ASSET_TYPES,
  STABLE_COIN_DECIMALS,
  getFeeAssetXcmLocation,
} from "./popupWithSigner/context/feeAsset";

export const useGasFeeEstimate = createGlobalState(null);

const FEE_ASSET_CONFIG = {
  [FEE_ASSET_TYPES.native]: {
    label: null,
    icon: AssetIconDot,
    iconClass: "",
  },
  [FEE_ASSET_TYPES.USDC]: {
    label: "USDC",
    icon: AssetIconUsdc,
    iconClass: "",
  },
  [FEE_ASSET_TYPES.USDT]: {
    label: "USDT",
    icon: AssetIconUsdt,
    iconClass: "",
  },
};

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
  const [displayFee, setDisplayFee] = useState(null); // fee in the selected asset
  const { decimals, symbol } = useChainSettings();
  const signerAccount = useSignerAccount();
  const [tx, setTx] = useState(null);
  const [isGasLoading, setIsGasLoading] = useState(false);
  const [isNonceLoading, setIsNonceLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { feeAssetType, setFeeAssetType } = useFeeAssetType();
  const dropdownRef = useRef(null);

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
        if (cancelled) {
          return;
        }

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

        if (!cancelled) {
          setDisplayFee(convertedFee);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Fee conversion error:", err);
          setDisplayFee(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsGasLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [api, tx, address, feeAssetType]);

  const setGasFeeEstimate = useGasFeeEstimate()[1];
  useEffect(() => {
    setGasFeeEstimate({
      amount: displayFee,
      assetType: feeAssetType,
      isLoading: isGasLoading,
    });
  }, [displayFee, feeAssetType, isGasLoading, setGasFeeEstimate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  const handleFeeAssetChange = useCallback(
    (type) => {
      setFeeAssetType(type);
      setShowDropdown(false);
    },
    [setFeeAssetType],
  );

  const getDisplayDecimals = () =>
    feeAssetType === FEE_ASSET_TYPES.native ? decimals : STABLE_COIN_DECIMALS;

  const getDisplaySymbol = () =>
    feeAssetType === FEE_ASSET_TYPES.native
      ? symbol
      : FEE_ASSET_CONFIG[feeAssetType]?.label;

  const currentConfig =
    FEE_ASSET_CONFIG[feeAssetType] || FEE_ASSET_CONFIG.native;
  const FeeIcon = currentConfig.icon;

  return (
    <GreyPanel className="flex-col gap-y-1 justify-start !items-start text14Medium text-textSecondary px-4 py-2.5 relative">
      <div className="absolute top-2 right-2" ref={dropdownRef}>
        <button
          className="flex items-center gap-x-1 p-1 rounded hover:bg-neutral-200 transition-colors"
          onClick={() => setShowDropdown(!showDropdown)}
          title={`Switch fee asset (current: ${
            feeAssetType === FEE_ASSET_TYPES.native ? symbol : feeAssetType
          })`}
        >
          <FeeIcon className="w-4 h-4" />
          <svg
            className={`w-2.5 h-2.5 transition-transform ${
              showDropdown ? "rotate-180" : ""
            }`}
            viewBox="0 0 10 6"
            fill="none"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 py-1 min-w-[120px]">
            {Object.values(FEE_ASSET_TYPES).map((type) => {
              const config = FEE_ASSET_CONFIG[type];
              const OptionIcon = config.icon;
              const displayLabel =
                type === FEE_ASSET_TYPES.native ? symbol : config.label;
              const isActive = feeAssetType === type;

              return (
                <button
                  key={type}
                  className={`flex items-center gap-x-2 w-full px-3 py-2 text12Medium hover:bg-neutral-100 transition-colors ${
                    isActive
                      ? "text-theme500 bg-neutral-50"
                      : "text-textPrimary"
                  }`}
                  onClick={() => handleFeeAssetChange(type)}
                >
                  <OptionIcon className="w-4 h-4" />
                  <span>{displayLabel}</span>
                  {isActive && (
                    <svg
                      className="w-3.5 h-3.5 ml-auto"
                      viewBox="0 0 14 14"
                      fill="currentColor"
                    >
                      <path
                        d="M11.5 3.5L5.5 10.5L2.5 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

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
  );
}
