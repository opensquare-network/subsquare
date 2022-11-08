import KVList from "../../../listInfo/kvList";
import React from "react";
import Proposal from "../../../proposal";
import User from "../../../user";

export default function Gov2ReferendumMetadata({
  api,
  proposer,
  chain,
  onchainData = {},
  detail,
}) {
  const call = detail?.onchainData?.preImage?.call || detail?.onchainData?.call;
  const shorten = detail?.onchainData?.preImage?.shorten;

  const metadata = [
    ["Submission", <User add={proposer} fontSize={14} />],
    ["Decision", <User add={proposer} fontSize={14} />],
    ["Decision Period", "todo"],
    ["Confirming Period", "todo"],
    ["Enact", "todo"],
    ["Proposal", detail?.title],
  ];

  if (call) {
    metadata.push([
      <Proposal
        key="preimage"
        call={call}
        chain={chain}
        shorten={shorten}
        referendumIndex={onchainData.referendumIndex}
      />,
    ]);
  }

  return <KVList title={"Metadata"} data={metadata} showFold={true} />;
}
