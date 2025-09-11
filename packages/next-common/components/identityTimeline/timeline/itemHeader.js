import BlockTime from "./blockTime";
import BlockHeight from "./blockHeight";
import Link from "./link";
import { isNil } from "lodash-es";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { isCollectivesChain } from "next-common/utils/chain";

function getDomain(chain, indexer) {
  const { blockTime } = indexer || {};
  let prefix = chain;
  if ([Chains.polkadot, Chains.polkadotPeople].includes(chain)) {
    prefix = blockTime >= 1722256998000 ? "people-polkadot" : "polkadot";
  } else if ([Chains.kusama, Chains.kusamaPeople].includes(chain)) {
    prefix = blockTime >= 1716111336000 ? "people-kusama" : "kusama";
  } else if (isCollectivesChain(chain)) {
    prefix = Chains.polkadot;
  }
  return `https://${prefix}.statescan.io/#`;
}

function ExtrinsicAndEvent({ indexer }) {
  const currentChain = useChain();
  const { blockHeight, extrinsicIndex, eventIndex, chain } = indexer;

  let domain = getDomain(currentChain, indexer);
  if (chain === "people" && currentChain === Chains.kusama) {
    domain = "https://people-kusama.statescan.io/#";
  }

  return (
    <>
      <Link href={`${domain}/extrinsics/${blockHeight}-${extrinsicIndex}`}>
        Extrinsic
      </Link>
      {!isNil(eventIndex) && (
        <Link href={`${domain}/events/${blockHeight}-${eventIndex}`}>
          Event
        </Link>
      )}
    </>
  );
}

export default function TimelineItemInfoHeader({ item }) {
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
