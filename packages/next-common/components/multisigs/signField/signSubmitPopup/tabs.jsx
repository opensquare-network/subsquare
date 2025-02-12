import { useState } from "react";
import Tab from "next-common/components/tab";
import ProposeWithInputHex from "./proposeWithInputHex";
import ProposeWithExtrinsic from "./proposeWithExtrinsic";
import { useMultisigSignContext } from "./context";

export default function ProposeExtrinsicWithToggleTabs() {
  const {
    multisig: { callHash, when },
    setValue,
  } = useMultisigSignContext();

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
        setSelectedTabId={(id) => {
          setSelectedTabId(id);
          setValue({ isValid: false, data: {} });
        }}
      />

      <div className={selectedTabId === "set" && "hidden"}>
        <ProposeWithInputHex
          callHash={callHash}
          when={when}
          setValue={setValue}
        />
      </div>

      {/* todo: validate data again */}
      <div className={selectedTabId === "input" && "hidden"}>
        <ProposeWithExtrinsic setValue={setValue} />
      </div>
    </div>
  );
}
