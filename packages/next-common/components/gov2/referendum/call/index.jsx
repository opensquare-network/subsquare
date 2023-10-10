import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { useOnchainData } from "next-common/context/post";
import useReferendaBusinessData from "@subsquare/next/hooks/useReferendaBusinessData";
import React from "react";
import Copyable from "next-common/components/copyable";
import extractRemarkMetaFields from "next-common/components/common/call/remarks";
import extractWhitelistCallHash from "next-common/components/common/call/whitelist";
import useInlineCall from "next-common/components/gov2/referendum/call/inline";
import useCallFromHex from "./hex";

export default function Gov2ReferendumCall() {
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};
  const inlineCall = useInlineCall();
  const hexCall = useCallFromHex();
  console.log(1, hexCall);

  const data = [
    onchainData?.proposalHash
      ? [
          "Proposal Hash",
          <Copyable key="hash">{onchainData?.proposalHash}</Copyable>,
        ]
      : null,
    inlineCall
      ? [<Proposal key={"call"} call={inlineCall} proposal={hexCall} />]
      : null,
    proposal?.call
      ? [
          <Proposal
            key={"call"}
            call={proposal?.call}
            proposal={hexCall}
            shorten={proposal?.shorten}
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
