import useRealAddress from "next-common/utils/hooks/useRealAddress";
import normalizeDemocracyVote from "./normalize";
import { useEffect } from "react";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch, useSelector } from "react-redux";
import { setMyDemocracyVoting } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import { myVotesTriggerSelector } from "next-common/store/reducers/myVotesSlice";

async function queryReferendumInfo(api, referendumIndex) {
  const info = await api.query.democracy.referendumInfoOf(referendumIndex);
  return {
    referendumIndex,
    referendumInfo: info.toJSON(),
  };
}

function normalizePrior(prior) {
  return {
    unlockAt: prior[0].toNumber(),
    balance: prior[1].toString(),
  };
}

async function getDirectVotesInfo(api, voting) {
  const direct = voting.asDirect;
  const votes = [];
  for (const vote of direct.votes) {
    const referendumIndex = vote[0].toNumber();
    votes.push({ referendumIndex, vote: normalizeDemocracyVote(vote[1]) });
  }

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
      ...referendumInfo,
    };
  });

  return {
    isDirect: true,
    votes: normalizedVotes,
    prior: normalizePrior(direct.prior),
  };
}

function getDelegatingVotesInfo(api, voting) {
  const delegating = voting.asDelegating;
  return {
    isDelegating: true,
    balance: delegating.balance.toString(),
    target: delegating.target.toString(),
    conviction: delegating.conviction.toNumber(),
    prior: normalizePrior(delegating.prior),
  };
}

async function queryVotesAndReferendaInfo(api, address) {
  const voting = await api.query.democracy.votingOf(address);
  if (voting.isDirect) {
    return await getDirectVotesInfo(api, voting);
  } else if (voting.isDelegating) {
    return getDelegatingVotesInfo(api, voting);
  }

  throw new Error("Unknown voting type when get my democracy votes info");
}

export default function useFetchMyDemocracyVoting() {
  const address = useRealAddress();
  const api = useApi();
  const dispatch = useDispatch();
  const trigger = useSelector(myVotesTriggerSelector);

  useEffect(() => {
    if (!api || !api.query.democracy || !address) {
      return;
    }

    queryVotesAndReferendaInfo(api, address).then((info) => {
      dispatch(setMyDemocracyVoting(info));
    });
  }, [api, address, dispatch, trigger]);
}
