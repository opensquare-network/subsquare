import { useChainSettings } from "next-common/context/chain";

function useIsEnhancementSearch() {
  const {
    modules: {
      referenda: hasReferenda,
      democracy: { referenda: hasDemocracyReferenda } = {},
      treasury: { bounties: hasBounties, childBounties: hasChildBounties } = {},
    },
  } = useChainSettings();
  return (
    hasReferenda || hasDemocracyReferenda || hasBounties || hasChildBounties
  );
}

export default useIsEnhancementSearch;
