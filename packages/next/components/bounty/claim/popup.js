import React, { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function ClaimPopup({ bounty, onClose }) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    // TODO: bountyId: BountyIndex
    return api.tx.bounties.claimBounty(bounty.id);
  }, [api, bounty]);

  return (
    <SimpleTxPopup
      title="Claim Bounty"
      getTxFunc={getTxFunc}
      onClose={onClose}
    />
  );
}
