import React from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import DelegationSummary from "./delegationSummary";
import DelegationTabList from "./delegationTabList";

export default function BeenDelegatedListPopup({
  delegatee,
  delegatorsCount,
  delegatedCapital,
  delegatedVotes,
  setShow,
}) {
  return (
    <Popup wide title="Been Delegated" onClose={() => setShow(false)}>
      <DelegationSummary
        delegatee={delegatee}
        delegatorsCount={delegatorsCount}
        delegatedCapital={delegatedCapital}
        delegatedVotes={delegatedVotes}
      />
      <DelegationTabList delegatee={delegatee} />
    </Popup>
  );
}
