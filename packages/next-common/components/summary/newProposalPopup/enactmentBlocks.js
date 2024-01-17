import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import Tab from "next-common/components/tab";
import { useEffect, useState } from "react";

export default function EnactmentBlocks({ setEnactment }) {
  const [tabIndex, setTabIndex] = useState("After Delay");
  const [blocks, setBlocks] = useState();

  useEffect(() => {
    if (!tabIndex || !blocks) return;

    setEnactment({
      type: tabIndex,
      blocks,
    });
  }, [blocks, tabIndex]);

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
        <Input
          placeholder="0"
          symbol="Blocks"
          onChange={(e) => setBlocks(e.target.value)}
        />
      </div>
    </div>
  );
}
