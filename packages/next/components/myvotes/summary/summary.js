import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { ModuleTab } from "next-common/components/profile/votingHistory/common";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
import BigNumber from "bignumber.js";
import PriorInfo from "./prior";
import LoadableContent from "next-common/components/common/loadableContent";
import { AccountSubTabs } from "components/overview/account/subTabs";

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
  prior,
  delegated,
  unLockable,
  actionComponent,
  isLoading = false,
}) {
  const { symbol, decimals } = useChainSettings();

  const items = [
    {
      title: "All Votes",
      content: (
        <LoadableContent isLoading={isLoading}>
          <CountSummaryContent count={votesLength} />
        </LoadableContent>
      ),
    },
    {
      title: "Total Locked",
      content: (
        <LoadableContent isLoading={isLoading}>
          <TokenValueContent value={totalLocked} />
          <PriorInfo prior={prior} />
        </LoadableContent>
      ),
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
        <LoadableContent isLoading={isLoading}>
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
        </LoadableContent>
      ),
    },
  ].filter(Boolean);

  return (
    <>
      <div className="flex justify-between sm:items-center max-sm:flex-col gap-[12px]">
        <AccountSubTabs />
        <ModuleTab />
      </div>
      <SecondaryCard>
        <SummaryItems items={items} />
      </SecondaryCard>
    </>
  );
}
