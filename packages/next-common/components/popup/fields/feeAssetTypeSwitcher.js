import { useCallback, useRef, useState, useEffect } from "react";
import { useChain, useChainSettings } from "next-common/context/chain";
import {
  useFeeAssetConfig,
  useNativeBalance,
  useAssetBalance,
  useForeignAssetBalance,
  getChainFeeAssets,
  NATIVE_ASSET_TYPE,
} from "next-common/components/popupWithSigner/context/feeAsset";
import { toPrecision } from "next-common/utils";
import {
  AssetIconDot,
  AssetIconKsm,
  AssetIconPas,
  AssetIconUsdc,
  AssetIconUsdt,
} from "@osn/icons/subsquare";
import { ChevronDown, CheckIcon } from "./feeAssetSvgs";
import getChainSettings from "next-common/utils/consts/settings";

function getFeeAssetOptions(chain) {
  const settings = getChainSettings(chain);
  const options = [
    {
      type: NATIVE_ASSET_TYPE,
      name: NATIVE_ASSET_TYPE,
      symbol: settings.symbol,
      label: settings.symbol,
      assetId: null,
      multiLocation: null,
    },
  ];
  for (const config of getChainFeeAssets(chain)) {
    options.push({
      type: config.type,
      name: config.name,
      symbol: config.symbol,
      label: config.name,
      assetId: config.assetId,
      decimals: config.decimals,
      multiLocation: config.multiLocation || null,
    });
  }
  return options;
}

function NativeSymbolIcon({ className = "w-4 h-4" }) {
  const chain = useChain();
  if (chain === "kusama") {
    return <AssetIconKsm className={className} />;
  }
  if (chain === "paseo") {
    return <AssetIconPas className={className} />;
  }
  if (chain === "polkadot") {
    return <AssetIconDot className={className} />;
  }
  return null;
}

function FeeIcon({ symbol, className = "w-4 h-4" }) {
  const { symbol: chainSymbol } = useChainSettings();
  if (symbol === chainSymbol) {
    return <NativeSymbolIcon className={className} />;
  }
  if (symbol === "USDC") {
    return <AssetIconUsdc className={className} />;
  }
  if (symbol === "USDT") {
    return <AssetIconUsdt className={className} />;
  }
  if (symbol === "DOT") {
    return <AssetIconDot className={className} />;
  }
  return null;
}

function FeeAssetOptionLayout({
  icon,
  label,
  formatted,
  isActive,
  isLoading,
  onClick,
}) {
  return (
    <button
      className={`flex items-center w-full px-3 py-2 text12Medium hover:bg-neutral200 transition-colors ${
        isActive ? "text-theme500 bg-neutral200" : "text-textPrimary"
      }`}
      onClick={onClick}
    >
      {icon}
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

function NativeAssetOption({ label, isActive, onClick }) {
  const { decimals } = useChainSettings();
  const { balance, isLoading } = useNativeBalance();

  const formatted = balance != null ? toPrecision(balance, decimals, 4) : null;

  return (
    <FeeAssetOptionLayout
      icon={<NativeSymbolIcon className="w-4 h-4 shrink-0" />}
      label={label}
      formatted={formatted}
      isActive={isActive}
      isLoading={isLoading}
      onClick={onClick}
    />
  );
}

function AssetOption({ label, assetId, symbol, decimals, isActive, onClick }) {
  const { balance, isLoading } = useAssetBalance(assetId);

  const formatted = balance != null ? toPrecision(balance, decimals, 4) : null;

  return (
    <FeeAssetOptionLayout
      icon={<FeeIcon symbol={symbol} className="w-4 h-4 shrink-0" />}
      label={label}
      formatted={formatted}
      isActive={isActive}
      isLoading={isLoading}
      onClick={onClick}
    />
  );
}

function ForeignAssetOption({
  label,
  multiLocation,
  symbol,
  decimals,
  isActive,
  onClick,
}) {
  const { balance, isLoading } = useForeignAssetBalance(multiLocation);

  const formatted = balance != null ? toPrecision(balance, decimals, 4) : null;

  return (
    <FeeAssetOptionLayout
      icon={<FeeIcon symbol={symbol} className="w-4 h-4 shrink-0" />}
      label={label}
      formatted={formatted}
      isActive={isActive}
      isLoading={isLoading}
      onClick={onClick}
    />
  );
}

export default function FeeAssetTypeSwitcher() {
  const chain = useChain();
  const { symbol } = useChainSettings();
  const { feeAssetType, setFeeAssetType, feeAssetInfo } = useFeeAssetConfig();
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
        title={`Switch fee asset, current is ${feeAssetInfo.name}`}
      >
        <FeeIcon symbol={feeAssetInfo.symbol} className="w-4 h-4" />
        <ChevronDown
          className={`w-2.5 h-2.5 transition-transform ${
            showDropdown ? "rotate-180" : ""
          }`}
        />
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-1 bg-neutral100 border border-neutral400 rounded-lg shadow-200 z-50 py-1 min-w-56 dark:border dark:border-neutral300">
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
            if (opt.type === "foreignAsset") {
              return (
                <ForeignAssetOption
                  key={opt.name}
                  label={opt.label}
                  multiLocation={opt.multiLocation}
                  symbol={opt.symbol}
                  decimals={opt.decimals}
                  isActive={feeAssetType === opt.name}
                  onClick={() => handleChange(opt.name)}
                />
              );
            }
            return (
              <AssetOption
                key={opt.name}
                label={opt.label}
                assetId={opt.assetId}
                symbol={opt.symbol}
                decimals={opt.decimals}
                isActive={feeAssetType === opt.name}
                onClick={() => handleChange(opt.name)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
