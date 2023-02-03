import isNil from "lodash.isnil";
import { useEffect, useMemo, useState } from "react";
import { usePageProps } from "../../../context/page";
import {
  getGov2BeenDelegatedByAddress,
  getGov2BeenDelegatedListByAddress,
  getGov2TrackDelegation,
} from "../../gov2/gov2ReferendumVote";
import useApi from "../useApi";
import { useIsMountedBool } from "../useIsMounted";
import useRealAddress from "../useRealAddress";

/**
 * @description returns all my delegations/delegatings
 */
export function useAllMyDelegationList() {
  const api = useApi();
  const realAddress = useRealAddress();
  const isMounted = useIsMountedBool();
  const { tracks = [] } = usePageProps();
  const [myDelegationList, setMyDelegationList] = useState(null);
  const isLoading = useMemo(() => isNil(myDelegationList), [myDelegationList]);

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
      setMyDelegationList(list.filter((item) => item.delegation));
    });
  }

  useEffect(() => {
    setMyDelegationList(null);
    getAllDelegations();
  }, [isMounted, api, realAddress]);

  return {
    myDelegationList,
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
        const beenDelegated = await getGov2BeenDelegatedListByAddress(
          api,
          realAddress,
          track.id
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

/**
 * @param {number} track track id
 * @returns delegations
 * @description getGov2BeenDelegatedByAddress hook
 */
export function useTrackDelegations(track) {
  const api = useApi();
  const realAddress = useRealAddress();
  const isMounted = useIsMountedBool();
  const [delegations, setDelegations] = useState(null);

  useEffect(() => {
    setDelegations(null);

    if (!api || !realAddress || isNil(track)) {
      return;
    }

    getGov2BeenDelegatedByAddress(api, realAddress, track).then((result) => {
      if (isMounted) {
        setDelegations(result);
      }
    });
  }, [track, api, realAddress, isMounted]);

  return delegations;
}
