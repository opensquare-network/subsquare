import { VotingStatusContent, WarningMessage } from "next-common/components/popup/styled";
import DisplayValue from "next-common/components/displayValue";
import { toPrecision } from "utils";
import PopupLabel from "next-common/components/popup/label";
import VoteStatusBox from "next-common/components/popup/voteStatusBox";

export default function SplitVoteStatus({ addressVoteSplit, node }) {
  const addressVoteSplitAye = addressVoteSplit?.aye;
  const addressVoteSplitNay = addressVoteSplit?.nay;

  return (
    <VotingStatusContent>
      <PopupLabel
        text={"Current voting"}
        status={"Split"}
        tooltip={"Vote for both aye and nay"}
      />
      <VoteStatusBox aye={true}>
        <DisplayValue
          value={toPrecision(addressVoteSplitAye, node.decimals)}
          symbol={node?.voteSymbol || node?.symbol}
        />
      </VoteStatusBox>
      <VoteStatusBox aye={false}>
        <DisplayValue
          value={toPrecision(addressVoteSplitNay, node.decimals)}
          symbol={node?.voteSymbol || node?.symbol}
        />
      </VoteStatusBox>
      <WarningMessage>
        Resubmitting the vote will override the current voting record
      </WarningMessage>
    </VotingStatusContent>
  );
}
