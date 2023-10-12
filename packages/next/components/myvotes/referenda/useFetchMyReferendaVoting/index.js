import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import normalizePrior from "../../utils/normalizePrior";
import normalizeReferendaVote from "../normalizeVote";
import queryReferendumInfo from "../queryReferendumInfo";
import {
  myReferendaVotesTriggerSelector,
  setIsLoadingReferendaVoting,
  setMyReferendaPriors,
  setMyReferendaVoting,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import getOpenGovReferendaPosts from "./posts";
import getDelegatedVoting from "./delegation";

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

  const indexes = votes.map((v) => v.referendumIndex);
  const posts = await getOpenGovReferendaPosts(indexes);

  const normalizedVotes = votes.map((vote) => {
    const referendumInfo = infoArr.find(
      (info) => info.referendumIndex === vote.referendumIndex,
    );
    const post = posts.find((p) => p.referendumIndex === vote.referendumIndex);
    return {
      ...vote,
      ...(referendumInfo || {}),
      post,
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
  const priors = [];
  for (const [storageKey, votingOf] of entries) {
    const trackId = storageKey.args[1].toNumber();
    if (votingOf.isDelegating) {
      const delegated = await getDelegatedVoting(api, trackId, votingOf);
      voting.push({ trackId, ...delegated });
      priors.push({
        trackId,
        ...normalizePrior(votingOf.asDelegating.prior),
      });
    } else if (votingOf.isCasting) {
      const normalized = await normalizeCastingVoting(api, trackId, votingOf);
      voting.push(normalized);
      priors.push({
        trackId,
        ...normalizePrior(votingOf.asCasting.prior),
      });
    }
  }

  return { voting, priors };
}

export default function useFetchMyReferendaVoting() {
  const address = useRealAddress();
  const api = useApi();
  const dispatch = useDispatch();
  const trigger = useSelector(myReferendaVotesTriggerSelector);

  useEffect(() => {
    if (!api || !api.query.convictionVoting || !address) {
      return;
    }

    if (trigger <= 0) {
      dispatch(setIsLoadingReferendaVoting(true));
    }
    queryVotesAndReferendaInfo(api, address)
      .then(({ voting, priors }) => {
        dispatch(setMyReferendaPriors(priors));
        dispatch(setMyReferendaVoting(voting));
      })
      .finally(() => {
        dispatch(setIsLoadingReferendaVoting(false));
      });
  }, [api, address, dispatch, trigger]);
}
