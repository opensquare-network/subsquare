import React, { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function ClaimPopup({ bountyIndex, onClose }) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.bounties.claimBounty(bountyIndex);
  }, [api, bountyIndex]);

  return (
    <SimpleTxPopup
      title="Claim Bounty"
      getTxFunc={getTxFunc}
      onClose={onClose}
    />
  );
}
