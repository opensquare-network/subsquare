import BalanceField from "next-common/components/popup/fields/balanceField";

export default function VoteValue({
  isLoading,
  inputVoteBalance,
  setInputVoteBalance,
  node,
}) {
  return (
    <BalanceField
      isLoading={isLoading}
      inputBalance={inputVoteBalance}
      setInputBalance={setInputVoteBalance}
      symbol={node?.voteSymbol || node?.symbol}
    />
  );
}
