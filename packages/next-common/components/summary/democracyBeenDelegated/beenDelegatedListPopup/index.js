import React from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import DelegationTabList from "./delegationTabList";
import DelegationSummary from "./delegationSummary";

export default function BeenDelegatedListPopup({
  delegations,
  beenDelegatedList,
  setShow,
}) {
  return (
    <Popup title="Been Delegated" onClose={() => setShow(false)}>
      <DelegationSummary
        delegations={delegations}
        beenDelegatedList={beenDelegatedList}
      />
      <DelegationTabList beenDelegatedList={beenDelegatedList} />
    </Popup>
  );
}
