import { backendApi } from "next-common/services/nextApi";
import { useEffect, useState, useMemo, useCallback } from "react";
import { sortVotes } from "next-common/utils/democracy/votes/passed/common";
import getChainSettings from "next-common/utils/consts/settings";
import { defaultBlockTime } from "next-common/utils/constants";
import { sleep } from "next-common/utils";
import {
  getOrCreateStorage,
  VOTES_STORAGE_ITEM_KEY,
  STORAGE_NAMES,
} from "next-common/utils/indexedDB/votes";
import { flatten } from "lodash-es";
import BigNumber from "bignumber.js";
import { isSameAddress } from "next-common/utils";

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

function normalizedNestedVote(vote, delegations) {
  if (!vote.isStandard) {
    return {
      ...vote,
      directVoterDelegations: [],
      totalVotes: vote.votes,
      totalDelegatedVotes: 0,
      totalDelegatedCapital: 0,
    };
  }

  let directVoterDelegations = delegations.filter((delegationVote) =>
    isSameAddress(delegationVote.target, vote.account),
  );
  const allDelegationVotes = directVoterDelegations.reduce((result, d) => {
    return new BigNumber(result).plus(d.votes).toString();
  }, 0);
  const totalVotes = new BigNumber(vote.votes)
    .plus(allDelegationVotes)
    .toString();
  const totalDelegatedVotes = directVoterDelegations.reduce((result, d) => {
    return BigNumber(result).plus(d.votes).toString();
  }, 0);
  const totalDelegatedCapital = directVoterDelegations.reduce((result, d) => {
    return BigNumber(result).plus(d.balance).toString();
  }, 0);

  return {
    ...vote,
    directVoterDelegations,
    totalVotes,
    totalDelegatedVotes,
    totalDelegatedCapital,
  };
}

function nestedVotes(allVotes) {
  const allDirectVotes = (allVotes || []).filter((v) => !v.isDelegating);
  const allDelegationVotes = (allVotes || []).filter((v) => v.isDelegating);

  const directVotesWithNested = allDirectVotes?.map((v) =>
    normalizedNestedVote(v, allDelegationVotes),
  );

  return {
    allAye: directVotesWithNested.filter((v) => v.aye),
    allNay: directVotesWithNested.filter((v) => v.aye === false),
    allAbstain: directVotesWithNested.filter((v) => v.isAbstain),
  };
}

function useAllVotesStorage(referendumIndex) {
  return useMemo(
    () =>
      getOrCreateStorage(
        `${STORAGE_NAMES.REFERENDA_ALL_VOTES}-${referendumIndex}`,
      ),
    [referendumIndex],
  );
}

// TODO: add result into context?
export function useReferendaVotes(referendumIndex) {
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        VOTES_STORAGE_ITEM_KEY.ALL_VOTES,
      );
      return storedVotes || [];
    } catch (error) {
      console.error("Error reading votes from IndexedDB:", error);
      return [];
    }
  }, [allVotesStorage]);

  useEffect(() => {
    setIsLoading(true);
    getVotesFromStorage()
      .then((storedResult) => {
        setResult(storedResult);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [getVotesFromStorage]);

  return {
    isLoading,
    allVotes: result,
  };
}

const allAye = (allVotes) => (allVotes || []).filter((v) => v.aye);
const allNay = (allVotes) => (allVotes || []).filter((v) => v.aye === false);
const allAbstain = (allVotes) => (allVotes || []).filter((v) => v.isAbstain);

export function useReferendaShowVotesNum(referendumIndex) {
  const { allVotes } = useReferendaVotes(referendumIndex);

  return !!allVotes;
}

export function useReferendaNestedVotes(referendumIndex) {
  const { allVotes, isLoading } = useReferendaVotes(referendumIndex);

  return {
    ...nestedVotes(allVotes),
    isLoading,
  };
}

export function useReferendaFlattenVotes(referendumIndex) {
  const { allVotes, isLoading } = useReferendaVotes(referendumIndex);

  return {
    allAye: allAye(allVotes),
    allNay: allNay(allVotes),
    allAbstain: allAbstain(allVotes),
    isLoading,
  };
}

export function useReferendaAllNestedVotes(referendumIndex) {
  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useReferendaNestedVotes(referendumIndex);

  return flatten([allAye, allNay, allAbstain]);
}

function processVotes(votes) {
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

  return sortVotes(filteredVotes);
}

export function useReferendaVotesFuncs(referendumIndex) {
  const allVotesStorage = useAllVotesStorage(referendumIndex);

  const fetch = useCallback(async () => {
    try {
      const { result: votes } = await backendApi.fetch(
        `gov2/referenda/${referendumIndex}/votes`,
      );

      const processedVotes = processVotes(votes);

      try {
        await allVotesStorage?.setItem(
          VOTES_STORAGE_ITEM_KEY.ALL_VOTES,
          processedVotes,
        );
      } catch (error) {
        console.error("Error saving votes to IndexedDB:", error);
      }

      return processedVotes;
    } catch (error) {
      console.error(
        "Error fetching votes for referendum:",
        referendumIndex,
        error,
      );
      throw new Error("Error fetching votes for referendum");
    }
  }, [referendumIndex, allVotesStorage]);

  const update = useCallback(
    async (times = 10) => {
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
    },
    [fetch, referendumIndex],
  );

  return { fetch, update };
}
