import React from "react";
import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { usePostOnChainData } from "next-common/context/post";
import Copyable from "../../copyable";
import useExternalPreimage from "next-common/components/collective/call/useExternalPreimage";

export default function CollectiveCall({ call }) {
  const motion = usePostOnChainData();

  const data = [
    ["Hash", <Copyable key="hash">{motion.hash}</Copyable>],
    [<Proposal key={"call"} call={call} />],
  ];

  const preimage = useExternalPreimage(call);
  if (preimage) {
    const { hex, normalized } = preimage;
    data.push([
      <Proposal
        key={"call"}
        title="Proposal"
        preImageHash={motion.hash}
        preImageHex={hex}
        call={normalized}
        indexer={motion?.indexer}
      />,
    ]);
  }

  return <KvList data={data} />;
}
