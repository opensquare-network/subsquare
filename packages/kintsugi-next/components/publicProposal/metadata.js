/* eslint-disable react/jsx-key */
import styled from "styled-components";
import KVList from "next-common/components/listInfo/kvList";
import User from "next-common/components/user";
import Links from "next-common/components/links";
import Proposal from "next-common/components/proposal";
import { getNode, toPrecision } from "next-common/utils";

const MetadataProposerWrapper = styled.div`
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default function Metadata({ publicProposal, chain }) {
  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  const deposit = publicProposal.deposit;

  const metadata = [
    ["hash", publicProposal?.hash],
    ["deposit", `${toPrecision(deposit ? deposit[1] : 0, decimals)} ${symbol}`],
    [
      "proposer",
      <MetadataProposerWrapper>
        <User chain={chain} add={publicProposal?.proposer} />
        <Links chain={chain} address={publicProposal?.proposer} />
      </MetadataProposerWrapper>,
    ],
  ];

  if (publicProposal?.preImage) {
    metadata.push([
      <Proposal
        motion={{ proposal: publicProposal.preImage.call }}
        chain={chain}
      />,
    ]);
  }

  return <KVList title="Metadata" data={metadata} showFold />;
}
