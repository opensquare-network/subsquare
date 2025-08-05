import Popup from "next-common/components/popup/wrapper/Popup";
import Tab from "next-common/components/tab";
import { useState } from "react";

export default function CallPopup({ onClose }) {
  return (
    <Popup title="Call Multisig" onClose={onClose}>
      <div>CallPopup</div>
    </Popup>
  );
}

export function CallPopupImpl() {
  const [formType, setFormType] = useState("input");

  const tabs = [
    {
      tabId: "input",
      tabTitle: "Input Call Hex",
    },
    {
      tabId: "set",
      tabTitle: "Set Call Data",
    },
  ];

  return (
    <div className="flex flex-col gap-[8px]">
      <Tab
        tabs={tabs}
        selectedTabId={formType}
        setSelectedTabId={setFormType}
      />

      <div className={formType === "set" ? "hidden" : ""}></div>

      <div className={formType === "input" ? "hidden" : ""}></div>
    </div>
  );
}
