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
import RelayChainCallDecodeViewList, {
  useRelayChainCallDecodeType,
} from "next-common/components/gov2/referendum/call/relayChainCallDecode";
import { useCallList } from "next-common/hooks/useCallList";

export default function Gov2ReferendumCall() {
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};
  const inlineCall = onchainData?.inlineCall || {};
  const preImageHash = onchainData?.proposalHash;

  const whitelistDispatchedHashes =
    onchainData?.whitelistDispatchedHashes || [];
  const whitelistHashes = onchainData?.whitelistedHashes || [];
  const whitelistCallHashes =
    whitelistDispatchedHashes?.concat(whitelistHashes);

  const { calls } = useCallList();

  const { value: relayChainDecodes } = useRelayChainCallDecodeType(
    proposal?.call || inlineCall?.call,
  );

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
    relayChainDecodes.length > 0
      ? [
          "Relay chain call",
          <RelayChainCallDecodeViewList
            key="Relay chain call"
            relayChainDecodes={relayChainDecodes}
          />,
        ]
      : null,
    ...calls,
  ].filter(Boolean);

  const businessData = useReferendaBusinessData();
  if (businessData) {
    data.push(...businessData);
  }
  data.push(
    ...[
      ...extractRemarkMetaFields(proposal?.call || inlineCall?.call),
      ...extractWhitelistCallHash(whitelistCallHashes),
      ...extractFellowshipPromote(proposal?.call || inlineCall?.call),
      ...extractFellowshipApprove(proposal?.call || inlineCall?.call),
    ],
  );

  return <KvList data={data} />;
}
