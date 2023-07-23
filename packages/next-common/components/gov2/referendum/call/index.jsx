import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { useOnchainData } from "next-common/context/post";
import useReferendaBusinessData from "@subsquare/next/hooks/useReferendaBusinessData";
import extractRemark from "next-common/components/gov2/referendum/call/remark";
import React from "react";

export default function Gov2ReferendumCall() {
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};

  const data = [
    ["Proposal Hash", onchainData?.proposalHash],
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

  let remark = extractRemark(proposal?.call);
  if (remark) {
    data.push([
      "Remark",
      <p className="whitespace-pre-wrap" key="remark">
        {remark}
      </p>,
    ]);
  }

  return <KvList data={data} />;
}
