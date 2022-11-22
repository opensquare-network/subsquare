import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";

export default function VoteValue({
  isLoading,
  inputVoteBalance,
  setInputVoteBalance,
  node,
  title = "Value",
  titleTooltip = "The value is locked for the duration of the vote",
}) {
  return (
    <div>
      <PopupLabel text={title} tooltip={titleTooltip} />
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
