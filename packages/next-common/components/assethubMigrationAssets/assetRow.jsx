import useAssetAccountBalance from "./useAssetAccountBalance";
import BigNumber from "bignumber.js";

/**
 * A wrapper component that subscribes to asset balance and provides
 * the balance data to the render function. Returns null if balance is zero.
 */
export default function AssetRow({ asset, address, children }) {
  const { assetId } = asset;
  const { loading, balance, transferrable } = useAssetAccountBalance(
    assetId,
    address,
  );

  // Don't render if still loading or balance is zero
  if (loading) {
    return null;
  }

  if (!balance || new BigNumber(balance).isZero()) {
    return null;
  }

  const assetWithBalance = {
    ...asset,
    balance,
    transferrable,
  };

  return children(assetWithBalance);
}
