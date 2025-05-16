import { backendApi } from "next-common/services/nextApi";
import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setAllVotes,
  setLoading,
} from "next-common/store/reducers/referenda/votes";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { createGlobalState } from "react-use";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";
import { useAllVotesStorage, processVotes } from "./useReferendaVotesData";
import { VOTES_STORAGE_ITEM_KEY } from "next-common/utils/indexedDB/votes";

const useGlobalVotesLoadedMark = createGlobalState(false);

export function useFetchVotesFromServer(referendumIndex) {
  const votingFinishedHeight = useReferendumVotingFinishHeight();
  const [loaded, setLoaded] = useGlobalVotesLoadedMark();
  const dispatch = useDispatch();
  // indexedDB
  const allVotesStorage = useAllVotesStorage(referendumIndex);

  const fetch = useCallback(async () => {
    if (votingFinishedHeight && loaded) {
      return Promise.resolve();
    }
    dispatch(setLoading(true));

    return backendApi
      .fetch(`gov2/referenda/${referendumIndex}/votes`)
      .then(({ result: votes }) => {
        const processedVotes = processVotes(votes);

        allVotesStorage?.setItem(
          VOTES_STORAGE_ITEM_KEY.ALL_VOTES,
          processedVotes,
        );

        dispatch(setAllVotes(processedVotes));

        if (!loaded) {
          setLoaded(true);
        }

        return processedVotes;
      })
      .catch((error) => {
        console.error(
          "Error fetching votes for referendum:",
          referendumIndex,
          error,
        );
        throw new Error("Error fetching votes for referendum");
      })
      .finally(() => {
        setTimeout(() => dispatch(setLoading(false)), 1);
      });
  }, [votingFinishedHeight, referendumIndex, dispatch, setLoaded, loaded, allVotesStorage]);

  useEffect(() => {
    return () => {
      setLoaded(false);
    };
  }, [setLoaded]);

  return { fetch };
}

export function useUpdateVotesFromServer(referendumIndex) {
  const { fetch } = useFetchVotesFromServer(referendumIndex);

  const update = useCallback(async () => {
    const times = 10;
    const blockTime =
      getChainSettings(process.env.NEXT_PUBLIC_CHAIN).blockTime ||
      defaultBlockTime;

    for (let i = 0; i < times; i++) {
      try {
        await fetch();
      } catch (error) {
        console.error(
          "Error updating votes for referendum:",
          referendumIndex,
          error,
        );
      }

      if (i < times - 1) {
        await sleep(blockTime);
      }
    }
  }, [fetch, referendumIndex]);

  return { update };
}
