import { useEffect } from "react";
import useAssetAccountBalance from "./useAssetAccountBalance";
import BigNumber from "bignumber.js";

/**
 * A wrapper component that subscribes to asset balance and provides
 * the balance data to the render function. Returns null if balance is zero.
 */
export default function AssetRow({ asset, address, children, onLoaded }) {
  const { assetId } = asset;
  const { loading, balance, transferrable } = useAssetAccountBalance(
    assetId,
    address,
  );

  const hasBalance = !loading && balance && !new BigNumber(balance).isZero();

  useEffect(() => {
    if (!loading && onLoaded) {
      onLoaded(assetId, hasBalance);
    }
  }, [assetId, loading, hasBalance, onLoaded]);

  // Don't render if still loading or balance is zero
  if (loading) {
    return null;
  }

  if (!hasBalance) {
    return null;
  }

  const assetWithBalance = {
    ...asset,
    balance,
    transferrable,
  };

  return children(assetWithBalance);
}
