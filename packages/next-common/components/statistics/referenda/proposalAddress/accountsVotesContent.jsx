import { StatisticsItemDiv } from "./style";
import AccountsVotesChart from "./accountsVotesChart";
import { useTheme } from "styled-components";
import { useChain } from "next-common/context/chain";
import { toRangeLabels, VOTES_RANGE } from "next-common/utils/statistics/range";
import { useVotesCount } from "next-common/hooks/referenda/useVotesCount";

export default function AccountsVotesContent() {
  const theme = useTheme();
  const { ayes, nays, abstains } = useVotesCount();
  const chain = useChain();
  const range = VOTES_RANGE[chain];
  if (!range) {
    return null;
  }

  const labels = toRangeLabels(range);

  const categoryPercentage = 1;
  const barPercentage = 0.1;
  const dataVotes = {
    labels,
    datasets: [
      {
        label: "Aye",
        data: ayes,
        backgroundColor: theme.green300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Nay",
        data: nays,
        backgroundColor: theme.red300,
        categoryPercentage,
        barPercentage,
      },
      {
        label: "Abstain",
        data: abstains,
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
      </div>
      <AccountsVotesChart data={dataVotes} />
    </StatisticsItemDiv>
  );
}
