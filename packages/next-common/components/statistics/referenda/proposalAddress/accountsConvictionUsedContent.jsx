import { StatisticsItemDiv } from "./style";
import VoteChart from "next-common/components/statistics/referenda/proposalAddress/voteChart";
import AccountsRingChart from "./accountsRingChart";
import { useTheme } from "styled-components";
import { useSelector } from "react-redux";
import {
  allAbstainSelector,
  allAyeSelector,
  allNaySelector,
} from "next-common/store/reducers/referenda/votes/selectors";
import { groupBy } from "lodash-es";
import { ConvictionSupport } from "next-common/utils/referendumCommon";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { useWindowSize } from "react-use";
import { useEffect, useState } from "react";

const convictions = Object.values(ConvictionSupport);

function resolveChartDatasetData(votes = []) {
  const groupedConviction = groupBy(votes, "conviction");
  return convictions.map((_, idx) => groupedConviction[idx]?.length || 0);
}

export default function AccountsConvictionUsedContent() {
  const allAyeVotes = useSelector(allAyeSelector);
  const allNayVotes = useSelector(allNaySelector);
  const allAbstainVotes = useSelector(allAbstainSelector);
  const [navCollapsed] = useNavCollapsed();
  const { width } = useWindowSize();
  const [barChartKey, setBarChartKey] = useState(0);

  useEffect(() => {
    setBarChartKey((k) => k + 1);
  }, [width, navCollapsed]);

  const theme = useTheme();
  const categoryPercentage = 0.2;
  const barPercentage = 1;
  const dataAccounts = {
    labels: convictions.map((c) => `${c}x`),
    datasets: [
      {
        label: "Aye",
        data: resolveChartDatasetData(allAyeVotes),
        backgroundColor: theme.green300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Nay",
        data: resolveChartDatasetData(allNayVotes),
        backgroundColor: theme.red300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Abstain",
        data: resolveChartDatasetData(allAbstainVotes),
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
        <span className="text14Medium text-textTertiary">Conviction Used</span>
      </div>
      <div
        className={cn(
          "flex flex-col gap-6",
          "overflow-x-auto overflow-y-hidden",
          "scrollbar-pretty",
          "[&>*]:w-full",
          navCollapsed
            ? "max-lg:flex-col min-[1281px]:flex-row"
            : "min-[1482px]:flex-row",
        )}
      >
        <VoteChart
          key={barChartKey}
          data={dataAccounts}
          className="h-[184px]"
        />
        <AccountsRingChart />
      </div>
    </StatisticsItemDiv>
  );
}
