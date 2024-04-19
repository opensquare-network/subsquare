import { StatisticsItemDiv } from "./style";
import AccountsVotesChart from "./accountsVotesChart";
import { useTheme } from "styled-components";
import { useRangedVotesData } from "./useRangedVotesData";
import { useChainSettings } from "next-common/context/chain";

export default function AccountsVotesContent() {
  const theme = useTheme();
  const { voteSymbol, symbol } = useChainSettings();
  const { rangedLabels, ayes, nays, abstains } = useRangedVotesData();

  const categoryPercentage = 1;
  const barPercentage = 0.1;
  const dataVotes = {
    labels: rangedLabels,
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
      <AccountsVotesChart data={dataVotes} symbol={voteSymbol || symbol} />
    </StatisticsItemDiv>
  );
}
