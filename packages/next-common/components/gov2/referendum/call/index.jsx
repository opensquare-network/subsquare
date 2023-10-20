import React from "react";
import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { useOnchainData } from "next-common/context/post";
import useReferendaBusinessData from "@subsquare/next/hooks/useReferendaBusinessData";
import Copyable from "next-common/components/copyable";
import extractRemarkMetaFields from "next-common/components/common/call/remarks";
import extractWhitelistCallHash from "next-common/components/common/call/whitelist";

export default function Gov2ReferendumCall() {
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};
  const { call: inlineCall } = onchainData?.inlineCall || {};
  const preImageHash = onchainData?.proposalHash;

  const data = [
    onchainData?.proposalHash
      ? [
          "Proposal Hash",
          <Copyable key="hash">{onchainData?.proposalHash}</Copyable>,
        ]
      : null,
    inlineCall
      ? [
          <Proposal
            key={"call"}
            call={inlineCall}
            preImageHash={preImageHash}
          />,
        ]
      : null,
    proposal?.call && !inlineCall
      ? [
          <Proposal
            key={"call"}
            call={proposal?.call}
            shorten={proposal?.shorten}
            preImageHash={preImageHash}
          />,
        ]
      : null,
  ].filter(Boolean);

  const businessData = useReferendaBusinessData();
  if (businessData) {
    data.push(...businessData);
  }
  data.push(
    ...[
      ...extractRemarkMetaFields(proposal?.call || inlineCall),
      ...extractWhitelistCallHash(proposal?.call),
    ],
  );

  return <KvList data={data} />;
}
