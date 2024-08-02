import { useContextApi } from "next-common/context/api";
import { useReferendaPallet } from "next-common/context/referenda/pallet";
import { useMemo } from "react";

export default function useOnChainReferendaTracks() {
  const api = useContextApi();
  const pallet = useReferendaPallet();

  const tracks = useMemo(() => {
    if (!api) {
      return [];
    }
    return (api?.consts[pallet]?.tracks || []).map(([id, detail]) => ({
      id: id.toNumber(),
      ...detail.toJSON(),
    }));
  }, [api, pallet]);

  return {
    tracks,
    isLoading: !api,
  };
}
