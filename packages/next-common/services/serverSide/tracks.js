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
    } = {},
  } = getChainSettings(process.env.CHAIN);
  let tracks = [];
  let fellowshipTracks = [];
  let ambassadorTracks = [];
  if (hasReferenda) {
    const { result: referendaTracks } = await nextApi.fetch(
      gov2TracksSummaryApi,
    );
    tracks = referendaTracks;
  }
  if (hasFellowship) {
    const { result: fellowshipTracksResult } = await nextApi.fetch(
      fellowshipTracksSummaryApi,
    );
    fellowshipTracks = fellowshipTracksResult;
  }
  if (hasAmbassador) {
    const { result: ambassadorTracksResult } = await nextApi.fetch(
      ambassadorTracksSummaryApi,
    );
    ambassadorTracks = ambassadorTracksResult;
  }

  return {
    summary,
    tracks: tracks || null,
    fellowshipTracks,
    ambassadorTracks,
  };
}
