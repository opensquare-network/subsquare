import { useDemocracyReferendumHash } from "next-common/hooks/democracy/useDemocracyReferendumHash";
import KvList from "../../listInfo/kvList";
import Proposal from "../../proposal";
import { useChain } from "next-common/context/chain";
import React from "react";
import extractKintsugiFields from "next-common/components/democracy/common/kintsugiCallFields";
import extractTreasuryFields from "next-common/components/democracy/call/treasury";

export default function ReferendumCall({ call, shorten, onchainData = {} }) {
  const hash = useDemocracyReferendumHash();
  const chain = useChain();

  const data = [
    ["Hash", hash],
    [
      <Proposal
        key={"call"}
        call={call}
        shorten={shorten}
        referendumIndex={onchainData.referendumIndex}
      />,
    ],
    ...extractKintsugiFields(chain, call),
    ...extractTreasuryFields(call),
  ];

  return <KvList data={data} />;
}
