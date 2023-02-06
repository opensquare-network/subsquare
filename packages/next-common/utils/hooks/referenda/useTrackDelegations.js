import isNil from "lodash.isnil";
import { useEffect, useState } from "react";
import { getGov2BeenDelegatedByAddress } from "../../gov2/gov2ReferendumVote";
import useApi from "../useApi";
import useIsMounted from "../useIsMounted";
import useRealAddress from "../useRealAddress";

/**
 * @param {number} track track id
 * @returns delegations
 * @description getGov2BeenDelegatedByAddress hook
 */
export function useTrackDelegations(track) {
  const api = useApi();
  const realAddress = useRealAddress();
  const isMounted = useIsMounted();
  const [delegations, setDelegations] = useState(null);

  useEffect(() => {
    setDelegations(null);

    if (!api || !realAddress || isNil(track)) {
      return;
    }

    getGov2BeenDelegatedByAddress(api, realAddress, track).then((result) => {
      if (isMounted.current) {
        setDelegations(result);
      }
    });
  }, [track, api, realAddress, isMounted]);

  return delegations;
}
