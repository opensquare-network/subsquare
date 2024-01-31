import Pagination from "next-common/components/pagination";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { cn } from "next-common/utils";
import FellowshipCoreFeedsListEvent from "./event";
import tw from "tailwind-styled-components";
import FellowshipCoreFeedsListTime from "./time";
import FellowshipCoreFeedsListBlockLink from "./blockLink";
import DataList from "next-common/components/dataList";
import orderBy from "lodash.orderby";

const Bar = tw.div`grow w-0.5 bg-theme300 mx-auto`;

export default function FellowshipCoreFeedsList({ feeds = {} }) {
  const columns = [{ name: "event" }, { name: "block", width: 250 }];

  const orderedItems = orderBy(
    feeds?.items || [],
    ["indexer.blockHeight", "indexer.eventIndex"],
    ["desc", "desc"],
  );

  const rows = orderedItems?.map?.((item) => {
    return [
      <FellowshipCoreFeedsListEvent key="event" feed={item} className="pr-2" />,
      <div key="block-info" className="flex items-center max-sm:gap-x-2">
        <FellowshipCoreFeedsListTime
          feed={item}
          className="w-40 text-textTertiary max-sm:w-auto"
        />
        <FellowshipCoreFeedsListBlockLink
          className={cn(
            "opacity-0 group-hover/datalist-item:opacity-100 max-sm:opacity-100",
            "text-textTertiary",
          )}
          feed={item}
        />
      </div>,
    ];
  });

  return (
    <SecondaryCard className="!px-0">
      <DataList
        className={cn(
          "text14Medium",
          "[&_.datalist-head]:hidden [&_.datalist-body]:divide-y-0",
          "[&_.datalist-item]:py-2.5",
          "[&_.datalist-desktop-item]:items-start",
          "[&_.datalist_.descriptions-item-label]:hidden",
        )}
        columns={columns}
        rows={rows}
        renderItem={(datalistItem, idx, arr) => {
          const isLast = idx === arr.length - 1;

          return (
            <div className="flex gap-x-4 px-6 sm:hover:bg-neutral200" key={idx}>
              <div className="flex flex-col">
                <Bar className="h-2.5 grow-0" />

                <div className="w-3 h-5 flex items-center">
                  <div className="w-3 h-3 border-[3px] border-theme500 rounded-full" />
                </div>

                <Bar className={cn(isLast && "bg-transparent")} />
              </div>

              {datalistItem}
            </div>
          );
        }}
      />

      <Pagination
        page={feeds.page}
        pageSize={feeds.pageSize}
        total={feeds.total}
      />
    </SecondaryCard>
  );
}
