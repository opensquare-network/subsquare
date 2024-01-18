import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import Tab from "next-common/components/tab";
import { useEffect, useMemo, useState } from "react";
import useBestNumber from "next-common/hooks/useBestNumber";

const defaultAfterBlock = 100;

function isNumeric(value) {
  return /^\d+$/.test(value);
}

export default function EnactmentBlocks({ setEnactment }) {
  const [tabIndex, setTabIndex] = useState("after");
  const [afterBlocks, setAfterBlocks] = useState(defaultAfterBlock);
  const [initialAt, setInitialAt] = useState();
  const bestNumber = useBestNumber();

  const isInvalid = useMemo(() => {
    if (tabIndex === "after") {
      return !afterBlocks || !isNumeric(afterBlocks) || Number(afterBlocks) < 1;
    }
    return (
      !bestNumber || !isNumeric(initialAt) || Number(initialAt) < bestNumber
    );
  }, [afterBlocks, initialAt, bestNumber, tabIndex]);

  useEffect(() => {
    bestNumber && setInitialAt((prev) => prev || bestNumber + 1000);
  }, [bestNumber]);

  useEffect(() => {
    if (isInvalid) {
      setEnactment();
      return;
    }

    if (tabIndex === "after") {
      setEnactment({
        after: parseInt(afterBlocks),
      });
      return;
    }

    setEnactment({
      at: parseInt(initialAt),
    });
  }, [isInvalid, initialAt, afterBlocks, tabIndex]);

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
        {tabIndex === "after" ? (
          <Input
            key="after-input"
            defaultValue={afterBlocks}
            placeholder="0"
            symbol="Blocks"
            onChange={(e) => setAfterBlocks(e.target.value)}
          />
        ) : (
          <Input
            key="at-input"
            defaultValue={initialAt}
            placeholder="0"
            symbol="Blocks"
            onChange={(e) => setInitialAt(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
