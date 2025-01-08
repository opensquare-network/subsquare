import NumberInput from "next-common/lib/input/number";
import PopupLabel from "next-common/components/popup/label";
import Tab from "next-common/components/tab";
import { useEffect, useMemo, useState } from "react";
import useBestNumber from "next-common/hooks/useBestNumber";

const defaultAfterBlock = 100;

function isNumeric(value) {
  return /^\d+$/.test(value);
}

export default function EnactmentBlocks({ track, setEnactment }) {
  const [tabIndex, setTabIndex] = useState("after");
  const [afterBlocks, setAfterBlocks] = useState(defaultAfterBlock);
  const [initialAt, setInitialAt] = useState();
  const bestNumber = useBestNumber();

  useEffect(() => {
    if (track) {
      setAfterBlocks(track.minEnactmentPeriod);
    }
  }, [track]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <NumberInput
            key="after-input"
            value={afterBlocks}
            placeholder="0"
            symbol="Blocks"
            controls={false}
            onValueChange={setAfterBlocks}
          />
        ) : (
          <NumberInput
            key="at-input"
            value={initialAt}
            placeholder="0"
            symbol="Blocks"
            controls={false}
            onValueChange={setInitialAt}
          />
        )}
      </div>
    </div>
  );
}
