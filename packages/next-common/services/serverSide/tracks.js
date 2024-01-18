import { ssrNextApi } from "next-common/services/nextApi";
import {
  fellowshipTracksSummaryApi,
  gov2TracksSummaryApi,
} from "next-common/services/url";
import getChainSettings from "next-common/utils/consts/settings";

export async function fetchSummary() {
  const { result } = await ssrNextApi.fetch("summary");
  return result || {};
}

async function fetchAll() {
  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    ssrNextApi.fetch(gov2TracksSummaryApi),
    ssrNextApi.fetch(fellowshipTracksSummaryApi),
  ]);

  return {
    tracks: tracks ?? [],
    fellowshipTracks: fellowshipTracks ?? [],
  };
}

export async function fetchOpenGovTracksProps() {
  const summary = await fetchSummary();

  const { hasReferenda, hasFellowship } = getChainSettings(process.env.CHAIN);
  if (hasReferenda && hasFellowship) {
    const result = await fetchAll();
    return { ...result, summary };
  }

  if (hasReferenda) {
    const { result: tracks } = await ssrNextApi.fetch(gov2TracksSummaryApi);
    return { tracks: tracks ?? [], fellowshipTracks: [], summary };
  }

  if (hasFellowship) {
    const { result: fellowshipTracks } = await ssrNextApi.fetch(
      fellowshipTracksSummaryApi,
    );
    return { tracks: [], fellowshipTracks: fellowshipTracks ?? [], summary };
  }

  return { tracks: [], fellowshipTracks: [], summary };
}
