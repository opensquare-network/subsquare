import React from "react";
import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { useOnchainData } from "next-common/context/post";
import useReferendaBusinessData from "next-common/hooks/pages/useReferendaBusinessData";
import Copyable from "next-common/components/copyable";
import extractRemarkMetaFields from "next-common/components/common/call/remarks";
import extractWhitelistCallHash from "next-common/components/common/call/whitelist";
import extractFellowshipPromote from "next-common/components/common/call/fellowshipPromote";
import extractFellowshipApprove from "next-common/components/common/call/fellowshipApprove";
import dynamic from "next/dynamic";
import isHydradx from "next-common/utils/isHydradx";
import { useChain } from "next-common/context/chain";
import {
  isCollectivesChain,
  isKusamaChain,
  isPolkadotChain,
} from "next-common/utils/chain";

const EvmCall = dynamic(() => import("./evmCallDecode"), {
  ssr: false,
});
const RelayChainCall = dynamic(
  () => import("./parachain/relayChainCallDecode"),
  {
    ssr: false,
  },
);

const RelayToParachainCall = dynamic(
  () => import("./parachain/relayToParachainDecodeCall"),
  {
    ssr: false,
  },
);

export default function Gov2ReferendumCall() {
  const chain = useChain();
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};
  const inlineCall = onchainData?.inlineCall || {};
  const preImageHash = onchainData?.proposalHash;

  const whitelistDispatchedHashes =
    onchainData?.whitelistDispatchedHashes || [];
  const whitelistHashes = onchainData?.whitelistedHashes || [];
  const whitelistCallHashes =
    whitelistDispatchedHashes?.concat(whitelistHashes);

  const data = [];

  const callData = proposal?.call || inlineCall?.call;

  if (onchainData?.proposalHash) {
    data.push([
      "Proposal Hash",
      <Copyable key="hash" className="text14Medium">
        {onchainData?.proposalHash}
      </Copyable>,
    ]);
  }

  if (inlineCall?.call) {
    data.push([
      <Proposal
        key={"call"}
        call={inlineCall?.call}
        preImageHash={preImageHash}
      />,
    ]);
  }

  if (proposal?.call && !inlineCall?.call) {
    data.push([
      <Proposal
        key={"call"}
        call={proposal?.call}
        shorten={proposal?.shorten}
        preImageHash={preImageHash}
      />,
    ]);
  }

  const businessData = useReferendaBusinessData();
  if (businessData) {
    data.push(...businessData);
  }
  data.push(
    ...[
      ...extractRemarkMetaFields(onchainData.remarks ?? []),
      ...extractWhitelistCallHash(whitelistCallHashes),
      ...extractFellowshipPromote(proposal?.call || inlineCall?.call),
      ...extractFellowshipApprove(proposal?.call || inlineCall?.call),
    ],
  );

  if (isHydradx(chain) && callData) {
    data.push(<EvmCall key="evm-call" call={callData} />);
  }

  if (isCollectivesChain(chain) && callData) {
    data.push(<RelayChainCall key="relay-chain-call" />);
  }

  if ((isPolkadotChain(chain) || isKusamaChain(chain)) && callData) {
    data.push(<RelayToParachainCall key="relay-to-parachain-call" />);
  }

  return <KvList data={data} />;
}
