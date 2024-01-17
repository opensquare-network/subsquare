import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import Tab from "next-common/components/tab";
import { useEffect, useState } from "react";

export default function EnactmentBlocks({ setEnactment }) {
  const [tabIndex, setTabIndex] = useState("after");
  const [blocks, setBlocks] = useState();

  useEffect(() => {
    if (!tabIndex || !blocks) {
      setEnactment();
      return;
    }

    setEnactment({
      [tabIndex]: blocks,
    });
  }, [blocks, tabIndex]);

  return (
    <div>
      <PopupLabel text="Enactment Blocks" />
      <div className="flex flex-col gap-[8px]">
        <Tab
          tabs={[
            {
              tabId: "after",
              tabTitle: "After Delay",
            },
            {
              tabId: "at",
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
