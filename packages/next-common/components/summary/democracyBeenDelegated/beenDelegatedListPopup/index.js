import React from "react";
import PopupOrigin from "next-common/components/popup/wrapper/Popup";
import DelegationTabList from "./delegationTabList";
import DelegationSummary from "./delegationSummary";
import styled from "styled-components";

const Popup = styled(PopupOrigin)`
  width: 480px;
`;

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
