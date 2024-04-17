import { isEmpty } from "lodash-es";
import BigNumber from "bignumber.js";
import { usePageProps } from "next-common/context/page";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";

function calcPercentage(numerator, denominator) {
  return denominator.isZero()
    ? 0
    : numerator.div(denominator).times(100).toNumber();
}

export default function useTallyPercentageBarData() {
  const { voteStats } = usePageProps();
  const allVotes = useSelector(allVotesSelector);

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
    for (const vote of allVotes || []) {
      if (!vote.isDelegating) {
        directCapital = directCapital.plus(vote.balance);
        directVotes = directVotes.plus(vote.votes);
      } else {
        delegatedCapital = delegatedCapital.plus(vote.balance);
        delegatedVotes = delegatedVotes.plus(vote.votes);
      }
    }

    const totalCapital = directCapital.plus(delegatedCapital);
    const totalVotes = directVotes.plus(delegatedVotes);
    return {
      directCapital,
      delegatedCapital,
      directVotes,
      delegatedVotes,
      directCapitalPercentage: calcPercentage(directCapital, totalCapital),
      delegatedCapitalPercentage: calcPercentage(
        delegatedCapital,
        totalCapital,
      ),
      directVotesPercentage: calcPercentage(directVotes, totalVotes),
      delegatedVotesPercentage: calcPercentage(delegatedVotes, totalVotes),
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

    directCapitalPercentage = calcPercentage(directCapital, totalCapital);
    delegatedCapitalPercentage = calcPercentage(delegatedCapital, totalCapital);
    directVotesPercentage = calcPercentage(directVotes, totalVotes);
    delegatedVotesPercentage = calcPercentage(delegatedVotes, totalVotes);
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
