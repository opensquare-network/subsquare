import KVList from "../../../listInfo/kvList";
import React from "react";
import Proposal from "../../../proposal";
import User from "../../../user";
import { estimateBlocksTime, getNode, toPrecision } from "../../../../utils";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "../../../../store/reducers/chainSlice";
import styled from "styled-components";
import { SubScanAccountLink } from "../../../links/subscanLink";
import Flex from "../../../styled/flex";
import Tooltip from "../../../tooltip";

// submissionDeposit
// decisionDeposit
const DepositWrapper = styled(Flex)`
  gap: 8px;
`;
const BondValueWrapper = styled(Flex)`
  gap: 8px;
  &::before {
    content: "·";
    color: ${(p) => p.theme.textTertiary};
  }
`;

function BondValue({ deposit, decimals, symbol }) {
  const value = `${toPrecision(deposit, decimals)} ${symbol}`;

  return (
    <BondValueWrapper>
      <span>{value}</span>
      <Tooltip content={`Bond: ${value}`} />
    </BondValueWrapper>
  );
}

export default function Gov2ReferendumMetadata({ chain, detail }) {
  const blockTime = useSelector(blockTimeSelector);

  const node = getNode(chain);
  if (!node) {
    return null;
  }

  const decimals = node.decimals;
  const symbol = node.voteSymbol || node.symbol;

  const info = detail?.onchainData?.info ?? {};
  const proposal = detail?.onchainData?.proposal ?? {};
  const trackInfo = detail?.onchainData?.trackInfo ?? {};

  const decisionPeriod = estimateBlocksTime(
    trackInfo.decisionPeriod,
    blockTime
  );
  const confirmPeriod = estimateBlocksTime(trackInfo.confirmPeriod, blockTime);

  const metadata = [
    [
      "Submission",
      <DepositWrapper>
        <User add={info?.submissionDeposit?.who} fontSize={14} />
        <SubScanAccountLink address={info?.submissionDeposit?.who} />
        <BondValue
          deposit={info?.submissionDeposit?.amount}
          decimals={decimals}
          symbol={symbol}
        />
      </DepositWrapper>,
    ],
    [
      "Decision",
      <DepositWrapper>
        <User add={info?.decisionDeposit?.who} fontSize={14} />
        <SubScanAccountLink address={info?.decisionDeposit?.who} />
        <BondValue
          deposit={info?.decisionDeposit?.amount}
          decimals={decimals}
          symbol={symbol}
        />
      </DepositWrapper>,
    ],
    ["Decision Period", `${decisionPeriod[0]} ${decisionPeriod[1]}`],
    ["Confirming Period", `${confirmPeriod[0]} ${confirmPeriod[1]}`],
    ["Enact", info?.enactment?.at],
    ["Proposal", detail?.title ?? "Untitled"],
  ];

  if (proposal?.args) {
    metadata.push([
      <Proposal
        key="preimage"
        call={proposal}
        chain={chain}
        referendumIndex={detail?.onchainData.referendumIndex}
        headerWidth={160}
      />,
    ]);
  }

  return (
    <KVList KWidth={160} title={"Metadata"} data={metadata} showFold={true} />
  );
}
