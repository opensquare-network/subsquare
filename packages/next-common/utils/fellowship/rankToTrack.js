const PROMOTE_RANK_TRACKS = {
  1: 21,
  2: 22,
  3: 23,
  4: 24,
  5: 25,
  6: 26,
};

const RETAIN_RANK_TRACKS = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  5: 15,
  6: 16,
};

export function rankToPromoteTrack(rank) {
  return PROMOTE_RANK_TRACKS[rank];
}

export function rankToRetainTrack(rank) {
  return RETAIN_RANK_TRACKS[rank];
}
