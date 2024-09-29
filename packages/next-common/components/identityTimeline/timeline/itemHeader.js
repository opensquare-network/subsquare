import BlockTime from "./blockTime";
import BlockHeight from "./blockHeight";
import Link from "./link";
import { isNil } from "lodash-es";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

function ExtrinsicAndEvent({indexer}) {
  const currentChain = useChain();
  const { blockHeight, extrinsicIndex, eventIndex, chain } = indexer;
  if (currentChain === Chains.polkadot && chain === "people") {
    const domain = "https://people-polkadot.subscan.io";
    return (<>
      <Link
        href={`${domain}/extrinsic/${blockHeight}-${extrinsicIndex}`}
      >
        Extrinsic
      </Link>
      {!isNil(eventIndex) && (
        <Link
          href={`${domain}/block/${blockHeight}?tab=event&event=${blockHeight}-${eventIndex}`}
        >
          Event
        </Link>
      )}
    </>);
  }

  let domain = `https://${currentChain}.statescan.io/#`;
  if (chain === "people" && currentChain === Chains.kusama) {
    domain = "https://people-kusama.statescan.io/#";
  }

  return (<>
    <Link
      href={`${domain}/extrinsics/${blockHeight}-${extrinsicIndex}`}
    >
      Extrinsic
    </Link>
    {!isNil(eventIndex) && (
      <Link
        href={`${domain}/events/${blockHeight}-${eventIndex}`}
      >
        Event
      </Link>
    )}
  </>);
}

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
        <ExtrinsicAndEvent indexer={item.indexer} />
      </div>
    </div>
  );
}
