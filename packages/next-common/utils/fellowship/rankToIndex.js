const RANK_COUNT = 9;

export default function rankToIndex(rank) {
  if (rank <= RANK_COUNT && rank > 0) {
    return rank - 1;
  }

  return null;
}
