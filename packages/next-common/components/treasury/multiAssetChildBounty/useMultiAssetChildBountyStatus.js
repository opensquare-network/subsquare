import { useContextPapi } from "next-common/context/papi";
import { useEffect, useState } from "react";

// Subscribe to the on-chain child multi-asset bounty storage, so the payment
// recovery action reflects the real runtime state instead of the scanner's
// display state. The scanner may mark a child as `Paid`/`Canceled` while the
// pallet still holds it in a `*Attempted` state waiting for a
// `check_status`/`retry_payment` call.
export default function useMultiAssetChildBountyStatus(
  parentBountyId,
  childBountyId,
) {
  const { api: papi, checkPallet } = useContextPapi();
  const [childBounty, setChildBounty] = useState(null);

  useEffect(() => {
    setChildBounty(null);
    if (
      !papi ||
      parentBountyId == null ||
      childBountyId == null ||
      !checkPallet("MultiAssetBounties", "ChildBounties")
    ) {
      return;
    }

    const childBountySub =
      papi.query.MultiAssetBounties.ChildBounties.watchValue(
        parentBountyId,
        childBountyId,
      ).subscribe({
        next: ({ value }) => setChildBounty(value ?? null),
        error: (error) => {
          setChildBounty(null);
          console.error(error);
        },
      });

    return () => childBountySub.unsubscribe();
  }, [papi, parentBountyId, childBountyId, checkPallet]);

  return childBounty?.status;
}
