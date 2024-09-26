import Chains from "next-common/utils/consts/chains";
import knownPolkadotAssetHubAssets from "next-common/components/assets/known/polkadot";
import { useChain } from "next-common/context/chain";
import { AssetIconDot, AssetIconWnd } from "@osn/icons/subsquare";
import {
  isPolkadotAssetHubChain,
  isWestendAssetHubChain,
} from "next-common/utils/chain";

const knownAssetHubAssetsMap = Object.freeze({
  [Chains.polkadotAssetHub]: knownPolkadotAssetHubAssets,
  [Chains.westendAssetHub]: knownPolkadotAssetHubAssets,
});

export function useKnownAssetHubAssets() {
  const chain = useChain();
  return knownAssetHubAssetsMap[chain];
}

export function useNativeTokenIcon() {
  const chain = useChain();
  if (isPolkadotAssetHubChain(chain)) {
    return AssetIconDot;
  }
  if (isWestendAssetHubChain(chain)) {
    return AssetIconWnd;
  }
  return null;
}

export default function useKnownAssetHubAssetIcon(assetId) {
  const assets = useKnownAssetHubAssets();
  const targetAsset = (assets || []).find((asset) => asset.assetId === assetId);
  return targetAsset?.icon;
}
