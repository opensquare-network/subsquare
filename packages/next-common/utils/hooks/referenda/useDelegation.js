import groupBy from "lodash.groupby";
import isNil from "lodash.isnil";
import { useEffect, useMemo, useState } from "react";
import { usePageProps } from "../../../context/page";
import {
  getGov2BeenDelegatedByAddress,
  getGov2BeenDelegatedListByAddress,
} from "../../gov2/gov2ReferendumVote";
import useApi from "../useApi";
import { useIsMountedBool } from "../useIsMounted";
import useRealAddress from "../useRealAddress";
import { extractAddressAndTrackId } from "../../gov2/utils";

export async function getAddressTrackDelegations(api, address) {
  const voting = await api.query.convictionVoting.votingFor.entries(address);
  return voting.reduce((result, [storageKey, votingOf]) => {
    if (votingOf.isDelegating) {
      const { trackId } = extractAddressAndTrackId(storageKey, api);
      result.push({ trackId, delegation: votingOf.asDelegating });
    }

    return result;
  }, []);
}

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

    getAddressTrackDelegations(api, realAddress).then((delegations = []) => {
      return delegations.map(({trackId, delegation}) => {
        const track = tracks.find(track => track.id === trackId);
        return {
          track,
          delegation,
        }
      })
    }).then(delegations => setMyDelegationList(delegations));
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
