import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import Tab from "next-common/components/tab";
import { useState } from "react";

export default function EnactmentBlocks() {
  const [tabIndex, setTabIndex] = useState("After Delay");

  return (
    <div>
      <PopupLabel text="Enactment Blocks" />
      <div className="flex flex-col gap-[8px]">
        <Tab
          tabs={[
            {
              tabId: "After Delay",
              tabTitle: "After Delay",
            },
            {
              tabId: "At Block",
              tabTitle: "At Block",
            },
          ]}
          selectedTabId={tabIndex}
          setSelectedTabId={setTabIndex}
        />
        <Input placeholder="0" symbol="Blocks" />
      </div>
    </div>
  );
}
