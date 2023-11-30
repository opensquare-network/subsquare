import { toPrecisionNumber } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { convictionToLockX } from "next-common/utils/referendumCommon";
import useDelegated from "next-common/components/comment/voteTag/referendaVoteTag/useDelegated";
import BigNumber from "bignumber.js";

export default function StandardVoteTooltipContent({ vote, allNestedVotes }) {
  const { decimals, symbol } = useChainSettings();
  const lockX = convictionToLockX(vote.conviction);
  const isDelegating = vote.isDelegating;
  const { count: delegationsCount, delegations } = useDelegated(
    vote.account,
    allNestedVotes,
  );
  const totalVotes = new BigNumber(vote.votes).plus(delegations).toString();

  return (
    <div className="flex flex-col text12Medium leading-[16px] text-textPrimaryContrast">
      {delegationsCount > 0 && (
        <span>
          Total:{" "}
          <ValueDisplay
            value={toPrecisionNumber(totalVotes, decimals)}
            symbol={symbol}
          />
        </span>
      )}
      <span>
        {delegationsCount > 0 ? "Self" : "Votes"}:&nbsp;
        <ValueDisplay
          value={toPrecisionNumber(vote.votes, decimals)}
          symbol={symbol}
        />
        (
        <ValueDisplay
          value={toPrecisionNumber(vote.balance, decimals)}
          symbol={symbol}
        />
        *{lockX}
        {isDelegating && "/d"})
      </span>
      {delegationsCount > 0 && (
        <span>
          Delegations:{" "}
          <ValueDisplay
            value={toPrecisionNumber(delegations, decimals)}
            symbol={symbol}
          />
          ({delegationsCount})
        </span>
      )}
    </div>
  );
}
