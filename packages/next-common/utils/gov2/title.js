import { parseGov2TrackName } from ".";

export function getGov2ReferendumTitle(detail) {
  const title = detail?.title?.trim();
  if (title) {
    return title;
  }

  const trackName = detail?.onchainData?.trackInfo?.name;
  const parsedTrackName = parseGov2TrackName(trackName);
  return `[${parsedTrackName}] Referendum #${detail?.referendumIndex}`;
}

export function getGov2TreasuryProposalTitle(detail) {
  const title = detail?.title?.trim();
  if (title) {
    return title;
  }

  const trackName = detail?.onchainData?.track?.name;
  const parsedTrackName = parseGov2TrackName(trackName);
  return `[${parsedTrackName}] Referendum #${detail?.onchainData?.gov2Referendum}`;
}
