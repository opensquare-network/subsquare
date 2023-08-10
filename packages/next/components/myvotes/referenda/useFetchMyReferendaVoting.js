import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch, useSelector } from "react-redux";
import { myVotesTriggerSelector } from "next-common/store/reducers/myVotesSlice";
import { useEffect } from "react";
import normalizePrior from "../utils/normalizePrior";
import normalizeReferendaVote from "./normalizeVote";
import queryReferendumInfo from "./queryReferendumInfo";
import { setMyReferendaVoting } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";

function getDelegatingInfo(voting) {
  const delegating = voting.asDelegating;
  return {
    isDelegating: true,
    balance: delegating.balance.toString(),
    target: delegating.target.toString(),
    conviction: delegating.conviction.toNumber(),
    prior: normalizePrior(delegating.prior),
  };
}

async function normalizeCastingVoting(api, trackId, votingOf) {
  const casting = votingOf.asCasting;
  const votes = casting.votes.map((voteInfo) => {
    const referendumIndex = voteInfo[0].toNumber();
    const accountVote = voteInfo[1];
    return {
      trackId,
      referendumIndex,
      vote: normalizeReferendaVote(accountVote),
    };
  });

  const promises = [];
  for (const vote of votes) {
    promises.push(queryReferendumInfo(api, vote.referendumIndex));
  }
  const infoArr = await Promise.all(promises);

  const normalizedVotes = votes.map((vote) => {
    const referendumInfo = infoArr.find(
      (info) => info.referendumIndex === vote.referendumIndex,
    );
    return {
      ...vote,
      ...(referendumInfo || {}),
    };
  });

  return {
    isCasting: true,
    trackId,
    votes: normalizedVotes,
    prior: normalizePrior(casting.prior),
  };
}

async function queryVotesAndReferendaInfo(api, address) {
  const entries = await api.query.convictionVoting.votingFor.entries(address);
  const voting = [];
  for (const [storageKey, votingOf] of entries) {
    const trackId = storageKey.args[1].toNumber();
    if (votingOf.isDelegating) {
      voting.push({ trackId, ...getDelegatingInfo(votingOf) });
    } else if (votingOf.isCasting) {
      const normalized = await normalizeCastingVoting(api, trackId, votingOf);
      voting.push(normalized);
    }
  }

  return voting;
}

export default function useFetchMyReferendaVoting() {
  const address = useRealAddress();
  const api = useApi();
  const dispatch = useDispatch();
  const trigger = useSelector(myVotesTriggerSelector);

  useEffect(() => {
    if (!api || !api.query.convictionVoting || !address) {
      return;
    }

    queryVotesAndReferendaInfo(api, address).then((voting) => {
      dispatch(setMyReferendaVoting(voting));
    });
  }, [api, address, dispatch, trigger]);
}
