import styled from "styled-components";
import User from "../user";
import Links from "../links";
import Proposal from "../proposal";
import KVList from "../listInfo/kvList";
import { getNode, toPrecision } from "utils";

const MetadataProposerWrapper = styled.div`
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export default function Metadata({ publicProposal, chain }) {
  if (!publicProposal) {
    return null;
  }

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
      <MetadataProposerWrapper key={"index-proposer"}>
        <User chain={chain} add={publicProposal?.proposer} />
        <Links chain={chain} address={publicProposal?.proposer} />
      </MetadataProposerWrapper>,
    ],
  ];

  if (publicProposal?.preImage) {
    metadata.push([
      <Proposal
        key={"index-proposal"}
        motion={{ proposal: publicProposal.preImage.call }}
        chain={chain}
      />,
    ]);
  }

  return <KVList title="Metadata" data={metadata} showFold />;
}
