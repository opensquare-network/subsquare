import isEmpty from "lodash.isempty";
import BigNumber from "bignumber.js";
import { usePageProps } from "next-common/context/page";
import { votesSelector } from "next-common/store/reducers/gov2ReferendumSlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function usePercentageBarData() {
  const { voteStats } = usePageProps();
  const { allVotes = [] } = useSelector(votesSelector);

  let {
    directCapital,
    delegatedCapital,
    directVotes,
    delegatedVotes,
    directCapitalPercentage = 0,
    delegatedCapitalPercentage = 0,
    directVotesPercentage = 0,
    delegatedVotesPercentage = 0,
  } = useMemo(() => {
    let directCapital = new BigNumber(0);
    let delegatedCapital = new BigNumber(0);
    let directVotes = new BigNumber(0);
    let delegatedVotes = new BigNumber(0);
    let directCapitalPercentage = 0;
    let delegatedCapitalPercentage = 0;
    let directVotesPercentage = 0;
    let delegatedVotesPercentage = 0;

    for (const vote of allVotes) {
      directCapital = directCapital.plus(vote.balance);
      delegatedCapital = delegatedCapital.plus(vote.totalDelegatedCapital);
      directVotes = directVotes.plus(vote.votes);
      delegatedVotes = delegatedVotes.plus(vote.totalDelegatedVotes);
    }

    const totalCapital = directCapital.plus(delegatedCapital);
    const totalVotes = directVotes.plus(delegatedVotes);

    directCapitalPercentage = totalCapital.isZero()
      ? 0
      : directCapital.div(totalCapital).times(100).toNumber();

    delegatedCapitalPercentage = totalCapital.isZero()
      ? 0
      : delegatedCapital.div(totalCapital).times(100).toNumber();

    directVotesPercentage = totalVotes.isZero()
      ? 0
      : directVotes.div(totalVotes).times(100).toNumber();

    delegatedVotesPercentage = totalVotes.isZero()
      ? 0
      : delegatedVotes.div(totalVotes).times(100).toNumber();

    return {
      directCapital,
      delegatedCapital,
      directVotes,
      delegatedVotes,
      directCapitalPercentage,
      delegatedCapitalPercentage,
      directVotesPercentage,
      delegatedVotesPercentage,
    };
  }, [allVotes]);

  if (!isEmpty(voteStats)) {
    directCapital = new BigNumber(voteStats.directCapital);
    delegatedCapital = new BigNumber(voteStats.delegationCapital);
    directVotes = new BigNumber(voteStats.votes).minus(
      voteStats.delegationVotes,
    );
    delegatedVotes = new BigNumber(voteStats.delegationVotes);

    const totalCapital = directCapital.plus(delegatedCapital);
    const totalVotes = directVotes.plus(delegatedVotes);

    directCapitalPercentage = totalCapital.isZero()
      ? 0
      : directCapital.div(totalCapital).times(100).toNumber();

    delegatedCapitalPercentage = totalCapital.isZero()
      ? 0
      : delegatedCapital.div(totalCapital).times(100).toNumber();

    directVotesPercentage = totalVotes.isZero()
      ? 0
      : directVotes.div(totalVotes).times(100).toNumber();

    delegatedVotesPercentage = totalVotes.isZero()
      ? 0
      : delegatedVotes.div(totalVotes).times(100).toNumber();
  }

  if (directCapitalPercentage === 0 && delegatedCapitalPercentage === 0) {
    directCapitalPercentage = 50;
    delegatedCapitalPercentage = 50;
  }

  if (directVotesPercentage === 0 && delegatedVotesPercentage === 0) {
    directVotesPercentage = 50;
    delegatedVotesPercentage = 50;
  }

  return {
    directCapital,
    delegatedCapital,
    directVotes,
    delegatedVotes,
    directCapitalPercentage,
    delegatedCapitalPercentage,
    directVotesPercentage,
    delegatedVotesPercentage,
  };
}
