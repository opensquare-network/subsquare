import BigNumber from "bignumber.js";
import { inRange, map, set } from "lodash-es";
import { useChain, useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import {
  allAbstainSelector,
  allAyeSelector,
  allNaySelector,
} from "next-common/store/reducers/referenda/votes/selectors";
import { useSelector } from "react-redux";
import { VOTES_RANGE } from "next-common/utils/statistics/range";

function distribute(votesValues = [], range = []) {
  const res = Array.from({ length: range.length }).fill([]);

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

  return res;
}

function toVoteValues(votes = [], decimals) {
  return votes.map((vote) =>
    BigNumber(toPrecision(vote.votes || 0, decimals)).toNumber(),
  );
}

function toLengths(votes) {
  return map(votes, "length");
}

export function useVotesCount() {
  const chain = useChain();
  const { decimals } = useChainSettings();
  const allAyeVotes = useSelector(allAyeSelector);
  const allNayVotes = useSelector(allNaySelector);
  const allAbstainVotes = useSelector(allAbstainSelector);
  const range = VOTES_RANGE[chain];

  const ayesVoteValues = distribute(toVoteValues(allAyeVotes, decimals), range);
  const naysVoteValues = distribute(toVoteValues(allNayVotes, decimals), range);
  const abstainsVoteValues = distribute(
    toVoteValues(allAbstainVotes, decimals),
    range,
  );

  return {
    range,

    ayes: toLengths(ayesVoteValues),
    nays: toLengths(naysVoteValues),
    abstains: toLengths(abstainsVoteValues),
  };
}
