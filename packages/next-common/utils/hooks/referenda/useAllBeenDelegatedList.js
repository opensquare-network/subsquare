import BigNumber from "bignumber.js";
import { groupBy } from "lodash-es";
import { isNil } from "lodash-es";
import { sumBy } from "lodash-es";
import { calcVotes } from "next-common/utils/democracy/votes/passed/common";
import { Conviction } from "next-common/utils/referendumCommon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePageProps } from "../../../context/page";
import { getGov2BeenDelegatedListByAddress } from "../../gov2/gov2ReferendumVote";
import { useAsync, useMountedState } from "react-use";
import useRealAddress from "../useRealAddress";
import { useContextApi } from "next-common/context/api";
import nextApi from "next-common/services/nextApi";

export function useServerAllBeenDelegatedList(address) {
  const { tracks = [] } = usePageProps();
  const { value, loading } = useAsync(async () => {
    const { result } = await nextApi.fetch(
      `users/${address}/referenda/delegator`,
    );
    return result || [];
  }, [address, tracks]);

  const trackGroupedData = useMemo(() => {
    const trackGroups = {};
    for (const item of value || []) {
      trackGroups[item.trackId] = trackGroups[item.trackId] || [];
      trackGroups[item.trackId].push(item);
    }
    return Object.entries(trackGroups).map(([trackId, beenDelegated]) => {
      // console.log({ trackId, beenDelegated });
      const track = tracks.find((t) => t.id === parseInt(trackId));
      return {
        track,
        beenDelegated: beenDelegated.map((i) => ({
          conviction: i.conviction,
          balance: i.balance,
          trackId: i.trackId,
          delegator: i.account,
          target: i.delegatee,
          votes: i.votes,
        })),
        totalVotes: beenDelegated
          .reduce((acc, i) => acc.plus(i.votes), new BigNumber(0))
          .toString(),
        totalBalance: beenDelegated
          .reduce((acc, i) => acc.plus(i.balance), new BigNumber(0))
          .toString(),
      };
    });
  }, [value, tracks]);

  return {
    value: trackGroupedData,
    loading,
  };
}

export function useMaybeServerAllBeenDelegatedList(address) {
  const { value: serverData, loading: isServerDataLoading } =
    useServerAllBeenDelegatedList(address);

  const {
    beenDelegatedList,
    isLoading: isOnchainDataLoading,
    refresh,
  } = useAllBeenDelegatedList(address);

  if (!isOnchainDataLoading) {
    return {
      beenDelegatedList,
      isLoading: false,
      refresh,
    };
  }

  return {
    beenDelegatedList: serverData,
    isLoading: isServerDataLoading,
    refresh,
  };
}

/**
 * @description returns all been delegated
 */
export function useAllBeenDelegatedList(address) {
  const api = useContextApi();
  const isMounted = useMountedState();
  const { tracks = [] } = usePageProps();
  const [beenDelegatedList, setBeenDelegatedList] = useState(null);
  const isLoading = isNil(beenDelegatedList);

  const getAllBeenDelegated = useCallback(async () => {
    if (!api || !address) {
      return;
    }

    const beenDelegatedList =
      (await getGov2BeenDelegatedListByAddress(api, address)) ?? [];

    const list = beenDelegatedList.map((item) => {
      const conviction = Conviction[item.conviction];
      const votes = calcVotes(item.balance, conviction);

      return {
        ...item,
        conviction,
        votes,
      };
    });
    const trackGroups = groupBy(list, "trackId");
    const result = Object.keys(trackGroups)
      .map((k) => {
        const trackId = parseInt(k);
        const track = tracks.find((t) => t.id === trackId);
        const beenDelegated = trackGroups[trackId];
        /**
         * @description track total votes
         */
        const totalVotes = sumBy(beenDelegated, (i) =>
          BigNumber(i.votes).toNumber(),
        );
        /**
         * @description track total balance
         */
        const totalBalance = sumBy(beenDelegated, (i) =>
          BigNumber(i.balance).toNumber(),
        );
        if (!track) {
          return null;
        }
        return { track, beenDelegated, totalVotes, totalBalance };
      })
      .filter((v) => v);

    if (isMounted()) {
      setBeenDelegatedList(result);
    }
  }, [api, isMounted, address, tracks]);

  useEffect(() => {
    setBeenDelegatedList(null);
    getAllBeenDelegated();
  }, [getAllBeenDelegated]);

  return {
    beenDelegatedList,
    isLoading,
    refresh: getAllBeenDelegated,
  };
}

/**
 * @description returns all my been delegated
 */
export function useAllMyBeenDelegatedList() {
  const realAddress = useRealAddress();
  return useAllBeenDelegatedList(realAddress);
}

export function useMaybeServerAllMyBeenDelegatedList() {
  const realAddress = useRealAddress();
  return useMaybeServerAllBeenDelegatedList(realAddress);
}
