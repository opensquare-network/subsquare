import BalanceField from "next-common/components/popup/fields/balanceField";
import { useChainSettings } from "next-common/context/chain";

export default function VoteValue({
  isLoading,
  inputVoteBalance,
  setInputVoteBalance,
}) {
  const node = useChainSettings();
  return (
    <BalanceField
      title="Value"
      titleTooltip="The value is locked for the duration of the vote"
      isLoading={isLoading}
      inputBalance={inputVoteBalance}
      setInputBalance={setInputVoteBalance}
      symbol={node?.voteSymbol || node?.symbol}
    />
  );
}
