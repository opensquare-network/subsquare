import { isNil } from "lodash-es";

export function getMotionId(motion) {
  let id = isNil(motion.motionIndex) ? motion.index : motion.motionIndex;
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
