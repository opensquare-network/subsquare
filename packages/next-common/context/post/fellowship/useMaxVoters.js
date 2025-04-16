export function getTrackToRetainRank(rank) {
  return 11 + rank;
}

export function getTrackToPromoteRank(rank) {
  return 21 + rank;
}

export function getTrackToFastPromoteRank(rank) {
  return 31 + rank;
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
