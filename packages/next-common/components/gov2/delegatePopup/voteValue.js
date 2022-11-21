import Input from "next-common/components/input";
import Label from "next-common/components/popup/label";

export default function VoteValue({
  isLoading,
  inputVoteBalance,
  setInputVoteBalance,
  node,
}) {
  return (
    <div>
      <Label text={"Balance"} />
      <Input
        type="text"
        placeholder="0"
        disabled={isLoading}
        value={inputVoteBalance}
        onChange={(e) => setInputVoteBalance(e.target.value.replace("。", "."))}
        symbol={node?.voteSymbol}
      />
    </div>
  );
}
