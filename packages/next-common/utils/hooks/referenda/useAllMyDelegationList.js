import { isNil } from "lodash-es";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePageProps } from "../../../context/page";
import { useMountedState } from "react-use";
import useRealAddress from "../useRealAddress";
import { extractAddressAndTrackId } from "../../gov2/utils";
import { useContextApi } from "next-common/context/api";

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
  const api = useContextApi();
  const realAddress = useRealAddress();
  const isMounted = useMountedState();
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

    if (isMounted()) {
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
