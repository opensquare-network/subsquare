import { useCallback, useRef, useState, useEffect } from "react";
import { createGlobalState } from "react-use";
import { useChainSettings } from "next-common/context/chain";
import {
  useFeeAssetType,
  FEE_ASSET_TYPES,
  STABLE_COIN_DECIMALS,
  USDC_ASSET_ID,
  USDT_ASSET_ID,
} from "next-common/components/popupWithSigner/context/feeAsset";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import { toPrecision } from "next-common/utils";
import {
  AssetIconDot,
  AssetIconUsdc,
  AssetIconUsdt,
} from "@osn/icons/subsquare";
import { ChevronDown, CheckIcon } from "./feeAssetSvgs";

const useCachedBalances = createGlobalState({
  [FEE_ASSET_TYPES.native]: null,
  [FEE_ASSET_TYPES.USDC]: null,
  [FEE_ASSET_TYPES.USDT]: null,
});

const FEE_ICON_MAP = {
  [FEE_ASSET_TYPES.native]: AssetIconDot,
  [FEE_ASSET_TYPES.USDC]: AssetIconUsdc,
  [FEE_ASSET_TYPES.USDT]: AssetIconUsdt,
};

const ASSET_ID_TO_TYPE = {
  [USDC_ASSET_ID]: FEE_ASSET_TYPES.USDC,
  [USDT_ASSET_ID]: FEE_ASSET_TYPES.USDT,
};

function FeeIcon({ type, className = "w-4 h-4" }) {
  const Icon = FEE_ICON_MAP[type];
  if (!Icon) return null;
  return <Icon className={className} />;
}

function NativeAssetOption({ label, isActive, onClick }) {
  const { decimals } = useChainSettings();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const [cachedBalances, setCachedBalances] = useCachedBalances();
  const cached = cachedBalances?.[FEE_ASSET_TYPES.native];
  const [balance, setBalance] = useState(cached);
  const [isLoading, setIsLoading] = useState(cached == null);

  useEffect(() => {
    if (!api || !signerAccount?.realAddress) return;
    setIsLoading(cached == null);
    api.query.system
      .account(signerAccount.realAddress)
      .then((acc) => {
        const val = acc.data.free;
        setBalance(val);
        setCachedBalances((prev) => ({
          ...prev,
          [FEE_ASSET_TYPES.native]: val,
        }));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, signerAccount?.realAddress]);

  const formatted = balance != null ? toPrecision(balance, decimals, 4) : null;

  return (
    <button
      className={`flex items-center w-full px-3 py-2 text12Medium hover:bg-neutral200 transition-colors ${
        isActive ? "text-theme500 bg-neutral200" : "text-textPrimary"
      }`}
      onClick={onClick}
    >
      <FeeIcon type={FEE_ASSET_TYPES.native} className="w-4 h-4 shrink-0" />
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

function assetTypeFor(assetId) {
  return ASSET_ID_TO_TYPE[assetId] || FEE_ASSET_TYPES.native;
}

function CustomAssetOption({ label, assetId, isActive, onClick }) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const [cachedBalances, setCachedBalances] = useCachedBalances();
  const balanceKey = assetTypeFor(assetId);
  const cached = cachedBalances?.[balanceKey];
  const [balance, setBalance] = useState(cached);
  const [isLoading, setIsLoading] = useState(cached == null);

  useEffect(() => {
    if (!api || !signerAccount?.realAddress) return;
    setIsLoading(cached == null);
    api.query.assets
      .account(assetId, signerAccount.realAddress)
      .then((data) => {
        const b = data?.balance;
        const val = b != null ? BigInt(b.toString()) : 0n;
        setBalance(val);
        setCachedBalances((prev) => ({ ...prev, [balanceKey]: val }));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, signerAccount?.realAddress, assetId]);

  const formatted =
    balance != null ? toPrecision(balance, STABLE_COIN_DECIMALS, 4) : null;

  return (
    <button
      className={`flex items-center w-full px-3 py-2 text12Medium hover:bg-neutral200 transition-colors ${
        isActive ? "text-theme500 bg-neutral200" : "text-textPrimary"
      }`}
      onClick={onClick}
    >
      <FeeIcon type={assetTypeFor(assetId)} className="w-4 h-4 shrink-0" />
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
          <NativeAssetOption
            label={symbol}
            isActive={feeAssetType === FEE_ASSET_TYPES.native}
            onClick={() => handleChange(FEE_ASSET_TYPES.native)}
          />
          <CustomAssetOption
            label="USDC"
            assetId={USDC_ASSET_ID}
            isActive={feeAssetType === FEE_ASSET_TYPES.USDC}
            onClick={() => handleChange(FEE_ASSET_TYPES.USDC)}
          />
          <CustomAssetOption
            label="USDT"
            assetId={USDT_ASSET_ID}
            isActive={feeAssetType === FEE_ASSET_TYPES.USDT}
            onClick={() => handleChange(FEE_ASSET_TYPES.USDT)}
          />
        </div>
      )}
    </div>
  );
}
