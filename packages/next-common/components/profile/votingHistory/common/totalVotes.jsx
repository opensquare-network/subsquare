import BigNumber from "bignumber.js";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

function VotesValueDisplay({ votesValue, showTooltip = true }) {
  const { symbol, decimals, voteSymbol } = useChainSettings();

  return (
    <ValueDisplay
      value={toPrecision(votesValue, decimals)}
      symbol={voteSymbol || symbol}
      showTooltip={showTooltip}
    />
  );
}

function StandardVotes({ vote }) {
  const { decimals, voteSymbol, symbol } = useChainSettings();

  const selfVotes = vote.votes || 0;
  const delegationsVotes = vote.delegations?.votes || 0;
  const totalVotes = BigNumber.sum(selfVotes, delegationsVotes);

  return (
    <Tooltip
      content={
        <div>
          Delegation Votes:{" "}
          <ValueDisplay
            className="text-inherit"
            value={toPrecision(delegationsVotes, decimals)}
            symbol={voteSymbol || symbol}
          />
        </div>
      }
    >
      <VotesValueDisplay showTooltip={false} votesValue={totalVotes} />
    </Tooltip>
  );
}

function SplitVotes({ vote }) {
  const totalVotes = BigNumber.sum(vote.ayeVotes, vote.nayVotes);
  return <VotesValueDisplay votesValue={totalVotes} />;
}

function SplitAbstainVotes({ vote }) {
  const totalVotes = BigNumber.sum(
    vote.ayeVotes,
    vote.nayVotes,
    vote.abstainVotes,
  );
  return <VotesValueDisplay votesValue={totalVotes} />;
}

export default function TotalVotesCell({ vote }) {
  if (vote?.isDelegating) {
    return <span className="text-textTertiary">-</span>;
  } else if (vote.isStandard) {
    return <StandardVotes vote={vote} />;
  } else if (vote.isSplit) {
    return <SplitVotes vote={vote} />;
  } else if (vote.isSplitAbstain) {
    return <SplitAbstainVotes vote={vote} />;
  }

  return null;
}
