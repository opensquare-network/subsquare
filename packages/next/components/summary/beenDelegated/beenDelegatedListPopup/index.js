import React from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import DelegationTabList from "./delegationTabList";
import DelegationSummary from "./delegationSummary";

export default function BeenDelegatedListPopup({ beenDelegatedList, setShow }) {
  return (
    <Popup title="Been Delegated" onClose={() => setShow(false)}>
      <DelegationSummary beenDelegatedList={beenDelegatedList} />
      <DelegationTabList
        directDelegationList={beenDelegatedList}
        nestedDelegationList={[]}
      />
    </Popup>
  );
}
