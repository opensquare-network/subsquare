import { isSameAddress, toPrecisionNumber } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { convictionToLockX } from "next-common/utils/referendumCommon";
import BigNumber from "bignumber.js";

function getDelegated(address, nestedVotes) {
  const allVotes = [...nestedVotes.allAye, ...nestedVotes.allNay];
  const nestedVote = allVotes.find((item) =>
    isSameAddress(item.account, address),
  );

  const delegationsCount = nestedVote?.directVoterDelegations?.length ?? 0;
  if (delegationsCount === 0) {
    return {
      count: 0,
      delegations: 0,
    };
  }

  return {
    count: delegationsCount,
    delegations: nestedVote?.totalDelegatedVotes ?? 0,
  };
}

export default function StandardVoteTooltipContent({ vote, nestedVotes }) {
  const { decimals, symbol } = useChainSettings();
  const lockX = convictionToLockX(vote.conviction);
  const { count: delegationsCount, delegations } = getDelegated(
    vote.account,
    nestedVotes,
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
        {vote.isDelegating && "/d"})
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
