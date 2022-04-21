import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";

export default function VoteBalance({
  isLoading,
  inputVoteBalance,
  setInputVoteBalance,
  node,
}) {
  return (
    <div>
      <PopupLabel
        text="Value"
        tooltip="The value is locked for the duration of the vote"
      />
      <Input
        type="text"
        placeholder="0"
        disabled={isLoading}
        value={inputVoteBalance}
        onChange={(e) =>
          setInputVoteBalance(e.target.value.replace("。", "."))
        }
        symbol={node?.voteSymbol}
      />
    </div>
  )
}
