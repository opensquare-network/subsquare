import React from "react";
import capitalize from "../../../utils/capitalize";
import UserWithLink from "../../user/userWithLink";
import Proposal from "../../proposal";
import KVList from "../../listInfo/kvList";

const keys = {
  proposer: "proposer",
  index: "index",
  threshold: "threshold",
  hash: "hash",
  call: "call",
};

export default function CollectiveMetadata({
  chain,
  proposer,
  threshold,
  hash,
  call,
  index,
}) {
  const proposerItem = [
    capitalize(keys.proposer),
    <UserWithLink address={proposer} chain={chain} />,
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
    [capitalize(keys.hash), hash]
  );

  if (call) {
    data.push([
      [capitalize(keys.call), <Proposal call={call} chain={chain} />],
    ]);
  }

  return <KVList title="Metadata" data={data} />;
}
