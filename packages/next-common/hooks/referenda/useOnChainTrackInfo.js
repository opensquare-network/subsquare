import { useContextApi } from "next-common/context/api";
import { useReferendaPallet } from "next-common/context/referenda/pallet";
import { useChain } from "next-common/context/chain";
import { useMemo, useEffect, useState } from "react";
import { normalizeTrackInfo } from "next-common/utils/gov2/trackInfo";
import { getChainApiAt } from "next-common/utils/getChainApi";

// cache resolved api-at per chain + height/hash, to avoid repeated rpc/metadata
const atApiCache = new Map();

function useApiAt(blockHeightOrHash) {
  const api = useContextApi();
  const chain = useChain();
  const [atApi, setAtApi] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setAtApi(null);

    if (!api || !blockHeightOrHash) {
      return;
    }

    const key = `${chain}:${blockHeightOrHash}`;
    let promise = atApiCache.get(key);
    if (!promise) {
      promise = getChainApiAt(api, blockHeightOrHash);
      atApiCache.set(key, promise);
    }

    promise
      .then((resolved) => {
        if (!cancelled) {
          setAtApi(resolved);
        }
      })
      .catch((e) => {
        console.error("useOnChainTrackInfo getChainApiAt error:", e);
      });

    return () => {
      cancelled = true;
    };
  }, [api, chain, blockHeightOrHash]);

  return atApi;
}

/**
 * Read a single track info from chain constants.
 * @param {number|string|undefined} trackId
 * @param {number|string|null} [blockHeightOrHash] optional block at which to
 *   read the historical track config (e.g. the height a finished referendum
 *   ended). When omitted, the latest track config is used.
 * @returns {object|null} normalized track info, or null when not available yet / not found
 */
export default function useOnChainTrackInfo(trackId, blockHeightOrHash) {
  const api = useContextApi();
  const atApi = useApiAt(blockHeightOrHash);
  const pallet = useReferendaPallet();

  return useMemo(() => {
    const sourceApi = blockHeightOrHash ? atApi : api;
    if (!sourceApi || !sourceApi.consts?.[pallet]?.tracks) {
      return null;
    }

    const targetId = Number(trackId);
    if (!Number.isInteger(targetId)) {
      return null;
    }

    const tracks = sourceApi.consts[pallet].tracks || [];
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
  }, [api, atApi, pallet, trackId, blockHeightOrHash]);
}
