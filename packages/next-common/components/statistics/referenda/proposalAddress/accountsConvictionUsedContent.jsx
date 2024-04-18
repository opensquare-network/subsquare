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

const convictions = Object.values(ConvictionSupport);

function resolveChartDatasetData(votes = []) {
  const groupedConviction = groupBy(votes, "conviction");
  return convictions.map((_, idx) => groupedConviction[idx]?.length || 0);
}

export default function AccountsConvictionUsedContent() {
  const allAyeVotes = useSelector(allAyeSelector);
  const allNayVotes = useSelector(allNaySelector);
  const allAbstainVotes = useSelector(allAbstainSelector);

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
        // 设定bar宽度的关键参数
        categoryPercentage, // 用于控制条形图的宽度
        barPercentage, // 可以是0.1到1之间的任何值，代表条形宽度
      },
      {
        label: "Nay",
        data: resolveChartDatasetData(allNayVotes),
        backgroundColor: theme.red300,
        categoryPercentage, // 用于控制条形图的宽度
        barPercentage, // 可以是0.1到1之间的任何值，代表条形宽度
      },
      {
        label: "Abstain",
        data: resolveChartDatasetData(allAbstainVotes),
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
        <span className="text14Medium text-textTertiary">Conviction Used</span>
      </div>
      <div className="flex max-md:flex-col gap-6 overflow-x-auto overflow-y-hidden scrollbar-pretty">
        <VoteChart data={dataAccounts} className="h-[184px] grow" />
        <AccountsRingChart className="shrink-0" />
      </div>
    </StatisticsItemDiv>
  );
}
