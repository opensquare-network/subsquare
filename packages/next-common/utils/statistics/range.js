import { abbreviateBigNumber } from "..";
import Chains from "../consts/chains";

const k10 = 10000;
const k100 = 10 * k10;
const k500 = 5 * k100;
const m1 = 10 * k100;
const m5 = 5 * m1;
const m10 = 10 * m1;
const m100 = 10 * m10;

function generateSlots(joints = []) {
  return joints.reduce((result, joint, idx) => {
    if (idx <= 0) {
      return [[0, joint]];
    } else if (idx === joints.length - 1) {
      return [...result, [joints[idx - 1] + 1, joints[idx]], [joint + 1]];
    } else {
      return [...result, [joints[idx - 1] + 1, joints[idx]]];
    }
  }, []);
}

const kusamaSlots = generateSlots([100, 500, 1000, 5000, k10, k100]);

export const VOTES_RANGE = {
  [Chains.polkadot]: generateSlots([k10, k500, m1, m5]),
  [Chains.kusama]: kusamaSlots,
  [Chains.darwinia2]: generateSlots([5 * k10, k100, m1, m10]),
  [Chains.vara]: generateSlots([k100, m1, m10, m100]),
  // [Chains.moonriver]: kusamaSlots,
  [Chains.bifrost]: kusamaSlots,
  [Chains.bifrostPolkadot]: kusamaSlots,
  [Chains.rococo]: kusamaSlots,
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
