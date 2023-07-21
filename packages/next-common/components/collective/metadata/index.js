import React from "react";
import capitalize from "../../../utils/capitalize";
import KVList from "../../listInfo/kvList";
import User from "../../user";
import { useChain } from "../../../context/chain";
import MarketMetadata from "./marketMetadata";
import Chains from "../../../utils/consts/chains";
import { useDetailType } from "../../../context/page";
import { detailPageCategory } from "../../../utils/consts/business/category";

const keys = {
  proposer: "proposer",
  index: "index",
  threshold: "threshold",
  hash: "hash",
};

export default function CollectiveMetadata({
  proposer,
  threshold,
  hash,
  index,
  marketId,
  marketMetadata,
}) {
  const chain = useChain();
  const detailType = useDetailType();

  const proposerItem = [
    capitalize(keys.proposer),
    <User add={proposer} fontSize={14} key="proposer" />,
  ];
  const indexItem = Number.isInteger(index)
    ? [capitalize(keys.index), index]
    : null;

  const data = [proposerItem];
  if (indexItem) {
    data.push(indexItem);
  }
  data.push(
    [capitalize(keys.threshold), threshold],
    [capitalize(keys.hash), hash],
  );

  if (
    chain === Chains.zeitgeist &&
    detailPageCategory.ADVISORY_MOTION === detailType
  ) {
    data.push([
      <MarketMetadata
        key={"marketMetadata"}
        id={marketId}
        metadata={marketMetadata}
      />,
    ]);
  }

  return <KVList title="Metadata" data={data} />;
}
