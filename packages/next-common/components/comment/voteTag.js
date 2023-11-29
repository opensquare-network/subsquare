import { useDetailType } from "next-common/context/page";
import {
  allDirectVotesSelector,
  allNestedVotesSelector,
} from "next-common/store/reducers/referenda/votes/selectors";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useSelector } from "react-redux";
import { useComment } from "./context";
import tw from "tailwind-styled-components";
import Tooltip from "../tooltip";
import { toPrecisionNumber } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { convictionToLockX } from "next-common/utils/referendumCommon";
import ValueDisplay from "../valueDisplay";

const TagWrapper = tw.span`py-[2px] px-[8px] rounded-[10px] text12Medium`;

function StandardVoteTooltipContent({ vote }) {
  const { decimals, symbol } = useChainSettings();
  const votes = toPrecisionNumber(vote.votes, decimals);
  const balance = toPrecisionNumber(vote.balance, decimals);
  const lockX = convictionToLockX(vote.conviction);
  const allNestedVotes = useSelector(allNestedVotesSelector);

  let delegation = null;
  if (allNestedVotes?.directVoterDelegations?.length > 0) {
    const nestedVotes = vote.aye
      ? allNestedVotes.allAye
      : allNestedVotes.allNay;
    const nestedVote = nestedVotes?.find(
      (item) => item.account === vote.account,
    );
    const delegationsCount = nestedVote?.directVoterDelegations?.length ?? 0;
    const totalDelegatedVotes = nestedVote?.totalDelegatedVotes ?? 0;
    const delegationVotes = toPrecisionNumber(totalDelegatedVotes, decimals);
    delegation = (
      <span>
        Delegations: <ValueDisplay value={delegationVotes} symbol={symbol} />(
        {delegationsCount})
      </span>
    );
  }

  return (
    <div className="flex flex-col text12Medium leading-[16px] text-textPrimaryContrast">
      <span className="text12Bold">Voted {vote.aye ? "Aye" : "Nay"}</span>
      <span>
        Votes: {<ValueDisplay value={votes} symbol={symbol} />}(
        {<ValueDisplay value={balance} symbol={symbol} />}*{lockX})
      </span>
      {delegation}
    </div>
  );
}

function SplitAbstainVoteTooltipContent({ votes }) {
  const { decimals, symbol } = useChainSettings();
  const abstainVote = votes.find((item) => item.isAbstain);
  const ayeVote = votes.find((item) => item.aye);
  const nayVote = votes.find((item) => item.aye === false);
  const aye = toPrecisionNumber(ayeVote?.votes ?? 0, decimals);
  const nay = toPrecisionNumber(nayVote?.votes ?? 0, decimals);
  const abstain = toPrecisionNumber(abstainVote?.votes ?? 0, decimals);

  return (
    <div className="flex flex-col text12Medium leading-[16px] text-textPrimaryContrast">
      <span className="text12Bold">Voted SplitAbstain</span>
      <span>Aye: {<ValueDisplay value={aye} symbol={symbol} />}</span>
      <span>Nay: {<ValueDisplay value={nay} symbol={symbol} />}</span>
      <span>Aye: {<ValueDisplay value={abstain} symbol={symbol} />}</span>
    </div>
  );
}

function SplitVoteTooltipContent({ votes }) {
  const { decimals, symbol } = useChainSettings();
  const ayeVote = votes.find((item) => item.aye);
  const nayVote = votes.find((item) => item.aye === false);
  const aye = toPrecisionNumber(ayeVote?.votes ?? 0, decimals);
  const nay = toPrecisionNumber(nayVote?.votes ?? 0, decimals);

  return (
    <div className="flex flex-col text12Medium leading-[16px] text-textPrimaryContrast">
      <span className="text12Bold">Voted Split</span>
      <span>Aye: {<ValueDisplay value={aye} symbol={symbol} />}</span>
      <span>Nay: {<ValueDisplay value={nay} symbol={symbol} />}</span>
    </div>
  );
}

function ReferendaVoteTag() {
  const comment = useComment();
  const allDirectVotes = useSelector(allDirectVotesSelector);

  const user = comment.author;
  const votes = (allDirectVotes || []).filter(
    (item) => item.account === user.address,
  );

  if (votes.length === 0) {
    return null;
  }

  if (votes[0].isStandard) {
    const vote = votes[0];
    if (vote.aye) {
      return (
        <Tooltip content={<StandardVoteTooltipContent vote={vote} />}>
          <TagWrapper className="bg-green100 text-green500">Aye</TagWrapper>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip content={<StandardVoteTooltipContent vote={vote} />}>
          <TagWrapper className="bg-red100 text-red500">Nay</TagWrapper>
        </Tooltip>
      );
    }
  } else if (votes[0].isSplit) {
    return (
      <Tooltip content={<SplitVoteTooltipContent votes={votes} />}>
        <TagWrapper className="bg-neutral300 text-textSecondary">
          Split
        </TagWrapper>
      </Tooltip>
    );
  } else if (votes[0].isSplitAbstain) {
    return (
      <Tooltip content={<SplitAbstainVoteTooltipContent votes={votes} />}>
        <TagWrapper className="bg-neutral300 text-textSecondary">
          SplitAbstain
        </TagWrapper>
      </Tooltip>
    );
  }

  return null;
}

export default function VoteTag() {
  const type = useDetailType();

  if (type === detailPageCategory.GOV2_REFERENDUM) {
    return <ReferendaVoteTag />;
  }

  return null;
}
