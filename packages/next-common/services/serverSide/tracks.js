import { ssrNextApi } from "next-common/services/nextApi";
import { fellowshipTracksApi, gov2TracksApi } from "next-common/services/url";
import getChainSettings from "next-common/utils/consts/settings";

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
  const { hasReferenda, hasFellowship } = getChainSettings(process.env.CHAIN);
  if (hasReferenda && hasFellowship) {
    return await fetchAll();
  }

  if (hasReferenda) {
    const { result: tracks } = await ssrNextApi.fetch(gov2TracksApi);
    return { tracks: tracks ?? [], fellowshipTracks: [] };
  }
  if (hasFellowship) {
    const { result: fellowshipTracks } = await ssrNextApi.fetch(
      fellowshipTracksApi,
    );
    return { tracks: [], fellowshipTracks: fellowshipTracks ?? [] };
  }

  return { tracks: [], fellowshipTracks: [] };
}
