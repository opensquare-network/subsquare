import { isNil } from "lodash-es";
import { useEffect, useState } from "react";
import { getGov2BeenDelegatedByAddress } from "../../gov2/gov2ReferendumVote";
import { useMountedState } from "react-use";
import useRealAddress from "../useRealAddress";
import { useContextApi } from "next-common/context/api";

export function useTrackDelegations(track, address) {
  const api = useContextApi();
  const isMounted = useMountedState();
  const [delegations, setDelegations] = useState(null);

  useEffect(() => {
    setDelegations(null);

    if (!api || !address || isNil(track)) {
      return;
    }

    getGov2BeenDelegatedByAddress(api, address, track).then((result) => {
      if (isMounted()) {
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
