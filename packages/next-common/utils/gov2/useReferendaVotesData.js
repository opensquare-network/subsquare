import { useEffect, useState, useMemo, useCallback } from "react";
import { sortVotes } from "next-common/utils/democracy/votes/passed/common";
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

export function normalizedNestedVote(vote, delegations) {
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

export function useAllVotesStorage(referendumIndex) {
  return useMemo(
    () =>
      getOrCreateStorage(
        `${STORAGE_NAMES.REFERENDA_ALL_VOTES}-${referendumIndex}`,
      ),
    [referendumIndex],
  );
}

export function useReferendaVotes(referendumIndex) {
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const allVotesStorage = useAllVotesStorage(referendumIndex);

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

export function useReferendaShowVotesNum(allVotes, isLoading) {
  return !!allVotes && !isLoading;
}

export function useReferendaNestedVotes(allVotes) {
  return {
    ...nestedVotes(allVotes),
  };
}

export function useReferendaFlattenVotes(allVotes) {
  return {
    allAye: allAye(allVotes),
    allNay: allNay(allVotes),
    allAbstain: allAbstain(allVotes),
  };
}

export function useReferendaAllNestedVotes(allVotes) {
  const {
    allAye = [],
    allNay = [],
    allAbstain = [],
  } = useReferendaNestedVotes(allVotes);

  return flatten([allAye, allNay, allAbstain]);
}

export function processVotes(votes) {
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
