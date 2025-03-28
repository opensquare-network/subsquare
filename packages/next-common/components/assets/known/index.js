import Chains from "next-common/utils/consts/chains";
import knownPolkadotAssetHubAssets from "next-common/components/assets/known/polkadot";
import { useChain } from "next-common/context/chain";
import {
  AssetIconDot,
  AssetIconWnd,
  AssetIconKsm,
  AssetIconPas,
  AssetIconPlaceholder,
  AssetIconBwnd,
} from "@osn/icons/subsquare";

const knownAssetHubAssetsMap = Object.freeze({
  [Chains.polkadotAssetHub]: knownPolkadotAssetHubAssets,
  [Chains.westendAssetHub]: [],
  [Chains.westendAssetHubNext]: [],
  [Chains.kusamaAssetHub]: [],
  [Chains.paseoAssetHub]: [],
});

export function useKnownAssetHubAssets() {
  const chain = useChain();
  return knownAssetHubAssetsMap[chain];
}

const assetHubChainNativeTokenIconMap = {
  [Chains.polkadotAssetHub]: AssetIconDot,
  [Chains.polkadot]: AssetIconDot,
  [Chains.collectives]: AssetIconDot,
  [Chains.westendAssetHub]: AssetIconWnd,
  [Chains.westendAssetHubNext]: AssetIconBwnd,
  [Chains.westend]: AssetIconWnd,
  [Chains.kusamaAssetHub]: AssetIconKsm,
  [Chains.kusama]: AssetIconKsm,
  [Chains.paseoAssetHub]: AssetIconPas,
  [Chains.paseo]: AssetIconPas,
};

export function useNativeTokenIcon() {
  const chain = useChain();
  return assetHubChainNativeTokenIconMap[chain] || AssetIconPlaceholder;
}

export default function useKnownAssetHubAssetIcon(assetId) {
  const assets = useKnownAssetHubAssets();
  const targetAsset = (assets || []).find((asset) => asset.assetId === assetId);
  return targetAsset?.icon;
}
