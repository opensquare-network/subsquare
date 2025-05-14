import { backendApi } from "next-common/services/nextApi";
import { useEffect, useState, useMemo, useCallback } from "react";
import { sortVotes } from "next-common/utils/democracy/votes/passed/common";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllVotes,
  setLoading,
} from "next-common/store/reducers/referenda/votes";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { createGlobalState } from "react-use";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";
import {
  getOrCreateStorage,
  STORAGE_ITEM_KEY,
  STORAGE_NAMES,
} from "next-common/utils/indexedDB/votes";

function extractSplitVotes(vote = {}) {
  const {
    referendumIndex,
    account,
    ayeBalance,
    ayeVotes,
    nayBalance,
    nayVotes,
  } = vote;
  const common = {
    referendumIndex,
    account,
    isDelegating: false,
    isSplit: true,
    conviction: 0,
  };

  let result = [];
  if (BigInt(ayeBalance) > 0) {
    result.push({
      ...common,
      balance: ayeBalance,
      aye: true,
      votes: ayeVotes,
    });
  }
  if (BigInt(nayBalance) > 0) {
    result.push({
      ...common,
      balance: nayBalance,
      aye: false,
      votes: nayVotes,
    });
  }
  return result;
}

function extractSplitAbstainVotes(vote = {}) {
  const {
    referendumIndex,
    account,
    ayeBalance,
    ayeVotes,
    nayBalance,
    nayVotes,
    abstainBalance,
    abstainVotes,
  } = vote;
  const common = {
    referendumIndex,
    account,
    isDelegating: false,
    isSplitAbstain: true,
  };

  const result = [
    {
      ...common,
      balance: abstainBalance,
      isAbstain: true,
      conviction: 0,
      votes: abstainVotes,
    },
  ];

  if (BigInt(ayeBalance) > 0) {
    result.push({
      ...common,
      balance: ayeBalance,
      aye: true,
      conviction: 0,
      votes: ayeVotes,
    });
  }
  if (BigInt(nayBalance) > 0) {
    result.push({
      ...common,
      balance: nayBalance,
      aye: false,
      conviction: 0,
      votes: nayVotes,
    });
  }

  return result;
}

const useGlobalVotesLoadedMark = createGlobalState(false);

export function useAllReferendaVotes(referendumIndex) {
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  const allVotesStorage = useMemo(
    () =>
      getOrCreateStorage(
        `${STORAGE_NAMES.REFERENDA_ALL_VOTES}-${referendumIndex}`,
      ),
    [referendumIndex],
  );

  const getVotesFromStorage = useCallback(async () => {
    if (!allVotesStorage) {
      return [];
    }
    try {
      const storedVotes = await allVotesStorage.getItem(
        STORAGE_ITEM_KEY.ALLVOTES,
      );
      return storedVotes || [];
    } catch (error) {
      console.error("Error reading votes from IndexedDB:", error);
      return [];
    }
  }, [allVotesStorage]);

  const getVotesFromApi = useCallback(async () => {
    const { result: votes } = await backendApi.fetch(
      `gov2/referenda/${referendumIndex}/votes`,
    );

    if (!votes) {
      return [];
    }

    const allVotesRaw = (votes || []).reduce((acc, vote) => {
      if (vote.isSplit) {
        return [...acc, ...extractSplitVotes(vote)];
      } else if (vote.isSplitAbstain) {
        return [...acc, ...extractSplitAbstainVotes(vote)];
      }
      return [...acc, vote];
    }, []);

    const filteredVotes = allVotesRaw.filter(
      (vote) =>
        BigInt(vote.votes) > 0 || BigInt(vote?.delegations?.votes || 0) > 0,
    );

    const sortedFilteredVotes = sortVotes(filteredVotes);

    try {
      await allVotesStorage?.setItem(
        STORAGE_ITEM_KEY.ALLVOTES,
        sortedFilteredVotes,
      );
    } catch (error) {
      console.error("Error saving votes to IndexedDB:", error);
    }

    return sortedFilteredVotes;
  }, [referendumIndex, allVotesStorage]);

  useEffect(() => {
    if (apiResult) {
      return;
    }
    getVotesFromStorage().then((storedResult) => {
      if (!apiResult) {
        setResult(storedResult);
      }
    });
  }, [getVotesFromStorage, apiResult]);

  useEffect(() => {
    setIsLoading(true);
    allVotesStorage
      ?.removeItem(STORAGE_ITEM_KEY.ALLVOTES)
      .catch((error) =>
        console.error("Error removing item from IndexedDB:", error),
      )
      .then(() => getVotesFromApi())
      .then((apiVotes) => {
        setResult(apiVotes);
        setApiResult(apiVotes);
      })
      .catch((error) => {
        console.error("Error fetching votes from API:", error);
      })
      .finally(() => setIsLoading(false));
  }, [getVotesFromApi, allVotesStorage]);

  return { isLoading, result };
}

export function useFetchVotesFromServer(referendumIndex) {
  const votingFinishedHeight = useReferendumVotingFinishHeight();
  const [loaded, setLoaded] = useGlobalVotesLoadedMark();
  const dispatch = useDispatch();

  const fetch = useCallback(() => {
    if (votingFinishedHeight && loaded) {
      return Promise.resolve();
    }
    dispatch(setLoading(true));

    return backendApi
      .fetch(`gov2/referenda/${referendumIndex}/votes`)
      .then(({ result: votes }) => {
        const allVotes = (votes || []).reduce((result, vote) => {
          if (vote.isSplit) {
            return [...result, ...extractSplitVotes(vote)];
          } else if (vote.isSplitAbstain) {
            return [...result, ...extractSplitAbstainVotes(vote)];
          }
          return [...result, vote];
        }, []);

        const filteredVotes = allVotes.filter(
          (vote) =>
            BigInt(vote.votes) > 0 || BigInt(vote?.delegations?.votes || 0) > 0,
        );

        dispatch(setAllVotes(sortVotes(filteredVotes)));

        if (!loaded) {
          setLoaded(true);
        }

        return filteredVotes;
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
  }, [votingFinishedHeight, referendumIndex, dispatch, setLoaded, loaded]);

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

export default function useVotesFromServer(referendumIndex) {
  const [votes, setVotes] = useState();
  const dispatch = useDispatch();
  const reduxVotes = useSelector(allVotesSelector);

  useEffect(() => {
    if (!reduxVotes) {
      backendApi
        .fetch(`gov2/referenda/${referendumIndex}/votes`)
        .then(({ result: votes }) => setVotes(votes));
    }
  }, [referendumIndex, reduxVotes]);

  useEffect(() => {
    if (!votes || reduxVotes) {
      return;
    }

    const allVotes = (votes || []).reduce((result, vote) => {
      if (vote.isSplit) {
        return [...result, ...extractSplitVotes(vote)];
      } else if (vote.isSplitAbstain) {
        return [...result, ...extractSplitAbstainVotes(vote)];
      }
      return [...result, vote];
    }, []);
    const filteredVotes = allVotes.filter(
      (vote) => BigInt(vote.votes) > 0 || BigInt(vote?.delegations?.votes) > 0,
    );
    dispatch(setAllVotes(sortVotes(filteredVotes)));
  }, [votes, reduxVotes, dispatch]);
}
