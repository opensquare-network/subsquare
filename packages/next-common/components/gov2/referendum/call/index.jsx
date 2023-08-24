import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { useOnchainData } from "next-common/context/post";
import useReferendaBusinessData from "@subsquare/next/hooks/useReferendaBusinessData";
import React from "react";
import Copyable from "next-common/components/copyable";
import extractRemarkMetaFields from "next-common/components/common/call/remarks";
import extractWhitelistCallHash from "next-common/components/common/call/whitelist";

export default function Gov2ReferendumCall() {
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};

  const data = [
    [
      "Proposal Hash",
      <Copyable key="hash">{onchainData?.proposalHash}</Copyable>,
    ],
    [
      <Proposal
        key={"call"}
        call={proposal?.call}
        shorten={proposal?.shorten}
      />,
    ],
  ];

  const businessData = useReferendaBusinessData();
  if (businessData) {
    data.push(...businessData);
  }
  data.push(
    ...[
      ...extractRemarkMetaFields(proposal?.call),
      ...extractWhitelistCallHash(proposal?.call),
    ],
  );

  return <KvList data={data} />;
}
