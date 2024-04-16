import { StatisticsItemDiv } from "./style";
import AccountsVotesChart from "./accountsVotesChart";
import React from "react";
import { useTheme } from "styled-components";
export default function AccountsVotesContent() {
  const theme = useTheme();
  const categoryPercentage = 1;
  const barPercentage = 0.1;
  const dataVotes = {
    labels: ["0-10K", "10-50K", "50K-1M", "1M-5M", ">5M"],
    datasets: [
      {
        label: "Aye",
        data: [1000, 500, 60, 520, 150],
        backgroundColor: theme.green300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Nay",
        data: [500, 400, 40, 200, 100],
        backgroundColor: theme.red300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Abstain",
        data: [100, 100, 20, 100, 50],
        backgroundColor: theme.neutral400,
        categoryPercentage,
        barPercentage,
      },
    ],
  };
  return (
    <StatisticsItemDiv>
      <div className="flex gap-2 mb-4">
        <span className="text14Bold text-textPrimary">Accounts</span>
        <span className="text14Bold text-textTertiary">Votes</span>
      </div>
      <AccountsVotesChart data={dataVotes} />
    </StatisticsItemDiv>
  );
}
