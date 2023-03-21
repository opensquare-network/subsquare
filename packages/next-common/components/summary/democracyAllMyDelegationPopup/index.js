import React from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import AllMyDelegationTabList from "./tab";

export default function AllMyDelegationPopup({
  myDelegationList,
  setShow = () => {},
}) {
  return (
    <Popup wide title="My Delegation" onClose={() => setShow(false)}>
      <AllMyDelegationTabList myDelegationList={myDelegationList} />
    </Popup>
  );
}
