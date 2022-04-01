import styled from "styled-components";
import User from "next-common/components/user";
import Links from "next-common/components/links";
import Proposal from "next-common/components/proposal";
import KVList from "next-common/components/listInfo/kvList";
import { getNode, toPrecision } from "utils";

const MetadataProposerWrapper = styled.div`
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default function Metadata({ proposal, chain }) {
  if (!proposal) {
    return null;
  }

  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  const deposit = proposal.deposit;
  const metadata = [
    ["hash", proposal?.hash],
    ["deposit", `${toPrecision(deposit ? deposit[1] : 0, decimals)} ${symbol}`],
    [
      "proposer",
      <MetadataProposerWrapper>
        <User chain={chain} add={proposal?.proposer} />
        <Links chain={chain} address={proposal?.proposer} />
      </MetadataProposerWrapper>,
    ],
  ];

  if (proposal?.preImage) {
    metadata.push([
      <Proposal motion={{ proposal: proposal.preImage.call }} chain={chain} />,
    ]);
  }

  return <KVList title="Metadata" data={metadata} showFold />;
}
