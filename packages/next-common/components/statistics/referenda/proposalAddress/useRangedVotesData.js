import Chains from "next-common/utils/consts/chains";
import BigNumber from "bignumber.js";
import { inRange, set, sum } from "lodash-es";
import { useChain, useChainSettings } from "next-common/context/chain";
import { abbreviateBigNumber, toPrecision } from "next-common/utils";
import {
  allAbstainSelector,
  allAyeSelector,
  allNaySelector,
} from "next-common/store/reducers/referenda/votes/selectors";
import { useSelector } from "react-redux";

const VOTES_RANGE = {
  [Chains.polkadot]: [
    [0, 10000],
    [10001, 500000],
    [500001, 1000000],
    [1000001, 5000000],
    [5000001],
  ],
};

function distribute(votesValues = [], range = []) {
  const res = Array.from({ length: range.length }).fill([0]);

  for (let i = 0; i < votesValues.length; i++) {
    const votesValue = votesValues[i];

    for (let j = 0; j < range.length; j++) {
      const [start, end = Infinity] = range[j];
      if (inRange(votesValue, start, end)) {
        set(res, j, [...res[j], votesValue]);

        break;
      }
    }
  }

  return res.map(sum);
}

function toVotesValues(votes = [], decimals) {
  return votes.map((vote) =>
    BigNumber(toPrecision(vote.votes || 0, decimals)).toNumber(),
  );
}

function toRangedLabels(range = []) {
  const labels = range.map(([start, end]) => {
    if (!end || end === Infinity) {
      return `>${abbreviateBigNumber(start)}`;
    }

    return `${abbreviateBigNumber(start)}-${abbreviateBigNumber(end)}`;
  });

  return labels;
}

export function useRangedVotesData() {
  const chain = useChain();
  const { decimals } = useChainSettings();
  const allAyeVotes = useSelector(allAyeSelector);
  const allNayVotes = useSelector(allNaySelector);
  const allAbstainVotes = useSelector(allAbstainSelector);
  const range = VOTES_RANGE[chain];

  return {
    range,
    rangedLabels: toRangedLabels(range),

    ayes: distribute(toVotesValues(allAyeVotes, decimals), range),
    nays: distribute(toVotesValues(allNayVotes, decimals), range),
    abstains: distribute(toVotesValues(allAbstainVotes, decimals), range),
  };
}
