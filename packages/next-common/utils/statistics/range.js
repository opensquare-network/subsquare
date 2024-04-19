import { abbreviateBigNumber } from "..";
import Chains from "../consts/chains";

export const VOTES_RANGE = {
  [Chains.polkadot]: [
    [0, 10000],
    [10001, 500000],
    [500001, 1000000],
    [1000001, 5000000],
    [5000001],
  ],
  [Chains.kusama]: [
    [0, 5000],
    [5001, 10000],
    [10001, 100000],
    [50001, 1000000],
    [1000001],
  ],
};

export function toRangeLabels(range = []) {
  const labels = range.map(([start, end]) => {
    if (!end || end === Infinity) {
      return `>${abbreviateBigNumber(start)}`;
    }

    return `${abbreviateBigNumber(start)}-${abbreviateBigNumber(end)}`;
  });

  return labels;
}
