import React from "react";
import capitalize from "../../../utils/capitalize";
import KVList from "../../listInfo/kvList";
import User from "../../user";

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
}) {
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

  return <KVList title="Metadata" data={data} />;
}
