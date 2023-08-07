import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import React, { useState } from "react";
import styled from "styled-components";
import { useChainSettings } from "next-common/context/chain";
import { Title } from "../styled";
import { ModuleTab } from "next-common/components/profile/votingHistory/common";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";
import ClearExpiredVotePopup from "../clearExpiredVotePopup";
import { incMyVotesTrigger } from "next-common/store/reducers/myVotesSlice";
import { useDispatch } from "react-redux";

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

export default function VoteSummary({
  votesLength = 0,
  totalLocked,
  unLockable,
  voteExpiredReferenda,
}) {
  const { symbol, decimals } = useChainSettings();
  const { hasReferenda, noDemocracyModule } = useChainSettings();
  const [showClearExpired, setShowClearExpired] = useState(false);
  const dispatch = useDispatch();

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
                  Clear expired votes
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
        {hasReferenda && !noDemocracyModule && <ModuleTab />}
      </div>
      <SecondaryCard>
        <SummaryItems items={items} />
      </SecondaryCard>
      {showClearExpired && (
        <ClearExpiredVotePopup
          votes={voteExpiredReferenda}
          onClose={() => setShowClearExpired(false)}
          onInBlock={() => dispatch(incMyVotesTrigger())}
        />
      )}
    </>
  );
}
