import React from "react";
import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { usePostOnChainData } from "next-common/context/post";
import Chains from "next-common/utils/consts/chains";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import MarketMetadata from "next-common/components/collective/metadata/marketMetadata";
import { useChain } from "next-common/context/chain";
import { useDetailType } from "next-common/context/page";
import Copyable from "../copyable";

export default function CollectiveCall({ call, externalProposals }) {
  const motion = usePostOnChainData();
  const chain = useChain();
  const detailType = useDetailType();

  const data = [
    ["Hash", <Copyable key="hash">{motion.hash}</Copyable>],
    [<Proposal key={"call"} call={call} />],
  ];

  (externalProposals || []).forEach((item) => {
    if (!item?.preImage) {
      return;
    }
    data.push([
      <Proposal
        key={"external-call"}
        title="External Call"
        call={item.preImage.call}
        preImageHash={item.preImage.hash}
      />,
    ]);
  });

  if (
    Chains.zeitgeist === chain &&
    detailPageCategory.ADVISORY_MOTION === detailType
  ) {
    const { marketId, marketMetadata } = motion;
    if (marketId && marketMetadata) {
      data.push([
        <MarketMetadata
          key={"marketMetadata"}
          id={marketId}
          metadata={marketMetadata}
        />,
      ]);
    }
  }

  return <KvList data={data} />;
}
