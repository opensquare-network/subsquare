import { useChainSettings } from "next-common/context/chain";

function useIsEnhancementSearch() {
  const {
    modules: {
      referenda: hasReferenda,
      democracy: { referenda: hasDemocracyReferenda } = {},
      treasury: { bounties: hasBounties, childBounties: hasChildBounties } = {},
      fellowship: hasFellowship,
      fellowshipTreasury: hasFellowshipTreasury,
    },
  } = useChainSettings();
  return (
    hasReferenda ||
    hasDemocracyReferenda ||
    hasBounties ||
    hasChildBounties ||
    hasFellowship ||
    hasFellowshipTreasury
  );
}

export default useIsEnhancementSearch;
