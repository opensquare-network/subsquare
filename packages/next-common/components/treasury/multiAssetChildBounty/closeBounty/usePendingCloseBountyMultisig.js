import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import { useEffect, useState } from "react";
import { findPendingMultisig } from "next-common/utils/sendTransaction/findPendingMultisig";

// Detect whether an identical close bounty multisig for this child bounty is
// already in progress on-chain, initiated by ANY group that can close it (the
// child curator, or the parent curator when the child is CuratorUnassigned) -
// not just the multisig routes of the connected user. e.g. another group may
// have started the operation through a delegate multisig the user is not a
// member of; the user should still be warned before starting their own
// duplicate through a multisig they do belong to.
//
// close_bounty is deterministic (no user input), so it can be checked at the
// button level. The multisig enumeration and the on-chain lookup are delegated
// to the shared findPendingMultisig util; the closeBounty call built here is
// passed in as the inner call to match.
export default function usePendingCloseBountyMultisig(
  parentBountyId,
  childBountyId,
  origin,
  authority,
) {
  const api = useContextApi();
  const [multisigAddresses, setMultisigAddresses] = useState([]);

  useEffect(() => {
    // Clear the previous result whenever the inputs change, before re-checking.
    setMultisigAddresses([]);

    if (!api || isNil(parentBountyId) || isNil(childBountyId) || !origin) {
      return;
    }

    // close_bounty(parent_bounty_id, child_bounty_id). Must match what the
    // popup submits.
    const closeBountyTx = api.tx.multiAssetBounties?.closeBounty(
      parentBountyId,
      childBountyId,
    );
    if (!closeBountyTx) {
      return;
    }

    let cancelled = false;
    findPendingMultisig(api, closeBountyTx, origin, authority)
      .then((found) => {
        if (!cancelled) {
          setMultisigAddresses(found || []);
        }
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
    };
  }, [api, parentBountyId, childBountyId, origin, authority]);

  return {
    pending: multisigAddresses.length > 0,
    multisigAddresses,
  };
}
