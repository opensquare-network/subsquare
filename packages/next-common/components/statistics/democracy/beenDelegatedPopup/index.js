import React from "react";
import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import DelegationSummary from "./delegationSummary";
import DelegationTabList from "./delegationTabList";

export default function BeenDelegatedListPopup({
  apiRoot = "democracy",
  delegatee,
  delegatorsCount,
  delegatedCapital,
  delegatedVotes,
  setShow,
}) {
  return (
    <BaseVotesPopup title="Been Delegated" onClose={() => setShow(false)}>
      <DelegationSummary
        delegatee={delegatee}
        delegatorsCount={delegatorsCount}
        delegatedCapital={delegatedCapital}
        delegatedVotes={delegatedVotes}
      />
      <DelegationTabList apiRoot={apiRoot} delegatee={delegatee} />
    </BaseVotesPopup>
  );
}
