import Popup from "next-common/components/popup/wrapper/Popup";
import { cn } from "next-common/utils";
import Tab from "next-common/components/tab";
import dynamic from "next/dynamic";

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

  return (
    <Popup {...props} className="!w-[640px]" title={"Compare Params Changes"}>
      <Tab selectedTabId={tabs[0].tabId} tabs={tabs} />

      <div
        className={cn(
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
