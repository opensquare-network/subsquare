import React from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import AllBeenDelegatedPopupTabList from "./tab";

export default function AllBeenDelegatedPopup({
  beenDelegatedList,
  setShow = () => {},
}) {
  return (
    <Popup wide title="Been Delegated" onClose={() => setShow(false)}>
      <AllBeenDelegatedPopupTabList beenDelegatedList={beenDelegatedList} />
    </Popup>
  );
}
