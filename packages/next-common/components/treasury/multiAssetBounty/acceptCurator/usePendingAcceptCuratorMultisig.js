import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import { useEffect, useState } from "react";
import { findPendingMultisig } from "next-common/utils/sendTransaction/findPendingMultisig";

// Detect whether an accept curator multisig for this bounty is already in
// progress on-chain, initiated by ANY group that can act as the curator - not
// just the multisig routes of the connected user. e.g. another group may have
// started the operation through a delegate multisig the user is not a member
// of; the user should still be warned before starting their own duplicate
// through a multisig they do belong to.
//
// The multisig enumeration and the on-chain lookup are delegated to the
// shared findPendingMultisig util; the acceptCurator call built here is passed
// in as the inner call to match.
export default function usePendingAcceptCuratorMultisig(
  bountyIndex,
  curator,
  structure,
) {
  const api = useContextApi();
  const [multisigAddresses, setMultisigAddresses] = useState([]);

  useEffect(() => {
    // Clear the previous result whenever the inputs change, before re-checking.
    setMultisigAddresses([]);

    if (!api || isNil(bountyIndex) || !curator) {
      return;
    }

    // accept_curator(parent_bounty_id, child_bounty_id); child id is null for
    // a parent bounty. Must match what the popup submits.
    const acceptCuratorTx = api.tx.multiAssetBounties?.acceptCurator(
      bountyIndex,
      null,
    );
    if (!acceptCuratorTx) {
      return;
    }

    let cancelled = false;
    findPendingMultisig(api, acceptCuratorTx, curator, structure)
      .then((found) => {
        if (!cancelled) {
          setMultisigAddresses(found || []);
        }
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
    };
  }, [api, bountyIndex, curator, structure]);

  return {
    pending: multisigAddresses.length > 0,
    multisigAddresses,
  };
}
