import React from "react";
import SummaryItems from "next-common/components/summary/summaryItems";
import styled from "styled-components";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { Title } from "./styled";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

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

function sumVoteBalance(votes) {
  return (votes || []).reduce((acc, vote) => {
    if (vote.isStandard) {
      const { balance } = vote.asStandard;
      return acc + balance.toNumber();
    } else if (vote.isSplit) {
      const { aye, nay } = vote.asSplit;
      return acc + aye.toNumber() + nay.toNumber();
    } else if (vote.isSplitAbstain) {
      const { aye, nay, abstain } = vote.asSplitAbstain;
      return acc + aye.toNumber() + nay.toNumber() + abstain.toNumber();
    }

    return acc;
  }, 0);
}

export default function Summary({ votes }) {
  const { symbol, decimals } = useChainSettings();
  const totalBalance = sumVoteBalance(votes);
  const totalValue = toPrecision(totalBalance, decimals);

  const items = [
    {
      title: "All Votes",
      content: <CountSummaryContent count={votes?.length || 0} />,
    },
    {
      title: "Unlockable / Total",
      content: (
        <TextSummaryContent
          value={
            <div className="flex gap-[4px]">
              <ValueDisplay value={0} symbol={symbol} />
              <span className="text-textDisabled">/</span>
              <ValueDisplay value={totalValue} symbol={symbol} />
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
      </div>
      <SecondaryCard>
        <SummaryItems items={items} />
      </SecondaryCard>
    </>
  );
}
