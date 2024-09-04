import React from "react";
import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { useOnchainData } from "next-common/context/post";
import useReferendaBusinessData from "@subsquare/next/hooks/useReferendaBusinessData";
import Copyable from "next-common/components/copyable";
import extractRemarkMetaFields from "next-common/components/common/call/remarks";
import extractWhitelistCallHash from "next-common/components/common/call/whitelist";
import extractFellowshipPromote from "next-common/components/common/call/fellowshipPromote";
import extractFellowshipApprove from "next-common/components/common/call/fellowshipApprove";

export default function Gov2ReferendumCall() {
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};
  const inlineCall = onchainData?.inlineCall || {};
  const preImageHash = onchainData?.proposalHash;

  const data = [
    onchainData?.proposalHash
      ? [
          "Proposal Hash",
          <Copyable key="hash">{onchainData?.proposalHash}</Copyable>,
        ]
      : null,
    inlineCall?.call
      ? [
          <Proposal
            key={"call"}
            call={inlineCall?.call}
            preImageHash={preImageHash}
            preImageHex={inlineCall?.hex}
            indexer={onchainData?.indexer}
          />,
        ]
      : null,
    proposal?.call && !inlineCall?.call
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
      ...extractRemarkMetaFields(proposal?.call || inlineCall?.call),
      ...extractWhitelistCallHash(proposal?.call),
      ...extractFellowshipPromote(proposal?.call || inlineCall?.call),
      ...extractFellowshipApprove(proposal?.call || inlineCall?.call),
    ],
  );

  return <KvList data={data} />;
}
