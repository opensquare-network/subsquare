import Tab from "next-common/components/tab";
import ProposeWithInputHex from "./proposeWithInputHex";
import ProposeWithExtrinsic from "./proposeWithExtrinsic";
import { useMultisigSignContext } from "./context";

export default function ProposeExtrinsicWithToggleTabs() {
  const { formType, setFormType } = useMultisigSignContext();

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

      <div className={formType === "set" ? "hidden" : ""}>
        <ProposeWithInputHex />
      </div>

      <div className={formType === "input" ? "hidden" : ""}>
        <ProposeWithExtrinsic />
      </div>
    </div>
  );
}
