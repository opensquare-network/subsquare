import { useCallback, useRef, useState, useEffect } from "react";
import { useChain, useChainSettings } from "next-common/context/chain";
import {
  useFeeAssetType,
  useNativeBalance,
  useAssetBalance,
  getFeeAssetTypeKey,
  getChainFeeAssets,
  NATIVE_ASSET_TYPE,
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
  const options = [{ type: NATIVE_ASSET_TYPE, label: null, assetId: null }];
  for (const { symbol, assetId } of getChainFeeAssets(chain)) {
    options.push({
      type: symbol,
      label: symbol,
      assetId,
    });
  }
  return options;
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
  if (type === NATIVE_ASSET_TYPE) {
    return <NativeSymbolIcon className={className} />;
  }
  if (type === "USDC") {
    return <AssetIconUsdc className={className} />;
  }
  if (type === "USDT") {
    return <AssetIconUsdt className={className} />;
  }
  return null;
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
  const chain = useChain();
  const { balance, isLoading } = useAssetBalance(assetId);

  const formatted = balance != null ? toPrecision(balance, 6, 4) : null;

  return (
    <button
      className={`flex items-center w-full px-3 py-2 text12Medium hover:bg-neutral200 transition-colors ${
        isActive ? "text-theme500 bg-neutral200" : "text-textPrimary"
      }`}
      onClick={onClick}
    >
      <FeeIcon
        type={getFeeAssetTypeKey(assetId, chain)}
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
          feeAssetType === NATIVE_ASSET_TYPE ? symbol : feeAssetType
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
            if (opt.type === NATIVE_ASSET_TYPE) {
              return (
                <NativeAssetOption
                  key={opt.type}
                  label={symbol}
                  isActive={feeAssetType === NATIVE_ASSET_TYPE}
                  onClick={() => handleChange(NATIVE_ASSET_TYPE)}
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
