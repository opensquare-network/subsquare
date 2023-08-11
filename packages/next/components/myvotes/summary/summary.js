import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { Title } from "../styled";
import { ModuleTab } from "next-common/components/profile/votingHistory/common";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
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

function TokenValueContent({ value }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <TextSummaryContent
      value={
        <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />
      }
    />
  );
}

export default function ReferendaVoteSummary({
  votesLength = 0,
  totalLocked,
  delegated,
  unLockable,
  actionComponent,
}) {
  const { symbol, decimals } = useChainSettings();
  const { hasReferenda, noDemocracyModule } = useChainSettings();

  const items = [
    {
      title: "All Votes",
      content: <CountSummaryContent count={votesLength} />,
    },
    {
      title: "Total Locked",
      content: <TokenValueContent value={totalLocked} />,
    },
    new BigNumber(delegated).gt(0)
      ? {
          title: "Delegated",
          content: <TokenValueContent value={delegated} />,
        }
      : null,
    {
      title: "Unlockable",
      content: (
        <TextSummaryContent
          value={
            <div className="flex flex-col">
              <ValueDisplay
                value={toPrecision(unLockable, decimals)}
                symbol={symbol}
              />
              {actionComponent}
            </div>
          }
        />
      ),
    },
  ].filter(Boolean);

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
