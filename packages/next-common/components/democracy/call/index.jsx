import { useDemocracyReferendumHash } from "next-common/hooks/democracy/useDemocracyReferendumHash";
import KvList from "../../listInfo/kvList";
import Proposal from "../../proposal";
import { useChain } from "next-common/context/chain";
import React from "react";
import extractKintsugiFields from "next-common/components/democracy/common/kintsugiCallFields";
import extractTreasuryFields from "next-common/components/democracy/call/treasury";
import Copyable from "next-common/components/copyable";
import extractRemarkMetaFields from "next-common/components/common/call/remarks";
import usePreImageCallFromHash from "next-common/components/proposal/preImage";

export default function ReferendumCall({ call, shorten, onchainData = {} }) {
  const hash = useDemocracyReferendumHash();
  const chain = useChain();
  const preImageHash = onchainData.preImage?.hash;
  const { call: rawCall, isLoading: isLoadingRawCall } =
    usePreImageCallFromHash(preImageHash);

  const data = [
    ["Hash", <Copyable key="hash">{hash}</Copyable>],
    [
      <Proposal
        key={"call"}
        call={call}
        rawCall={rawCall}
        isLoadingRawCall={isLoadingRawCall}
        shorten={shorten}
        referendumIndex={onchainData.referendumIndex}
      />,
    ],
    ...extractKintsugiFields(chain, call),
    ...extractTreasuryFields(call),
    ...extractRemarkMetaFields(call),
  ];

  return <KvList data={data} />;
}
