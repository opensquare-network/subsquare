import isNil from "lodash.isnil";
import { useEffect, useMemo, useState } from "react";
import { usePageProps } from "../../../context/page";
import useApi from "../useApi";
import { useIsMountedBool } from "../useIsMounted";
import useRealAddress from "../useRealAddress";
import { extractAddressAndTrackId } from "../../gov2/utils";

export async function getAddressTrackDelegations(api, address) {
  const voting = await api.query.convictionVoting.votingFor.entries(address);
  return voting.reduce((result, [storageKey, votingOf]) => {
    if (votingOf.isDelegating) {
      const { trackId } = extractAddressAndTrackId(storageKey, api);
      result.push({ trackId, delegation: votingOf.asDelegating.toJSON() });
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

    getAddressTrackDelegations(api, realAddress)
      .then((delegations = []) => {
        return delegations.map(({ trackId, delegation }) => {
          const track = tracks.find((track) => track.id === trackId);
          return {
            track,
            delegation,
          };
        });
      })
      .then((delegations) => setMyDelegationList(delegations));
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
