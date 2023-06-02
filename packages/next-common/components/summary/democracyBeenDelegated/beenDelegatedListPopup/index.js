import React from "react";
import DelegationTabList from "./delegationTabList";
import DelegationSummary from "./delegationSummary";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";

export default function BeenDelegatedListPopup({
  delegations,
  beenDelegatedList,
  setShow,
}) {
  return (
    <BaseVotesPopup title="Been Delegated" onClose={() => setShow(false)}>
      <DelegationSummary
        delegations={delegations}
        beenDelegatedList={beenDelegatedList}
      />
      <DelegationTabList beenDelegatedList={beenDelegatedList} />
    </BaseVotesPopup>
  );
}
