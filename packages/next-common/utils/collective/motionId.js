export default function getMotionId(motion) {
  if (motion.index !== null && motion.index !== undefined) {
    return motion.index;
  }

  return `${motion?.indexer?.blockHeight}_${motion.hash}`;
}
