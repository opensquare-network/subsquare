import { parseGov2TrackName } from "../../gov2";

export default function getTreasuryProposalTitle(item) {
  let title = item.title?.trim();
  if (title) {
    return title;
  }

  const trackName = item?.onchainData?.track?.name;
  if (trackName) {
    const parsedTrackName = parseGov2TrackName(trackName);
    return `[${parsedTrackName}] Referendum #${item?.onchainData?.gov2Referendum}`;
  }

  return "--";
}
