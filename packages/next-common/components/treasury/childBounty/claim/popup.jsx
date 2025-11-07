import React, { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export default function ClaimPopup({ childBounty, onClose }) {
  const api = useConditionalContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.childBounties.claimChildBounty(
      childBounty.parentBountyId,
      childBounty.index,
    );
  }, [api, childBounty]);

  return (
    <SimpleTxPopup
      title="Claim Bounty"
      getTxFunc={getTxFunc}
      onClose={onClose}
    />
  );
}
