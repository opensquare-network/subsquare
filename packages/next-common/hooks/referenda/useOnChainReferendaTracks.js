import { useContextApi } from "next-common/context/api";
import { useReferendaPallet } from "next-common/context/referenda/pallet";
import { useMemo } from "react";
import { normalizeTrackInfo } from "next-common/utils/gov2/trackInfo";

export default function useOnChainReferendaTracks() {
  const api = useContextApi();
  const pallet = useReferendaPallet();

  const tracks = useMemo(() => {
    if (!api) {
      return [];
    }

    return (api?.consts[pallet]?.tracks || []).map((track) => {
      if (Array.isArray(track)) {
        const [id, detail] = track;
        return {
          id: id.toNumber(),
          ...normalizeTrackInfo(detail.toJSON()),
        };
      } else if (track.id && track.info) {
        return {
          id: track.id.toNumber(),
          ...normalizeTrackInfo(track.info.toJSON()),
        };
      }
    });
  }, [api, pallet]);

  return {
    tracks,
    isLoading: !api,
  };
}
