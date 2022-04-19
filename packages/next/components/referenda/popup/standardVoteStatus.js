import { VotingStatusContent, WarningMessage } from "next-common/components/popup/styled";
import DisplayValue from "next-common/components/displayValue";
import { toPrecision } from "utils";
import { convictionToLockX } from "utils/referendumUtil";
import { isAye, getConviction } from "utils/referendumUtil";
import PopupLabel from "next-common/components/popup/label";
import VoteStatusBox from "next-common/components/popup/voteStatusBox";

export default function StandardVoteStatus({ addressVoteStandard, node }) {
  const addressVoteStandardBalance = addressVoteStandard?.balance;
  const addressVoteStandardAye = isAye(addressVoteStandard?.vote);
  const addressVoteStandardConviction = getConviction(
    addressVoteStandard?.vote
  );

  return (
    <VotingStatusContent>
      <PopupLabel text={"Current voting"} status={"Standard"} />
      <VoteStatusBox aye={addressVoteStandardAye}>
        <DisplayValue
          value={toPrecision(addressVoteStandardBalance, node.decimals)}
          symbol={node?.voteSymbol || node?.symbol}
        />
        <span>{`(${convictionToLockX(addressVoteStandardConviction)})`}</span>
      </VoteStatusBox>
      <WarningMessage>
        Resubmitting the vote will override the current voting record
      </WarningMessage>
    </VotingStatusContent>
  );
}
