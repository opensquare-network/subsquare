import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import getChainSettings from "next-common/utils/consts/settings";

export async function fetchSummary() {
  const { result, error } = await ssrNextApi.fetch("summary");
  if (error) {
    return {};
  }
  return result;
}

async function fetchAll() {
  const [{ result: tracks }, { result: fellowshipTracks }] = await Promise.all([
    ssrNextApi.fetch(gov2TracksApi),
    ssrNextApi.fetch(fellowshipTracksApi),
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
    const { result: tracks } = await ssrNextApi.fetch(gov2TracksApi);
    return { tracks: tracks ?? [], fellowshipTracks: [], summary };
  }

  if (hasFellowship) {
    const { result: fellowshipTracks } = await ssrNextApi.fetch(
      fellowshipTracksApi,
    );
    return { tracks: [], fellowshipTracks: fellowshipTracks ?? [], summary };
  }

  return { tracks: [], fellowshipTracks: [], summary };
}
