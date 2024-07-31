import { useContextApi } from "next-common/context/api";
import { useMemo } from "react";

export default function useReferendaTracks() {
  const api = useContextApi();
  return useMemo(() => {
    const tracks = api?.consts.referenda?.tracks || [];
    return tracks.map(([id, detail]) => ({
      id: id.toNumber(),
      ...detail.toJSON(),
    }));
  }, [api]);
}
