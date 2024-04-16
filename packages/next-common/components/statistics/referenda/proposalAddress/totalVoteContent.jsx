import React, { memo } from "react";
import { StatisticsItemDiv } from "./style";
import Divider from "next-common/components/styled/layout/divider";
import { cn, formatNum, toPrecision } from "next-common/utils";
import SymbolValue from "@subsquare/next/components/gov2/sidebar/tally/values/symbolValue";
import VoteChart from "./voteChart";
import { useTheme } from "styled-components";
import { useChainSettings } from "next-common/context/chain";

const processData = (data, decimals) => {
  return data.map((value) => Number(toPrecision(value || 0, decimals)));
};
function TotalVoteItem({ className, title, numberRender, chartRender }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-x-auto overflow-y-hidden scrollbar-pretty",
        className,
      )}
    >
      <span className="text12Medium text-textTertiary mb-1">{title}</span>
      <div className="mb-4">{numberRender}</div>
      <Divider className="mb-4" />
      {chartRender}
    </div>
  );
}
function TotalVoteContent() {
  const theme = useTheme();
  const { decimals } = useChainSettings();
  const categoryPercentage = 1;
  const barPercentage = 0.1;
  const dataAccounts = {
    labels: ["Delegated", "Casted"],
    datasets: [
      {
        label: "Aye",
        data: [0, 3002323],
        backgroundColor: theme.green300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Nay",
        data: [0, 804334],
        backgroundColor: theme.red300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Abstain",
        data: [0, 504552],
        backgroundColor: theme.neutral400,
        categoryPercentage,
        barPercentage,
      },
    ],
  };
  const dataCapital = {
    labels: ["Delegated", "Directly"],
    datasets: [
      {
        label: "Aye",
        data: processData([1234567890, 9876543210], decimals),
        backgroundColor: theme.green300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Nay",
        data: processData([1234567890, 9876543210], decimals),
        backgroundColor: theme.red300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Abstain",
        data: processData([1234567890, 9876543210], decimals),
        backgroundColor: theme.neutral400,
        categoryPercentage,
        barPercentage,
      },
    ],
  };
  const dataVotes = {
    labels: ["Delegated", "Directly"],
    datasets: [
      {
        label: "Aye",
        data: processData([1234567890, 4876543210], decimals),
        backgroundColor: theme.green300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Nay",
        data: processData([223456789, 3876543210], decimals),
        backgroundColor: theme.red300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Abstain",
        data: processData([3234567890, 5876543210], decimals),
        backgroundColor: theme.neutral400,
        categoryPercentage,
        barPercentage,
      },
    ],
  };

  const dataList = [
    {
      title: "Total Vote Accounts",
      numberRender: (
        <span className="text-textPrimary text16Bold">{formatNum(19684)}</span>
      ),
      chartRender: <VoteChart data={dataAccounts} />,
    },
    {
      title: "Total Capital",
      numberRender: <SymbolValue value={0} />,
      chartRender: <VoteChart data={dataCapital} symbol="DOT" />,
    },
    {
      title: "Total Votes",
      numberRender: <SymbolValue value={54653453} />,
      chartRender: <VoteChart data={dataVotes} symbol="DOT" />,
    },
  ];

  return (
    <StatisticsItemDiv className="flex max-md:flex-col md:flex-row gap-12">
      {dataList.map((i) => (
        <TotalVoteItem
          key={i.title}
          className="max-md:w-full md:flex-1"
          {...i}
        />
      ))}
    </StatisticsItemDiv>
  );
}
export default memo(TotalVoteContent);
