import { startCase } from "lodash-es";

export default function getTreasuryProposalTitle(item) {
  let title = item.title?.trim();
  if (title) {
    return title;
  }

  const trackName = item?.onchainData?.track?.name;
  if (trackName) {
    const parsedTrackName = startCase(trackName);
    return `[${parsedTrackName}] Referendum #${item?.onchainData?.gov2Referendum}`;
  }

  return `Untitled - treasury proposal #${item?.proposalIndex}`;
}
