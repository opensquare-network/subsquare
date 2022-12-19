import { VotingStatusContent } from "next-common/components/popup/styled";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { convictionToLockX, getConviction, isAye } from "utils/referendumUtil";
import PopupLabel from "next-common/components/popup/label";
import VoteStatusBox from "next-common/components/popup/voteStatusBox";
import { useChainSettings } from "next-common/context/chain";

export default function StandardVoteStatus({
  title = "Current voting",
  addressVoteStandard,
}) {
  const node = useChainSettings();
  const addressVoteStandardBalance = addressVoteStandard?.balance;
  const addressVoteStandardAye = isAye(addressVoteStandard?.vote);
  const addressVoteStandardConviction = getConviction(
    addressVoteStandard?.vote
  );

  return (
    <VotingStatusContent>
      <PopupLabel text={title} status={"Standard"} />
      <VoteStatusBox aye={addressVoteStandardAye}>
        <ValueDisplay
          value={toPrecision(addressVoteStandardBalance, node.decimals)}
          symbol={node?.voteSymbol || node?.symbol}
        />
        <span>{`(${convictionToLockX(addressVoteStandardConviction)})`}</span>
      </VoteStatusBox>
    </VotingStatusContent>
  );
}
