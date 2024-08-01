import { useContextApi } from "next-common/context/api";
import { useMemo } from "react";

export default function useOnChainReferendaTracks() {
  const api = useContextApi();

  const tracks = useMemo(() => {
    if (!api) {
      return [];
    }
    return (api?.consts?.referenda?.tracks || []).map(([id, detail]) => ({
      id: id.toNumber(),
      ...detail.toJSON(),
    }));
  }, [api]);

  return {
    tracks,
    isLoading: !api,
  };
}
