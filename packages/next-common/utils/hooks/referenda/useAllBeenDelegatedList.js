import groupBy from "lodash.groupby";
import isNil from "lodash.isnil";
import { useEffect, useMemo, useState } from "react";
import { usePageProps } from "../../../context/page";
import { getGov2BeenDelegatedListByAddress } from "../../gov2/gov2ReferendumVote";
import useApi from "../useApi";
import { useIsMountedBool } from "../useIsMounted";
import useRealAddress from "../useRealAddress";

/**
 * @description returns all been delegated
 */
export function useAllBeenDelegatedList() {
  const api = useApi();
  const realAddress = useRealAddress();
  const isMounted = useIsMountedBool();
  const { tracks = [] } = usePageProps();
  const [beenDelegatedList, setBeenDelegatedList] = useState(null);
  const isLoading = useMemo(
    () => isNil(beenDelegatedList),
    [beenDelegatedList]
  );

  async function getAllBeenDelegated() {
    if (!api || !realAddress) {
      return;
    }

    getGov2BeenDelegatedListByAddress(api, realAddress).then((list) => {
      const trackGroups = groupBy(list, "trackId");
      const result = Object.keys(trackGroups).map((k) => {
        const trackId = parseInt(k);
        const track = tracks.find((t) => t.id === trackId);
        const beenDelegated = trackGroups[trackId];
        return { track, beenDelegated };
      });
      setBeenDelegatedList(result);
    });
  }

  useEffect(() => {
    setBeenDelegatedList(null);
    getAllBeenDelegated();
  }, [api, isMounted, realAddress]);

  return {
    beenDelegatedList,
    isLoading,
    refresh: getAllBeenDelegated,
  };
}
