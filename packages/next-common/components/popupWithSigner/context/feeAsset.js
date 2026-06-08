import React, { createContext, useCallback, useContext, useState } from "react";

/**
 * Asset types available for transaction fee payment.
 * - native: chain native token (e.g. DOT/KSM)
 * - USDC: USD Coin (Sufficient asset, GeneralIndex=1337)
 * - USDT: Tether USD (Sufficient asset, GeneralIndex=1984)
 */
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

/**
 * FeeAssetProvider - provides context for the fee asset type.
 *
 * Supports three types:
 * - native: pay fee with chain native token (default)
 * - USDC: pay fee with USDC (Sufficient asset)
 * - USDT: pay fee with USDT (Sufficient asset)
 */
export function FeeAssetProvider({ children }) {
  const [feeAssetType, setFeeAssetTypeState] = useState(FEE_ASSET_TYPES.native);

  const setFeeAssetType = useCallback((type) => {
    if (Object.values(FEE_ASSET_TYPES).includes(type)) {
      setFeeAssetTypeState(type);
    }
  }, []);

  return (
    <FeeAssetContext.Provider value={{ feeAssetType, setFeeAssetType }}>
      {children}
    </FeeAssetContext.Provider>
  );
}

export function useFeeAssetType() {
  const context = useContext(FeeAssetContext);
  if (!context) {
    return {
      feeAssetType: FEE_ASSET_TYPES.native,
      setFeeAssetType: () => {},
    };
  }
  return context;
}
