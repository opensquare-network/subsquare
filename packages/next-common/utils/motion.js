export function getMotionId(motion) {
  return `${motion?.indexer?.blockHeight}_${motion?.hash}`;
}

export function shortMotionId(motion) {
  return motion.index ?? motion.hash.slice(0, 6);
}
