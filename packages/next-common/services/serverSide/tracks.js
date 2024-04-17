import nextApi from "next-common/services/nextApi";
import {
  fellowshipTracksSummaryApi,
  gov2TracksSummaryApi,
} from "next-common/services/url";
import getChainSettings from "next-common/utils/consts/settings";

export async function fetchSummary() {
  const { result } = await nextApi.fetch("summary");
  return result || {};
}

async function fetchAll() {
  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    nextApi.fetch(gov2TracksSummaryApi),
    nextApi.fetch(fellowshipTracksSummaryApi),
  ]);

  return {
    tracks: tracks ?? [],
    fellowshipTracks: fellowshipTracks ?? [],
  };
}

export async function fetchOpenGovTracksProps() {
  const summary = await fetchSummary();

  const {
    modules: { referenda: hasReferenda },
    hasFellowship,
  } = getChainSettings(process.env.CHAIN);
  if (hasReferenda && hasFellowship) {
    const result = await fetchAll();
    return { ...result, summary };
  }

  if (hasReferenda) {
    const { result: tracks } = await nextApi.fetch(gov2TracksSummaryApi);
    return { tracks: tracks ?? [], fellowshipTracks: [], summary };
  }

  if (hasFellowship) {
    const { result: fellowshipTracks } = await nextApi.fetch(
      fellowshipTracksSummaryApi,
    );
    return { tracks: [], fellowshipTracks: fellowshipTracks ?? [], summary };
  }

  return { tracks: [], fellowshipTracks: [], summary };
}
