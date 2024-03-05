import isNil from "lodash.isnil";
import { useEffect, useState } from "react";
import { getGov2BeenDelegatedByAddress } from "../../gov2/gov2ReferendumVote";
import useApi from "../useApi";
import useIsMounted from "../useIsMounted";
import useRealAddress from "../useRealAddress";

export function useTrackDelegations(track, address) {
  const api = useApi();
  const isMounted = useIsMounted();
  const [delegations, setDelegations] = useState(null);

  useEffect(() => {
    setDelegations(null);

    if (!api || !address || isNil(track)) {
      return;
    }

    getGov2BeenDelegatedByAddress(api, address, track).then((result) => {
      if (isMounted.current) {
        setDelegations(result);
      }
    });
  }, [track, api, address, isMounted]);

  return delegations;
}

/**
 * @param {number} track track id
 * @returns delegations
 * @description getGov2BeenDelegatedByAddress hook
 */
export function useMyTrackDelegations(track) {
  const realAddress = useRealAddress();
  return useTrackDelegations(track, realAddress);
}
