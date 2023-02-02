import isNil from "lodash.isnil";
import { useEffect, useMemo, useState } from "react";
import { usePageProps } from "../../../context/page";
import {
  getGov2BeenDelegatedListByAddress,
  getGov2TrackDelegation,
} from "../../gov2/gov2ReferendumVote";
import useApi from "../useApi";
import { useIsMountedBool } from "../useIsMounted";
import useRealAddress from "../useRealAddress";

/**
 * @description returns all my delegations/delegatings
 */
export function useAllDelegationList() {
  const api = useApi();
  const realAddress = useRealAddress();
  const isMounted = useIsMountedBool();
  const { tracks = [] } = usePageProps();
  const [delegationList, setDelegationList] = useState(null);
  const isLoading = useMemo(() => isNil(delegationList), [delegationList]);

  async function getAllDelegations() {
    if (!api || !realAddress) {
      return;
    }

    Promise.all(
      tracks.map(async (track) => {
        const delegation = await getGov2TrackDelegation(
          api,
          track.id,
          realAddress
        );
        return {
          track,
          delegation,
        };
      })
    ).then((list = []) => {
      setDelegationList(list.filter((item) => item.delegation));
    });
  }

  useEffect(() => {
    setDelegationList(null);
    getAllDelegations();
  }, [isMounted, api, realAddress]);

  return {
    delegationList,
    isLoading,
    refresh: getAllDelegations,
  };
}

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

    Promise.all(
      tracks.map(async (track) => {
        const beenDelegated = getGov2BeenDelegatedListByAddress(
          api,
          track.id,
          realAddress
        );
        return {
          track,
          beenDelegated,
        };
      })
    ).then((list = []) => {
      setBeenDelegatedList(list.filter((item) => item.beenDelegated?.length));
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
