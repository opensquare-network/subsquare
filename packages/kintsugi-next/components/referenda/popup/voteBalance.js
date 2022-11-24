import BalanceField from "next-common/components/popup/fields/balanceField";
import { useChainSettings } from "next-common/context/chain";

export default function VoteBalance({
  isLoading,
  inputVoteBalance,
  setInputVoteBalance,
}) {
  const node = useChainSettings();
  return (
    <BalanceField
      isLoading={isLoading}
      inputBalance={inputVoteBalance}
      setInputBalance={setInputVoteBalance}
      symbol={node?.voteSymbol}
    />
  );
}
