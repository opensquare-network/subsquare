import React, { useState } from "react";
import Popup from "../../popup/wrapper/Popup";
import VotesTab, { tabs } from "./tab";

export default function VotesPopup() {
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);

  return <Popup title="Votes">
    <VotesTab tabIndex={tabIndex} setTabIndex={setTabIndex} />
  </Popup>
}
