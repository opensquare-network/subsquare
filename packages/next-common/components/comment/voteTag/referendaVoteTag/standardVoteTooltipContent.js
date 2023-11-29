import { toPrecisionNumber } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "../valueDisplay";
import { convictionToLockX } from "next-common/utils/referendumCommon";
import { useSelector } from "react-redux";
import { allNestedVotesSelector } from "../../../../store/reducers/referenda/votes/selectors";

function VoteDelegation({ vote }) {
  const { decimals, symbol } = useChainSettings();
  const allNestedVotes = useSelector(allNestedVotesSelector);

  const nestedVotes = vote.aye ? allNestedVotes.allAye : allNestedVotes.allNay;
  const nestedVote = nestedVotes?.find((item) => item.account === vote.account);

  const delegationsCount = nestedVote?.directVoterDelegations?.length ?? 0;
  if (delegationsCount === 0) {
    return null;
  }

  const totalDelegatedVotes = nestedVote?.totalDelegatedVotes ?? 0;
  const delegationVotes = toPrecisionNumber(totalDelegatedVotes, decimals);
  return (
    <span>
      Delegations: <ValueDisplay value={delegationVotes} symbol={symbol} />(
      {delegationsCount})
    </span>
  );
}

export default function StandardVoteTooltipContent({ vote }) {
  const { decimals, symbol } = useChainSettings();
  const votes = toPrecisionNumber(vote.votes, decimals);
  const balance = toPrecisionNumber(vote.balance, decimals);
  const lockX = convictionToLockX(vote.conviction);

  return (
    <div className="flex flex-col text12Medium leading-[16px] text-textPrimaryContrast">
      <span className="text12Bold">Voted {vote.aye ? "Aye" : "Nay"}</span>
      <span>
        Votes: {<ValueDisplay value={votes} symbol={symbol} />}(
        {<ValueDisplay value={balance} symbol={symbol} />}*{lockX})
      </span>
      <VoteDelegation vote={vote} />
    </div>
  );
}
