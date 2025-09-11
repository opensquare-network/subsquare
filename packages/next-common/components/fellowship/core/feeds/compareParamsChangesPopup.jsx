import Popup from "next-common/components/popup/wrapper/Popup";
import { cn } from "next-common/utils";
import Tab from "next-common/components/tab";
import dynamic from "next/dynamic";
import { useState } from "react";

const JsonView = dynamic(() => import("next-common/components/jsonView"), {
  ssr: false,
});

export default function FellowshipCoreFeedsCompareParamsChangesPopup({
  feed = {},
  ...props
}) {
  const tabs = [
    {
      tabId: "json",
      tabTitle: "JSON",
    },
  ];

  const [tabId, setTabId] = useState(tabs[0].tabId);

  return (
    <Popup {...props} title={"Compare Params Changes"}>
      <Tab selectedTabId={tabId} tabs={tabs} setSelectedTabId={setTabId} />

      <div
        className={cn(
          "text-textPrimary",
          "grid grid-cols-2 gap-x-2 bg-neutral200 rounded-lg p-6",
          "max-sm:grid-cols-1 max-sm:gap-y-4",
        )}
      >
        <div>
          <p className="mb-2 text14Bold">Old</p>
          <JsonView src={feed?.args?.oldParams} />
        </div>
        <div>
          <p className="mb-2 text14Bold">New</p>
          <JsonView src={feed?.args?.newParams} />
        </div>
      </div>
    </Popup>
  );
}
