import { useEffect } from "react";
import { isNil } from "lodash-es";
import { useDispatch, useSelector } from "react-redux";
import {
  clearFellowshipVotes,
  clearFellowshipVotesTrigger,
  fellowshipVotesTriggerSelector,
  setFellowshipVotes,
  setIsLoadingFellowshipVotes,
} from "next-common/store/reducers/fellowship/votes";
import { partition } from "lodash-es";
import { useContextApi } from "next-common/context/api";

/**
 * // Fellowship voting storage: (pollIndex, address, VoteRecord)
 * // key u8a[] composition:
 * // 1. section + method = 32;
 * // 2. pollIndex blake_128 hash = 16;
 * // 3. pollIndex U16 4;
 * // 4. account twox_64 hash = 8;
 * // 5. account = 32;
 * // total = 92
 */
function extractPollIndexAndAddress(storageKey = []) {
  const pollIndex = storageKey.args[0].toNumber();
  const address = storageKey.args[1].toString();

  return {
    pollIndex,
    address,
  };
}

function normalizeVotingRecord(optionalRecord) {
  if (!optionalRecord.isSome) {
    return null;
  }

  const record = optionalRecord.unwrap();
  const isAye = record.isAye;
  const votes = isAye ? record.asAye.toNumber() : record.asNay.toNumber();
  return {
    isAye,
    votes,
  };
}

async function query(api, targetPollIndex, blockHash) {
  let blockApi = api;
  if (blockHash) {
    blockApi = await api.at(blockHash);
  }

  const voting = await blockApi.query.fellowshipCollective.voting.entries();

  const normalized = [];
  for (const [storageKey, votingOf] of voting) {
    const { pollIndex, address } = extractPollIndexAndAddress(storageKey);
    if (pollIndex !== targetPollIndex) {
      continue;
    }

    const vote = normalizeVotingRecord(votingOf);
    if (vote) {
      normalized.push({
        pollIndex,
        address,
        ...vote,
      });
    }
  }

  return normalized;
}

export default function useFellowshipVotes(pollIndex, indexer) {
  const api = useContextApi();
  const dispatch = useDispatch();
  const votesTrigger = useSelector(fellowshipVotesTriggerSelector);

  useEffect(() => {
    if (!api || isNil(pollIndex)) {
      return;
    }

    if (votesTrigger <= 1) {
      dispatch(setIsLoadingFellowshipVotes(true));
    }

    query(api, pollIndex, indexer?.blockHash)
      .then((votes) => {
        const [allAye = [], allNay = []] = partition(votes, (v) => v.isAye);
        dispatch(setFellowshipVotes({ allAye, allNay }));
      })
      .finally(() => dispatch(setIsLoadingFellowshipVotes(false)));

    return () => {
      dispatch(clearFellowshipVotes());
      dispatch(clearFellowshipVotesTrigger());
    };
  }, [api, pollIndex, indexer, votesTrigger, dispatch]);
}
