import { useCallback, useRef, useState, useEffect } from "react";
import { useChain, useChainSettings } from "next-common/context/chain";
import {
  useFeeAssetType,
  useNativeBalance,
  useAssetBalance,
  getFeeAssetTypeKey,
  FEE_ASSET_TYPES,
  STABLE_COIN_DECIMALS,
  USDC_ASSET_ID,
  USDT_ASSET_ID,
} from "next-common/components/popupWithSigner/context/feeAsset";
import { toPrecision } from "next-common/utils";
import {
  AssetIconDot,
  AssetIconKsm,
  AssetIconUsdc,
  AssetIconUsdt,
} from "@osn/icons/subsquare";
import { ChevronDown, CheckIcon } from "./feeAssetSvgs";

function getFeeAssetOptions(chain) {
  if (chain === "kusama") {
    return [
      { type: FEE_ASSET_TYPES.native, label: null, assetId: null },
      { type: FEE_ASSET_TYPES.USDT, label: "USDt", assetId: USDT_ASSET_ID },
    ];
  }
  // polkadot, paseo: native + USDC(1337) + USDT(1984)
  return [
    { type: FEE_ASSET_TYPES.native, label: null, assetId: null },
    { type: FEE_ASSET_TYPES.USDC, label: "USDC", assetId: USDC_ASSET_ID },
    { type: FEE_ASSET_TYPES.USDT, label: "USDT", assetId: USDT_ASSET_ID },
  ];
}

function NativeSymbolIcon({ className = "w-4 h-4" }) {
  const chain = useChain();
  return chain === "kusama" ? (
    <AssetIconKsm className={className} />
  ) : (
    <AssetIconDot className={className} />
  );
}

function FeeIcon({ type, className = "w-4 h-4" }) {
  if (type === FEE_ASSET_TYPES.native) {
    return <NativeSymbolIcon className={className} />;
  }
  if (type === FEE_ASSET_TYPES.USDC) {
    return <AssetIconUsdc className={className} />;
  }
  return <AssetIconUsdt className={className} />;
}

function NativeAssetOption({ label, isActive, onClick }) {
  const { decimals } = useChainSettings();
  const { balance, isLoading } = useNativeBalance();

  const formatted = balance != null ? toPrecision(balance, decimals, 4) : null;

  return (
    <button
      className={`flex items-center w-full px-3 py-2 text12Medium hover:bg-neutral200 transition-colors ${
        isActive ? "text-theme500 bg-neutral200" : "text-textPrimary"
      }`}
      onClick={onClick}
    >
      <NativeSymbolIcon className="w-4 h-4 shrink-0" />
      <span className="ml-2">{label}</span>
      <span className="ml-auto text-textTertiary">
        {isLoading ? "…" : formatted}
      </span>
      <CheckIcon
        className={`w-3.5 h-3.5 ml-2 shrink-0 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}

function CustomAssetOption({ label, assetId, isActive, onClick }) {
  const { balance, isLoading } = useAssetBalance(assetId);

  const formatted =
    balance != null ? toPrecision(balance, STABLE_COIN_DECIMALS, 4) : null;

  return (
    <button
      className={`flex items-center w-full px-3 py-2 text12Medium hover:bg-neutral200 transition-colors ${
        isActive ? "text-theme500 bg-neutral200" : "text-textPrimary"
      }`}
      onClick={onClick}
    >
      <FeeIcon
        type={getFeeAssetTypeKey(assetId)}
        className="w-4 h-4 shrink-0"
      />
      <span className="ml-2">{label}</span>
      <span className="ml-auto text-textTertiary">
        {isLoading ? "…" : formatted}
      </span>
      <CheckIcon
        className={`w-3.5 h-3.5 ml-2 shrink-0 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}

export default function FeeAssetTypeSwitcher() {
  const chain = useChain();
  const { symbol } = useChainSettings();
  const { feeAssetType, setFeeAssetType } = useFeeAssetType();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleChange = useCallback(
    (type) => {
      setFeeAssetType(type);
      setShowDropdown(false);
    },
    [setFeeAssetType],
  );

  const options = getFeeAssetOptions(chain);

  return (
    <div className="absolute top-2 right-2" ref={dropdownRef}>
      <button
        className="flex items-center gap-x-1 p-1 rounded hover:bg-neutral200 transition-colors"
        onClick={() => setShowDropdown(!showDropdown)}
        title={`Switch fee asset (current: ${
          feeAssetType === FEE_ASSET_TYPES.native ? symbol : feeAssetType
        })`}
      >
        <FeeIcon type={feeAssetType} className="w-4 h-4" />
        <ChevronDown
          className={`w-2.5 h-2.5 transition-transform ${
            showDropdown ? "rotate-180" : ""
          }`}
        />
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-1 bg-neutral100 border border-neutral400 rounded-lg shadow-200 z-50 py-1 min-w-48 dark:border dark:border-neutral300">
          {options.map((opt) => {
            if (opt.type === FEE_ASSET_TYPES.native) {
              return (
                <NativeAssetOption
                  key={opt.type}
                  label={symbol}
                  isActive={feeAssetType === FEE_ASSET_TYPES.native}
                  onClick={() => handleChange(FEE_ASSET_TYPES.native)}
                />
              );
            }
            return (
              <CustomAssetOption
                key={opt.type}
                label={opt.label}
                assetId={opt.assetId}
                isActive={feeAssetType === opt.type}
                onClick={() => handleChange(opt.type)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
