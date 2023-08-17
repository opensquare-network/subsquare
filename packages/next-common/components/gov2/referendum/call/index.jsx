import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { useOnchainData } from "next-common/context/post";
import useReferendaBusinessData from "@subsquare/next/hooks/useReferendaBusinessData";
import extractRemarks from "next-common/components/gov2/referendum/call/remark";
import React from "react";
import Copyable from "next-common/components/copyable";

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

  let remarks = extractRemarks(proposal?.call);
  for (let i = 0; i < remarks.length; i++) {
    let key = "Remark";
    if (remarks.length > 0) {
      key = `${key} ${i + 1}`;
    }

    data.push([
      key,
      <p className="whitespace-pre-wrap" key={`remark-${i}`}>
        {remarks[i]}
      </p>,
    ]);
  }

  return <KvList data={data} />;
}
