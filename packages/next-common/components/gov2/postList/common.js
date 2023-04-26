import isNil from "lodash.isnil";

export default function getRemaining(latestHeight, startHeight, period) {
  if (isNil(latestHeight)) {
    return 0;
  }

  const gone = latestHeight - startHeight;
  return gone > period ? 0 : period - gone;
}
