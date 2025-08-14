import { useChain, useChainSettings } from "next-common/context/chain";
import { getRelayChain } from "next-common/utils/chain";
import { isNil } from "lodash-es";

export function useForeignAssetLink(assetId) {
  const chain = useChain();
  const { supportForeignAssets = false } = useChainSettings();
  const relayChain = getRelayChain(chain);

  if (!supportForeignAssets || isNil(assetId)) {
    return null;
  }

  return `https://assethub-${relayChain}.statescan.io/#/foreign-assets/${assetId}`;
}

export function useAssetLink(assetId) {
  const chain = useChain();
  const relayChain = getRelayChain(chain);
  const { supportAssets = false } = useChainSettings();

  if (!supportAssets || isNil(assetId)) {
    return null;
  }

  return `https://assethub-${relayChain}.statescan.io/#/assets/${assetId}`;
}
