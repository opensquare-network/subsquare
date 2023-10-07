import React from "react";
import capitalize from "../../../utils/capitalize";
import KVList from "../../listInfo/kvList";
import Copyable from "next-common/components/copyable";
import AddressUser from "next-common/components/user/addressUser";

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
    <AddressUser add={proposer} key="proposer" />,
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
    [capitalize(keys.hash), <Copyable key={keys.hash}>{hash}</Copyable>],
  );

  return <KVList title="Metadata" data={data} />;
}
