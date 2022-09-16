import Chains from "./consts/chains";
import isNil from "lodash.isnil";

export function getMotionId(motion, chain) {
  let id;
  if ([Chains.kusama, Chains.polkadot].includes(chain)) {
    id = motion.motionIndex === undefined ? motion.index : motion.motionIndex;
  }

  if (isNil(id)) {
    id = `${motion?.indexer?.blockHeight}_${motion?.hash}`;
  }

  return id;
}

export function getUniqueMotionId(motion) {
  return `${motion?.indexer?.blockHeight}_${motion?.hash}`;
}

export function shortMotionId(motion) {
  return motion.index ?? motion.hash.slice(0, 6);
}
