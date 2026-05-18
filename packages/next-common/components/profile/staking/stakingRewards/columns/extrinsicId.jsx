import { useChain } from "next-common/context/chain";
import { getStatescanDomain } from "next-common/utils/statescan";

export function useStakingRewardsExtrinsicIdColumn() {
  const chain = useChain();
  const domain = getStatescanDomain(chain);

  return {
    name: "Extrinsic ID",
    style: { textAlign: "left", width: "120px", maxWidth: "120px" },
    render: (item) =>
      item.indexer.extrinsicIndex !== undefined ? (
        <a
          key="extrinsicId"
          className="text-theme500"
          href={`https://${domain}.statescan.io/#/extrinsics/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
          target="_blank"
          rel="noreferrer"
        >
          {item.indexer.blockHeight}-{item.indexer.extrinsicIndex}
        </a>
      ) : null,
  };
}
