import BlockTime from "./blockTime";
import BlockHeight from "./blockHeight";
import Link from "./link";
import { isNil } from "lodash-es";
import { useChain } from "next-common/context/chain";

export default function TimelineItemInfoHeader({ item }) {
  const chain = useChain();
  return (
    <div className="flex flex-col py-[8px] gap-[8px] min-w-[280px] max-sm:min-w-fit">
      <div className="text14Bold text-textPrimary">{item.name}</div>
      <div className="flex flex-col gap-[4px]">
        <BlockTime ts={item.indexer.blockTime} />
        <BlockHeight number={item.indexer.blockHeight} />
      </div>
      <div className="flex gap-[8px]">
        <Link
          href={`https://${chain}.statescan.io/#/extrinsics/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
        >
          Extrinsic
        </Link>
        {!isNil(item.indexer.eventIndex) && (
          <Link
            href={`https://${chain}.statescan.io/#/events/${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
          >
            Event
          </Link>
        )}
      </div>
    </div>
  );
}
