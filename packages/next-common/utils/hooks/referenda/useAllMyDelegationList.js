import isNil from "lodash.isnil";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePageProps } from "../../../context/page";
import useApi from "../useApi";
import useIsMounted from "../useIsMounted";
import useRealAddress from "../useRealAddress";
import { extractAddressAndTrackId } from "../../gov2/utils";

export async function getAddressTrackDelegations(api, address) {
  const voting = await api.query.convictionVoting.votingFor.entries(address);
  return voting.reduce((result, [storageKey, votingOf]) => {
    if (votingOf.isDelegating) {
      const { trackId } = extractAddressAndTrackId(storageKey);
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
  const isMounted = useIsMounted();
  const { tracks = [] } = usePageProps();
  const [myDelegationList, setMyDelegationList] = useState(null);
  const isLoading = useMemo(() => isNil(myDelegationList), [myDelegationList]);

  const getAllDelegations = useCallback(async () => {
    if (!api || !realAddress) {
      return;
    }

    const list = await getAddressTrackDelegations(api, realAddress);
    const delegations = (list || [])
      .map(({ trackId, delegation }) => {
        const track = tracks.find((track) => track.id === trackId);
        if (!track) {
          return null;
        }

        return {
          track,
          delegation,
        };
      })
      .filter((v) => v);

    if (isMounted.current) {
      setMyDelegationList(delegations);
    }
  }, [isMounted, api, realAddress, tracks]);

  useEffect(() => {
    setMyDelegationList(null);
    getAllDelegations();
  }, [getAllDelegations]);

  return {
    myDelegationList,
    isLoading,
    refresh: getAllDelegations,
  };
}
