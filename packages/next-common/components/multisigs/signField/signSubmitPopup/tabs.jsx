import { useState } from "react";
import Tab from "next-common/components/tab";
import ProposeWithInputHex from "./proposeWithInputHex";
import ProposeWithExtrinsic from "./proposeWithExtrinsic";

export default function ProposeExtrinsicWithToggleTabs({ setValue, callHex, when }) {
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

  const [selectedTabId, setSelectedTabId] = useState(tabs[0].tabId);

  return (
    <div className="flex flex-col gap-[8px]">
      <Tab
        tabs={tabs}
        selectedTabId={selectedTabId}
        setSelectedTabId={setSelectedTabId}
      />
      {selectedTabId === "input" ? (
        <ProposeWithInputHex callHex={callHex} when={when} />
      ) : (
        <ProposeWithExtrinsic setValue={setValue} />
      )}
    </div>
  );
}
