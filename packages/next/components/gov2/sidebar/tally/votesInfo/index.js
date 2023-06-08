import styled from "styled-components";
import FlattenedVotes from "../flattenedVotes";
import CallsVotes from "../callsVotes";
import NestedVotes from "../nestedVotes";
import { useOnchainData } from "next-common/context/post";
import {
  flex,
  gap_x,
  items_center,
  justify_between,
  text_primary,
} from "next-common/styles/tailwindcss";
import { p_12_medium } from "next-common/styles/componentCss";
import PercentageBar from "next-common/components/percentageBar";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { Tooltip } from "../../status/styled";
import { useChainSettings } from "next-common/context/chain";
import usePercentageBarData from "./usePercentageBarData";

const VotesGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  gap: 8px;
`;

const VotesInfoLine = styled.div`
  ${flex};
  ${items_center};
  ${justify_between};
`;

const VotesGroupLabel = styled.div`
  ${p_12_medium};
  ${text_primary};
`;

const VotesGroupItems = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(12)};
`;

function PercentageTooltip({
  type,
  referendumIndex,
  directPercentage,
  directAmount,
  delegatedPercentage,
  delegatedAmount,
}) {
  const { symbol, decimals } = useChainSettings();
  const fromUnit = useCallback(
    (value) => new BigNumber(value).div(Math.pow(10, decimals)).toFixed(2),
    [decimals]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontWeight: 600 }}>Referendum #{referendumIndex}</span>
      <span>
        {type}: {directPercentage.toFixed(2)}% ({fromUnit(directAmount)}{" "}
        {symbol})
      </span>
      <span>
        Delegated: {delegatedPercentage.toFixed(2)}% (
        {fromUnit(delegatedAmount)} {symbol})
      </span>
    </div>
  );
}

export default function VotesInfo() {
  const { referendumIndex } = useOnchainData();

  const {
    directCapital,
    delegatedCapital,
    directVotes,
    delegatedVotes,
    directCapitalPercentage,
    delegatedCapitalPercentage,
    directVotesPercentage,
    delegatedVotesPercentage,
  } = usePercentageBarData();

  return (
    <VotesGroup>
      <VotesInfoLine>
        <VotesGroupLabel>Votes</VotesGroupLabel>
        <VotesGroupItems>
          <FlattenedVotes />
          <NestedVotes />
          <CallsVotes />
        </VotesGroupItems>
      </VotesInfoLine>
      <VotesInfoLine>
        <VotesGroupLabel>Capital Pct.</VotesGroupLabel>
        <Tooltip
          content={
            <PercentageTooltip
              type="Capital"
              referendumIndex={referendumIndex}
              directPercentage={directCapitalPercentage}
              directAmount={directCapital}
              delegatedPercentage={delegatedCapitalPercentage}
              delegatedAmount={delegatedCapital}
            />
          }
        >
          <PercentageBar
            percent={directCapitalPercentage}
            colorLeft="rgba(15, 111, 255, 0.4)"
            colorRight="rgba(232, 31, 102, 0.4)"
          />
        </Tooltip>
      </VotesInfoLine>
      <VotesInfoLine>
        <VotesGroupLabel>Votes Pct.</VotesGroupLabel>
        <Tooltip
          content={
            <PercentageTooltip
              type="Votes"
              referendumIndex={referendumIndex}
              directPercentage={directVotesPercentage}
              directAmount={directVotes}
              delegatedPercentage={delegatedVotesPercentage}
              delegatedAmount={delegatedVotes}
            />
          }
        >
          <PercentageBar
            percent={directVotesPercentage}
            colorLeft="rgba(255, 152, 0, 0.4)"
            colorRight="rgba(232, 31, 102, 0.4)"
          />
        </Tooltip>
      </VotesInfoLine>
    </VotesGroup>
  );
}
