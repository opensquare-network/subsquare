import Chains from "./consts/chains";

export function getMotionId(motion, chain) {
  if ([Chains.kusama, Chains.polkadot].includes(chain)) {
    return motion.motionIndex;
  }

  return `${motion?.indexer?.blockHeight}_${motion?.hash}`;
}

export function shortMotionId(motion) {
  return motion.index ?? motion.hash.slice(0, 6);
}
