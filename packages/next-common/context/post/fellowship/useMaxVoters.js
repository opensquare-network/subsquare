export function getTrackToRetainAtRank(rank) {
  if (rank >= 1 && rank <= 6) {
    return 11 + rank - 1;
  }

  throw new Error("Invalid rank to get track for retention");
}

export function getTrackToPromoteToRank(rank) {
  if (rank >= 1 && rank <= 6) {
    return 21 + rank - 1;
  }

  throw new Error("Invalid rank to get track for promotion");
}

export function getTrackToFastPromoteToRank(rank) {
  if (rank >= 1 && rank <= 3) {
    return 31 + rank - 1;
  }

  throw new Error("Invalid rank to get track for fast promotion");
}

export function getFellowshipMinRankOfClass(trackId) {
  if (trackId <= 9) {
    return trackId;
  } else if (trackId >= 11 && trackId <= 16) {
    return trackId - 8;
  } else if (trackId >= 21 && trackId <= 26) {
    return trackId - 18;
  } else if (trackId >= 31 && trackId <= 33) {
    return trackId - 28;
  } else {
    return Number.MAX_VALUE; // max rank
  }
}

export function getAmbassadorMinRankOfClass(trackId) {
  return trackId;
}

export function getMinRankOfClass(trackId, pallet) {
  if ("fellowshipCollective" === pallet) {
    return getFellowshipMinRankOfClass(trackId);
  } else if ("ambassadorCollective" === pallet) {
    return getAmbassadorMinRankOfClass(trackId);
  } else {
    throw new Error(`Can not get min rank of class for pallet ${pallet}`);
  }
}
