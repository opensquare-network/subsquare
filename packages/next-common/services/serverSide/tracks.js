import nextApi from "next-common/services/nextApi";
import {
  ambassadorTracksSummaryApi,
  fellowshipTracksSummaryApi,
  gov2TracksSummaryApi,
} from "next-common/services/url";
import getChainSettings from "next-common/utils/consts/settings";

export async function fetchOpenGovTracksProps() {
  const { result: summary = {} } = await nextApi.fetch("summary");

  const {
    modules: {
      referenda: hasReferenda,
      fellowship: hasFellowship,
      ambassador: hasAmbassador,
    },
  } = getChainSettings(process.env.CHAIN);
  const result = { summary };
  if (hasReferenda) {
    const { result: tracks } = await nextApi.fetch(gov2TracksSummaryApi);
    Object.assign(result, { tracks: tracks ?? [] });
  }
  if (hasFellowship) {
    const { result: fellowshipTracks } = await nextApi.fetch(
      fellowshipTracksSummaryApi,
    );
    Object.assign(result, { fellowshipTracks: fellowshipTracks ?? [] });
  }
  if (hasAmbassador) {
    const { result: ambassadorTracks } = await nextApi.fetch(
      ambassadorTracksSummaryApi,
    );
    Object.assign(result, { ambassadorTracks: ambassadorTracks ?? [] });
  }

  return result;
}
