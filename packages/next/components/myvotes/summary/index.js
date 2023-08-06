import React from "react";
import SummaryItems from "next-common/components/summary/summaryItems";
import styled from "styled-components";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { Title } from "../styled";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import {
  ModuleTab,
  useIsReferenda,
} from "next-common/components/profile/votingHistory/common";
import useVoteLockingPeriod from "next-common/hooks/useVoteLockingPeriod";
import calcTotalVotes from "./calcTotalVotes";
import { toPrecision } from "next-common/utils";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import calcNotExpired from "./calcNotExpired";
import BigNumber from "bignumber.js";

const ValueWrapper = styled.div`
  .value-display-symbol {
    color: var(--textTertiary);
  }
`;

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

function TextSummaryContent({ value }) {
  return <ValueWrapper>{value}</ValueWrapper>;
}

export default function Summary({ votes }) {
  const { symbol, decimals } = useChainSettings();
  const isReferenda = useIsReferenda();
  const period = useVoteLockingPeriod(
    isReferenda ? "convictionVoting" : "democracy",
  );
  const latestHeight = useSelector(latestHeightSelector);

  const totalLockedBalance = calcTotalVotes(votes, period, isReferenda);
  const totalNotExpired = calcNotExpired(
    votes,
    period,
    isReferenda,
    latestHeight,
  );
  // fixme: we should also calc prior lock

  const { hasReferenda, noDemocracyModule } = useChainSettings();

  const items = [
    {
      title: "All Votes",
      content: <CountSummaryContent count={votes?.length || 0} />,
    },
    {
      title: "Total Locked",
      content: (
        <TextSummaryContent
          value={
            <ValueDisplay
              value={toPrecision(totalLockedBalance, decimals)}
              symbol={symbol}
            />
          }
        />
      ),
    },
    {
      title: "Unlockable",
      content: (
        <TextSummaryContent
          value={
            <ValueDisplay
              value={new BigNumber(totalLockedBalance)
                .minus(totalNotExpired)
                .toString()}
              symbol={symbol}
            />
          }
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between md:items-center max-md:flex-col gap-[12px]">
        <Title>My Votes</Title>
        {hasReferenda && !noDemocracyModule && <ModuleTab />}
      </div>
      <SecondaryCard>
        <SummaryItems items={items} />
      </SecondaryCard>
    </>
  );
}
