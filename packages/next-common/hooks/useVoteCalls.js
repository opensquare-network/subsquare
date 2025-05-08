import { useChainSettings } from "next-common/context/chain";
import nextApi from "next-common/services/nextApi";
import {
  gov2ReferendumsVoteCallsApi,
  gov2ReferendumsVoteExtrinsicsApi,
} from "next-common/services/url";
import { classifyVoteCalls } from "next-common/store/reducers/gov2ReferendumSlice";
import { openGovEmptyVotes as emptyVotes } from "next-common/utils/democracy/votes/passed/common";
import {
  getOrCreateStorage,
  STORAGE_ITEM_KEY,
  STORAGE_NAMES,
} from "next-common/utils/indexedDB/voteCalls";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useVoteCalls(referendumIndex) {
  const { useVoteCall } = useChainSettings();
  const [result, setResult] = useState(emptyVotes);
  const [apiResult, setApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const voteCallsStorage = useMemo(
    () =>
      getOrCreateStorage(
        `${
          useVoteCall ? STORAGE_NAMES.CALLS : STORAGE_NAMES.EXTRINSICS
        }-${referendumIndex}`,
      ),
    [useVoteCall, referendumIndex],
  );

  const fetchApi = useMemo(
    () =>
      useVoteCall
        ? gov2ReferendumsVoteCallsApi
        : gov2ReferendumsVoteExtrinsicsApi,
    [useVoteCall],
  );

  const getVoteCallsFromSetorage = useCallback(
    async function () {
      const keys = await voteCallsStorage?.keys();
      if (!voteCallsStorage || !keys?.length) {
        return emptyVotes;
      }
      return {
        allAye: (await voteCallsStorage.getItem(STORAGE_ITEM_KEY.ALLAYE)) || [],
        allNay: (await voteCallsStorage.getItem(STORAGE_ITEM_KEY.ALLNAY)) || [],
        allAbstain:
          (await voteCallsStorage.getItem(STORAGE_ITEM_KEY.ALLABSTAIN)) || [],
      };
    },
    [voteCallsStorage],
  );

  const getVoteCallsFromApi = useCallback(
    async function () {
      return nextApi
        .fetch(fetchApi(referendumIndex))
        .then(({ result: apiResult }) => {
          if (!apiResult) {
            return emptyVotes;
          }

          const { allAye, allNay, allAbstain } = classifyVoteCalls(apiResult);

          voteCallsStorage.setItem(STORAGE_ITEM_KEY.ALLAYE, allAye);
          voteCallsStorage.setItem(STORAGE_ITEM_KEY.ALLNAY, allNay);
          voteCallsStorage.setItem(STORAGE_ITEM_KEY.ALLABSTAIN, allAbstain);
          return { allAye, allNay, allAbstain };
        });
    },
    [referendumIndex, voteCallsStorage, fetchApi],
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

    voteCallsStorage?.clear();
    getVoteCallsFromApi()
      .then((res) => {
        setResult(res);
        setApiResult(res);
      })
      .finally(() => setIsLoading(false));
  }, [getVoteCallsFromApi, voteCallsStorage]);

  return { isLoading, result };
}
