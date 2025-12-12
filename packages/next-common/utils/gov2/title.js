import { startCase } from "lodash-es";

export function getGov2ReferendumTitle(detail) {
  const title = detail?.title?.trim();
  if (title) {
    return title;
  }

  const trackName = detail?.onchainData?.trackInfo?.name;
  const parsedTrackName = startCase(trackName);
  return `[${parsedTrackName}] Referendum #${detail?.referendumIndex}`;
}
