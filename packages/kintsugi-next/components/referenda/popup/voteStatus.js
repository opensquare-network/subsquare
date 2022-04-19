import VoteStatusBox from "next-common/components/popup/voteStatusBox";
import { WarningMessage } from "next-common/components/popup/styled";
import ValueDisplay from "next-common/components/displayValue";
import { toPrecision } from "next-common/utils";

export default function VoteStatus({ addressVote, node }) {
  return (
    <>
      <VoteStatusBox aye={addressVote?.aye}>
        <ValueDisplay
          value={toPrecision(addressVote?.balance, node.decimals)}
          symbol={node?.voteSymbol}
        />
      </VoteStatusBox>
      <WarningMessage>
        Resubmitting the vote will override the current voting record
      </WarningMessage>
    </>
  );
}
