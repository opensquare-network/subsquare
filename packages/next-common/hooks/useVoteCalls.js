import nextApi from "next-common/services/nextApi";
import { gov2ReferendumsVoteCallsApi } from "next-common/services/url";
import { classifyVoteCalls } from "next-common/store/reducers/gov2ReferendumSlice";
import { openGovEmptyVotes as emptyVotes } from "next-common/utils/democracy/votes/passed/common";
import {
  getOrCreateStorage,
  STORAGE_ITEM_KEY,
  STORAGE_NAMES,
} from "next-common/utils/indexedDB/voteCalls";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useVoteCalls(referendumIndex) {
  const [result, setResult] = useState(emptyVotes);
  const [apiResult, setApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const voteCallsStorage = useMemo(
    () =>
      getOrCreateStorage(`${STORAGE_NAMES.REFERENDA_CALLS}-${referendumIndex}`),
    [referendumIndex],
  );

  const getVoteCallsFromSetorage = useCallback(
    async function () {
      const keys = await voteCallsStorage?.keys();
      if (!voteCallsStorage || !keys?.length) {
        return emptyVotes;
      }
      try {
        return {
          allAye:
            (await voteCallsStorage.getItem(STORAGE_ITEM_KEY.ALLAYE)) || [],
          allNay:
            (await voteCallsStorage.getItem(STORAGE_ITEM_KEY.ALLNAY)) || [],
          allAbstain:
            (await voteCallsStorage.getItem(STORAGE_ITEM_KEY.ALLABSTAIN)) || [],
        };
      } catch (error) {
        console.error(error);
        return emptyVotes;
      }
    },
    [voteCallsStorage],
  );

  const getVoteCallsFromApi = useCallback(
    async function () {
      return nextApi
        .fetch(gov2ReferendumsVoteCallsApi(referendumIndex))
        .then(({ result: apiResult }) => {
          if (!apiResult) {
            return emptyVotes;
          }

          const { allAye, allNay, allAbstain } = classifyVoteCalls(apiResult);

          try {
            voteCallsStorage.setItem(STORAGE_ITEM_KEY.ALLAYE, allAye);
            voteCallsStorage.setItem(STORAGE_ITEM_KEY.ALLNAY, allNay);
            voteCallsStorage.setItem(STORAGE_ITEM_KEY.ALLABSTAIN, allAbstain);
          } catch (error) {
            console.error(error);
          }
          return { allAye, allNay, allAbstain };
        });
    },
    [referendumIndex, voteCallsStorage],
  );

  useEffect(() => {
    if (apiResult) {
      return;
    }
    getVoteCallsFromSetorage().then((result) => {
      if (!apiResult) {
        setResult(result);
      }
    });
  }, [getVoteCallsFromSetorage, apiResult]);

  useEffect(() => {
    setIsLoading(true);

    try {
      voteCallsStorage?.clear();
    } catch (error) {
      console.error(error);
    }
    getVoteCallsFromApi()
      .then((res) => {
        setResult(res);
        setApiResult(res);
      })
      .finally(() => setIsLoading(false));
  }, [getVoteCallsFromApi, voteCallsStorage]);

  return { isLoading, result };
}
