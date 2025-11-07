import React, { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export default function ClaimPopup({ bountyIndex, onClose }) {
  const api = useConditionalContextApi();

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
