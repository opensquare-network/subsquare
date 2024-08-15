import React, { useCallback } from "react";
import SignerPopupV2 from "next-common/components/signerPopup/indexV2";
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
    <SignerPopupV2
      title="Claim Bounty"
      getTxFunc={getTxFunc}
      onClose={onClose}
    />
  );
}
