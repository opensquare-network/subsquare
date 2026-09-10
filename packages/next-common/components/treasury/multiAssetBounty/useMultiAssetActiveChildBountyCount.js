import { useContextPapi } from "next-common/context/papi";
import { useEffect, useState } from "react";

// Number of child bounties the parent still holds in storage
// (MultiAssetBounties.ChildBountiesPerParent). Children are removed from
// storage only after their payout is confirmed, so this is the "active" child
// count that gates e.g. close_bounty (a parent can only be closed when it is 0).
export default function useMultiAssetActiveChildBountyCount(bountyIndex) {
  const { api: papi, checkPallet } = useContextPapi();
  const [childBountiesCount, setChildBountiesCount] = useState(null);

  useEffect(() => {
    setChildBountiesCount(null);
    if (
      !papi ||
      bountyIndex == null ||
      !checkPallet("MultiAssetBounties", "ChildBountiesPerParent")
    ) {
      return;
    }

    const countSub =
      papi.query.MultiAssetBounties.ChildBountiesPerParent.watchValue(
        bountyIndex,
      ).subscribe({
        next: ({ value }) => setChildBountiesCount(value ?? 0),
        error: (error) => {
          setChildBountiesCount(null);
          console.error(error);
        },
      });

    return () => countSub.unsubscribe();
  }, [papi, bountyIndex, checkPallet]);

  return childBountiesCount;
}
