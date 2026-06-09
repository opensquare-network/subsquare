import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createGlobalState } from "react-use";
import { useChainSettings } from "next-common/context/chain";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";

export const FEE_ASSET_TYPES = {
  native: "native",
  USDC: "USDC",
  USDT: "USDT",
};

const FeeAssetContext = createContext();

export default FeeAssetContext;

export const USDC_ASSET_ID = 1337;
export const USDT_ASSET_ID = 1984;
export const STABLE_COIN_DECIMALS = 6;
export const ASSETS_PALLET_INSTANCE = 50;

export function getFeeAssetTypeKey(assetId) {
  if (assetId === USDC_ASSET_ID) return FEE_ASSET_TYPES.USDC;
  if (assetId === USDT_ASSET_ID) return FEE_ASSET_TYPES.USDT;
  return null;
}

const useAssetCachedBalances = createGlobalState({
  [FEE_ASSET_TYPES.native]: null,
  [FEE_ASSET_TYPES.USDC]: null,
  [FEE_ASSET_TYPES.USDT]: null,
});

export function useNativeBalance() {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const [cachedBalances, setCachedBalances] = useAssetCachedBalances();
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

  return { balance, isLoading };
}

export function useAssetBalance(assetId) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const [cachedBalances, setCachedBalances] = useAssetCachedBalances();

  const balanceKey = getFeeAssetTypeKey(assetId);
  const cached = balanceKey ? cachedBalances?.[balanceKey] : null;
  const [balance, setBalance] = useState(cached);
  const [isLoading, setIsLoading] = useState(cached == null);

  useEffect(() => {
    if (!api || !signerAccount?.realAddress || assetId == null) return;
    setIsLoading(cached == null);

    api.query.assets
      .account(assetId, signerAccount.realAddress)
      .then((data) => {
        const val = data?.unwrapOr(null)?.balance?.toBigInt() || 0n;
        setBalance(val);
        const key = getFeeAssetTypeKey(assetId);
        if (key) {
          setCachedBalances((prev) => ({ ...prev, [key]: val }));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, signerAccount?.realAddress, assetId]);

  return { balance, isLoading };
}

export function useFeeAssetInfo(feeAssetType) {
  const { symbol, decimals } = useChainSettings();

  return useMemo(() => {
    if (feeAssetType === FEE_ASSET_TYPES.USDC) {
      return {
        type: feeAssetType,
        symbol: "USDC",
        assetId: USDC_ASSET_ID,
        decimals: STABLE_COIN_DECIMALS,
      };
    }

    if (feeAssetType === FEE_ASSET_TYPES.USDT) {
      return {
        type: feeAssetType,
        symbol: "USDT",
        assetId: USDT_ASSET_ID,
        decimals: STABLE_COIN_DECIMALS,
      };
    }

    return { type: FEE_ASSET_TYPES.native, symbol, assetId: null, decimals };
  }, [feeAssetType, symbol, decimals]);
}

export function getFeeAssetXcmLocation(feeAssetType) {
  if (feeAssetType === FEE_ASSET_TYPES.USDC) {
    return {
      V4: {
        parents: 0,
        interior: {
          X2: [
            { PalletInstance: ASSETS_PALLET_INSTANCE },
            { GeneralIndex: USDC_ASSET_ID },
          ],
        },
      },
    };
  }
  if (feeAssetType === FEE_ASSET_TYPES.USDT) {
    return {
      V4: {
        parents: 0,
        interior: {
          X2: [
            { PalletInstance: ASSETS_PALLET_INSTANCE },
            { GeneralIndex: USDT_ASSET_ID },
          ],
        },
      },
    };
  }
  return null;
}

export function FeeAssetProvider({ children }) {
  const [feeAssetType, setFeeAssetTypeState] = useState(FEE_ASSET_TYPES.native);
  const feeAssetInfo = useFeeAssetInfo(feeAssetType);

  const setFeeAssetType = useCallback((type) => {
    if (Object.values(FEE_ASSET_TYPES).includes(type)) {
      setFeeAssetTypeState(type);
    }
  }, []);

  return (
    <FeeAssetContext.Provider
      value={{ feeAssetType, feeAssetInfo, setFeeAssetType }}
    >
      {children}
    </FeeAssetContext.Provider>
  );
}

export function useFeeAssetType() {
  const { symbol, decimals } = useChainSettings();
  const context = useContext(FeeAssetContext);
  if (!context) {
    return {
      feeAssetType: FEE_ASSET_TYPES.native,
      feeAssetInfo: {
        type: FEE_ASSET_TYPES.native,
        symbol,
        decimals,
      },
      setFeeAssetType: () => {},
    };
  }
  return context;
}
