import { useContextApi } from "next-common/context/api";
import { useReferendaPallet } from "next-common/context/referenda/pallet";
import { useMemo } from "react";
import { normalizeTrackInfo } from "next-common/utils/gov2/trackInfo";

/**
 * Read a single track info from chain constants.
 * @param {number|string|undefined} trackId
 * @returns {object|null} normalized track info, or null when not available yet / not found
 */
export default function useOnChainTrackInfo(trackId) {
  const api = useContextApi();
  const pallet = useReferendaPallet();

  return useMemo(() => {
    if (!api || !api.consts?.[pallet]?.tracks) {
      return null;
    }

    const targetId = Number(trackId);
    if (!Number.isInteger(targetId)) {
      return null;
    }

    const tracks = api.consts[pallet].tracks || [];
    for (const track of tracks) {
      let id, detail;
      if (Array.isArray(track)) {
        [id, detail] = track;
      } else if (track.id && track.info) {
        id = track.id;
        detail = track.info;
      } else {
        continue;
      }

      if (id.toNumber() === targetId) {
        return {
          id: targetId,
          ...normalizeTrackInfo(detail.toJSON()),
        };
      }
    }

    return null;
  }, [api, pallet, trackId]);
}
