import { useChainSettings } from "next-common/context/chain";

function useIsEnhancementSearch() {
  const chainSettings = useChainSettings();
  const {
    modules: { referenda: hasReferenda, democracy = {}, treasury = {} },
  } = chainSettings;
  const { referenda: hasDemocracyReferenda } = democracy;
  const { bounties: hasBounties, childBounties: hasChildBounties } = treasury;
  if (hasReferenda) return true;

  return hasDemocracyReferenda || hasBounties || hasChildBounties;
}

export default useIsEnhancementSearch;
