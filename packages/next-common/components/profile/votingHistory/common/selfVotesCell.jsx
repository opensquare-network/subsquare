import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { cn, toPrecision } from "next-common/utils";
import { getVoteType } from "next-common/utils/democracy/getVoteType";

function VoteValueDisplay({ votesValue, vote }) {
  const { symbol, decimals, voteSymbol } = useChainSettings();
  const [, voteTypeFlag] = getVoteType(vote);

  return (
    <div className={cn("flex items-center justify-end", "sm:relative")}>
      <ValueDisplay
        value={toPrecision(votesValue, decimals)}
        symbol={voteSymbol || symbol}
      />
      {!!voteTypeFlag && (
        <div className={cn("text-textTertiary", "sm:absolute sm:left-full")}>
          /{voteTypeFlag}
        </div>
      )}
    </div>
  );
}

function StandardVotes({ vote }) {
  return <VoteValueDisplay votesValue={vote.votes} vote={vote} />;
}

function SplitVotes({ vote }) {
  return (
    <div>
      <VoteValueDisplay votesValue={vote.ayeVotes} vote={vote} />
      <VoteValueDisplay votesValue={vote.nayVotes} vote={vote} />
    </div>
  );
}

function SplitAbstainVotes({ vote }) {
  return (
    <div>
      <VoteValueDisplay votesValue={vote.ayeVotes} vote={vote} />
      <VoteValueDisplay votesValue={vote.nayVotes} vote={vote} />
      <VoteValueDisplay votesValue={vote.abstainVotes} vote={vote} />
    </div>
  );
}

export default function SelfVotesCell({ vote }) {
  if (vote.isStandard || vote.isDelegating) {
    return <StandardVotes vote={vote} />;
  } else if (vote.isSplit) {
    return <SplitVotes vote={vote} />;
  } else if (vote.isSplitAbstain) {
    return <SplitAbstainVotes vote={vote} />;
  }

  return null;
}
