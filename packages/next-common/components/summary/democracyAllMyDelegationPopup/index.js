import React from "react";
import PopupOrigin from "next-common/components/popup/wrapper/Popup";
import styled from "styled-components";
import AllMyDelegationTabList from "./tab";

const Popup = styled(PopupOrigin)`
  width: 480px;
`;

export default function AllMyDelegationPopup({
  myDelegationList,
  setShow = () => {},
}) {
  return (
    <Popup title="My Delegation" onClose={() => setShow(false)}>
      <AllMyDelegationTabList myDelegationList={myDelegationList} />
    </Popup>
  );
}
