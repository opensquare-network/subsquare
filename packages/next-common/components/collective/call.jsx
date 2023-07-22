import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { usePostOnChainData } from "next-common/context/post";
import Chains from "next-common/utils/consts/chains";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import MarketMetadata from "next-common/components/collective/metadata/marketMetadata";
import React from "react";
import { useChain } from "next-common/context/chain";
import { useDetailType } from "next-common/context/page";

export default function CollectiveCall({ call }) {
  const motion = usePostOnChainData();
  const chain = useChain();
  const detailType = useDetailType();

  const data = [["Hash", motion.hash], [<Proposal key={"call"} call={call} />]];

  if (
    Chains.zeitgeist === chain &&
    detailPageCategory.ADVISORY_MOTION === detailType
  ) {
    const { marketId, marketMetadata } = motion;
    data.push([
      <MarketMetadata
        key={"marketMetadata"}
        id={marketId}
        metadata={marketMetadata}
      />,
    ]);
  }

  return <KvList data={data} />;
}
