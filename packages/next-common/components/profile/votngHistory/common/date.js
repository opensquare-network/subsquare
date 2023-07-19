import dayjs from "dayjs";
import ExplorerLink from "next-common/components/links/explorerLink";

export default function CallDate({ vote }) {
  return (
    <div key="date" className="text-textTertiary whitespace-nowrap">
      <ExplorerLink indexer={vote.indexer}>
        {dayjs(vote.indexer.blockTime).format("YYYY-MM-DD hh:mm:ss")}
      </ExplorerLink>
    </div>
  );
}
