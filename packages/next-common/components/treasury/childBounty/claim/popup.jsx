import React, { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function ClaimPopup({ childBounty, onClose }) {
  const api = useContextApi();

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
