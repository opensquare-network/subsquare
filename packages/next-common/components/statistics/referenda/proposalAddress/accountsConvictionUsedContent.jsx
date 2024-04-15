import { StatisticsItemDiv } from "./style";
import VoteChart from "next-common/components/statistics/referenda/proposalAddress/voteChart";
import React from "react";
import AccountsRingChart from "./accountsRingChart";
import { useTheme } from "styled-components";
export default function AccountsConvictionUsedContent() {
  const theme = useTheme();
  const categoryPercentage = 0.2;
  const barPercentage = 1;
  const dataAccounts = {
    labels: ["0.1x", "1x", "2x", "3x", "4x", "5x"],
    datasets: [
      {
        label: "Aye",
        data: [100, 300, 200, 234, 344, 78],
        backgroundColor: theme.green300,
        // 设定bar宽度的关键参数
        categoryPercentage, // 用于控制条形图的宽度
        barPercentage, // 可以是0.1到1之间的任何值，代表条形宽度
      },
      {
        label: "Nay",
        data: [10, 80, 23, 67, 89, 34],
        backgroundColor: theme.red300,
        categoryPercentage, // 用于控制条形图的宽度
        barPercentage, // 可以是0.1到1之间的任何值，代表条形宽度
      },
      {
        label: "Abstain",
        data: [5, 8, 3, 5, 9, 5],
        backgroundColor: theme.neutral400,
        categoryPercentage, // 用于控制条形图的宽度
        barPercentage, // 可以是0.1到1之间的任何值，代表条形宽度
      },
    ],
  };
  return (
    <StatisticsItemDiv>
      <div className="flex gap-2 mb-4">
        <span className="text14Bold text-textPrimary">Accounts</span>
        <span className="text14Bold text-textTertiary">Conviction Used</span>
      </div>
      <div className="flex max-md:flex-col gap-6 overflow-x-auto overflow-y-hidden scrollbar-pretty">
        <VoteChart data={dataAccounts} className="h-[184px] grow" />
        <AccountsRingChart className="shrink-0" />
      </div>
    </StatisticsItemDiv>
  );
}
