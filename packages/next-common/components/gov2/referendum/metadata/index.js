import KVList from "../../../listInfo/kvList";
import React from "react";
import Proposal from "../../../proposal";
import User from "../../../user";
import { estimateBlocksTime, toPrecision } from "../../../../utils";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "../../../../store/reducers/chainSlice";
import styled from "styled-components";
import Flex from "../../../styled/flex";
import Tooltip from "../../../tooltip";
import { p_12_normal } from "../../../../styles/componentCss";
import { useDecimals, useVoteSymbol } from "../../../../context/chain";
import isNil from "lodash.isnil";

// submissionDeposit
// decisionDeposit
// Decision Period
// Confirming Period
const ValueWrapper = styled(Flex)`
  gap: 8px;
`;

const BondValueWrapper = styled(Flex)`
  gap: 8px;
  &::before {
    content: "·";
    color: ${(p) => p.theme.textTertiary};
  }
`;

const GreyText = styled.div`
  display: inline-flex;
  align-items: center;
  color: ${(p) => p.theme.textTertiary};
  ${p_12_normal};
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

function getEnactmentValue(enactment = {}) {
  let value = "";
  let key;
  if (!isNil(enactment.at)) {
    key = "At";
    value = enactment.at;
  } else if (!isNil(enactment.after)) {
    key = "After";
    value = enactment.after;
  }

  if (!key) {
    return "--";
  }

  const localeValue = Number(value).toLocaleString();
  return `${key}: ${localeValue}`;
}

export default function Gov2ReferendumMetadata({ detail }) {
  const blockTime = useSelector(blockTimeSelector);
  const decimals = useDecimals();
  const symbol = useVoteSymbol();

  const onchainData = detail?.onchainData ?? {};
  const info = onchainData?.info ?? {};
  const proposal = onchainData?.proposal ?? {};
  const trackInfo = onchainData?.trackInfo ?? {};
  const proposalHash = onchainData?.proposalHash;

  const decisionPeriod = estimateBlocksTime(
    trackInfo.decisionPeriod,
    blockTime
  );
  const confirmPeriod = estimateBlocksTime(trackInfo.confirmPeriod, blockTime);

  const metadata = [
    [
      "Submission",
      <ValueWrapper>
        <User add={info?.submissionDeposit?.who} fontSize={14} />
        <BondValue
          deposit={info?.submissionDeposit?.amount}
          decimals={decimals}
          symbol={symbol}
        />
      </ValueWrapper>,
    ],
    [
      "Decision",
      info?.decisionDeposit ? (
        <ValueWrapper>
          <User add={info?.decisionDeposit?.who} fontSize={14} />
          <BondValue
            deposit={info?.decisionDeposit?.amount}
            decimals={decimals}
            symbol={symbol}
          />
        </ValueWrapper>
      ) : (
        <GreyText>--</GreyText>
      ),
    ],
    [
      "Decision Period",
      <ValueWrapper>
        <div>
          {decisionPeriod[0]} {decisionPeriod[1]}
        </div>
        <GreyText>
          ({trackInfo?.decisionPeriod?.toLocaleString()} blocks)
        </GreyText>
      </ValueWrapper>,
    ],
    [
      "Confirming Period",
      <ValueWrapper>
        <div>
          {confirmPeriod[0]} {confirmPeriod[1]}
        </div>
        <GreyText>
          ({trackInfo?.confirmPeriod?.toLocaleString()} blocks)
        </GreyText>
      </ValueWrapper>,
    ],
    ["Enact", getEnactmentValue(info?.enactment)],
    ["Proposal Hash", proposalHash],
  ];

  if (proposal?.args) {
    metadata.push([
      <Proposal
        key="preimage"
        call={proposal}
        referendumIndex={detail?.onchainData.referendumIndex}
      />,
    ]);
  }

  return <KVList title={"Metadata"} data={metadata} showFold={true} />;
}
