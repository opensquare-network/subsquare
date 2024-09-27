import Chains from "next-common/utils/consts/chains";
import knownPolkadotAssetHubAssets from "next-common/components/assets/known/polkadot";
import { useChain } from "next-common/context/chain";
import { AssetIconDot, AssetIconWnd, AssetIconKsm } from "@osn/icons/subsquare";

const knownAssetHubAssetsMap = Object.freeze({
  [Chains.polkadotAssetHub]: knownPolkadotAssetHubAssets,
  [Chains.westendAssetHub]: [],
  [Chains.kusamaAssetHub]: [],
});

export function useKnownAssetHubAssets() {
  const chain = useChain();
  return knownAssetHubAssetsMap[chain];
}

const assetHubChainNativeTokenIconMap = {
  [Chains.polkadotAssetHub]: AssetIconDot,
  [Chains.westendAssetHub]: AssetIconWnd,
  [Chains.kusamaAssetHub]: AssetIconKsm,
};

export function useNativeTokenIcon() {
  const chain = useChain();
  return assetHubChainNativeTokenIconMap[chain] || null;
}

export default function useKnownAssetHubAssetIcon(assetId) {
  const assets = useKnownAssetHubAssets();
  const targetAsset = (assets || []).find((asset) => asset.assetId === assetId);
  return targetAsset?.icon;
}
