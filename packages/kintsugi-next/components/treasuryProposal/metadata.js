import styled from "styled-components";
import User from "next-common/components/user";
import { getNode, toPrecision } from "utils";
import Links from "next-common/components/links";
import KVList from "next-common/components/listInfo/kvList";

const Flex = styled.div`
  display: flex;
  align-items: center; ;
`;

export default function TreasuryProposalMeta({ chain, treasuryProposal }) {
  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  const metadata = treasuryProposal?.meta
    ? Object.entries(treasuryProposal?.meta)
    : [];
  metadata.forEach((item) => {
    switch (item[0]) {
      case "proposer":
      case "beneficiary":
        item[1] = (
          <Flex>
            <User chain={chain} add={item[1]} fontSize={14} />
            <Links chain={chain} address={item[1]} style={{ marginLeft: 8 }} />
          </Flex>
        );
        break;
      case "value":
      case "bond":
        item[1] = `${toPrecision(item[1] ?? 0, decimals)} ${symbol}`;
    }
  });

  return (
    <KVList title="Metadata" data={metadata} showFold />

  )
}
