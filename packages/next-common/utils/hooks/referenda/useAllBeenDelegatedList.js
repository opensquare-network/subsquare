import BigNumber from "bignumber.js";
import { groupBy } from "lodash-es";
import { isNil } from "lodash-es";
import { sumBy } from "lodash-es";
import { calcVotes } from "next-common/utils/democracy/votes/passed/common";
import { Conviction } from "next-common/utils/referendumCommon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePageProps } from "../../../context/page";
import { getGov2BeenDelegatedListByAddress } from "../../gov2/gov2ReferendumVote";
import { useMountedState } from "react-use";
import useRealAddress from "../useRealAddress";
import { useContextApi } from "next-common/context/api";

/**
 * @description returns all been delegated
 */
export function useAllBeenDelegatedList(address) {
  const api = useContextApi();
  const isMounted = useMountedState();
  const { tracks = [] } = usePageProps();
  const [beenDelegatedList, setBeenDelegatedList] = useState(null);
  const isLoading = useMemo(
    () => isNil(beenDelegatedList),
    [beenDelegatedList],
  );

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
