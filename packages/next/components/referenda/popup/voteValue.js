import { TooltipWrapper, Label } from "./styled";
import Input from "next-common/components/input";
import Tooltip from "next-common/components/tooltip";

export default function VoteValue({ isLoading, inputVoteBalance, setInputVoteBalance, node }) {
  return (
    <div>
      <TooltipWrapper>
        <Label>Value</Label>
        <Tooltip content="The value is locked for the duration of the vote" />
      </TooltipWrapper>
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
  );
}
