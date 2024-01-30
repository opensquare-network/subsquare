import Pagination from "next-common/components/pagination";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { timeDurationFromNow } from "next-common/utils";
import FellowshipCoreFeedsListEvent from "./event";

export default function FellowshipCoreFeedsList({ feeds = {} }) {
  const rows = feeds?.items?.map?.((item) => {
    return [
      <FellowshipCoreFeedsListEvent
        key={"event"}
        className="w-[640px]"
        feed={item}
      />,
      <div key="time" className="w-40 text14Medium text-textTertiary">
        {timeDurationFromNow(item?.indexer?.blockTime)}
      </div>,
    ];
  });

  return (
    <SecondaryCard>
      <div>
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center gap-x-4 h-10">
            <div className="relative h-[inherit] flex items-center">
              <div className="w-3 h-3 border-[3px] border-theme500 rounded-full" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-theme300" />
            </div>
            <div>{row[0]}</div>
            <div>{row[1]}</div>
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
