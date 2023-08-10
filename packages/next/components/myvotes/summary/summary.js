import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import React from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { Title } from "../styled";
import {
  Democracy,
  ModuleTab,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";

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

export default function ReferendaVoteSummary({
  votesLength = 0,
  totalLocked,
  unLockable,
  setShowClearExpired,
  actionTitle,
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
      content: (
        <TextSummaryContent
          value={
            <ValueDisplay
              value={toPrecision(totalLocked, decimals)}
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
            <div className="flex flex-col">
              <ValueDisplay
                value={toPrecision(unLockable, decimals)}
                symbol={symbol}
              />
              {!unLockable.isZero() && (
                <div
                  className="cursor-pointer text-theme500 text-[12px]"
                  onClick={() => setShowClearExpired(true)}
                >
                  {actionTitle || "Clear expired votes"}
                </div>
              )}
            </div>
          }
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between md:items-center max-md:flex-col gap-[12px]">
        <Title>My Votes</Title>
        {hasReferenda && !noDemocracyModule && (
          <ModuleTab tabIds={[Referenda, Democracy]} />
        )}
      </div>
      <SecondaryCard>
        <SummaryItems items={items} />
      </SecondaryCard>
    </>
  );
}
