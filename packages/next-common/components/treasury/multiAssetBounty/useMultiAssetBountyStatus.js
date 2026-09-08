import { useContextPapi } from "next-common/context/papi";
import { useEffect, useState } from "react";

// Subscribe to the on-chain parent multi-asset bounty storage, so action
// buttons react as soon as a tx changes the bounty status. e.g. the accept
// curator button hides itself right after accept_curator lands and the status
// flips from `Funded` to `Active`.
export default function useMultiAssetBountyStatus(bountyIndex) {
  const { api: papi, checkPallet } = useContextPapi();
  const [bounty, setBounty] = useState(null);

  useEffect(() => {
    setBounty(null);
    if (
      !papi ||
      bountyIndex == null ||
      !checkPallet("MultiAssetBounties", "Bounties")
    ) {
      return;
    }

    const bountySub = papi.query.MultiAssetBounties.Bounties.watchValue(
      bountyIndex,
    ).subscribe({
      next: ({ value }) => setBounty(value ?? null),
      error: (error) => {
        setBounty(null);
        console.error(error);
      },
    });
    return () => bountySub.unsubscribe();
  }, [papi, bountyIndex, checkPallet]);

  return bounty?.status;
}
