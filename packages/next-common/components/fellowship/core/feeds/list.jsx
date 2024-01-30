import Pagination from "next-common/components/pagination";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { cn } from "next-common/utils";
import FellowshipCoreFeedsListEvent from "./event";
import tw from "tailwind-styled-components";
import FellowshipCoreFeedsListTime from "./time";

const Bar = tw.div`grow w-0.5 bg-theme300 mx-auto`;

export default function FellowshipCoreFeedsList({ feeds = {} }) {
  const rows = feeds?.items?.map?.((item) => {
    return [
      <FellowshipCoreFeedsListEvent
        key={"event"}
        className={cn("w-[640px] max-w-full", "max-sm:w-full")}
        feed={item}
      />,
      <FellowshipCoreFeedsListTime
        key="time"
        feed={item}
        className="w-40 text14Medium text-textTertiary"
      />,
      <div key={"block"}></div>,
    ];
  });

  return (
    <SecondaryCard>
      <div className="overflow-auto scrollbar-pretty text-textPrimary">
        {rows.map((row, idx) => (
          <div key={idx} className={cn("group/feed-item", "flex gap-x-4")}>
            <div className="flex flex-col">
              <Bar className="group-first/feed-item:h-2.5 group-first/feed-item:grow-0 max-sm:grow-0 max-sm:h-2.5" />

              <div className="w-3 h-5 flex items-center">
                <div className="w-3 h-3 border-[3px] border-theme500 rounded-full" />
              </div>

              <Bar className="group-last/feed-item:bg-transparent" />
            </div>

            <div
              className={cn(
                "flex items-center",
                "py-2.5 max-sm:pb-5",
                "max-sm:flex-col max-sm:items-start max-sm:gap-y-2.5",
              )}
            >
              {row}
            </div>
          </div>
        ))}
      </div>

      <Pagination
        page={feeds.page}
        pageSize={feeds.pageSize}
        total={feeds.total}
      />
    </SecondaryCard>
  );
}
