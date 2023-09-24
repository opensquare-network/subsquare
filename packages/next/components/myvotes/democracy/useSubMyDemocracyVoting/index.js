import useRealAddress from "next-common/utils/hooks/useRealAddress";
import normalizeDemocracyVote from "../normalize";
import { useEffect } from "react";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch, useSelector } from "react-redux";
import { setMyDemocracyVoting } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import { myVotesTriggerSelector } from "next-common/store/reducers/myVotesSlice";
import normalizePrior from "../../utils/normalizePrior";

async function queryReferendumInfo(api, referendumIndex) {
  const info = await api.query.democracy.referendumInfoOf(referendumIndex);
  return {
    referendumIndex,
    referendumInfo: info.toJSON(),
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

function getDelegatingVotesInfo(voting) {
  const delegating = voting.asDelegating;
  return {
    isDelegating: true,
    balance: delegating.balance.toString(),
    target: delegating.target.toString(),
    conviction: delegating.conviction.toNumber(),
    prior: normalizePrior(delegating.prior),
  };
}

export default function useSubMyDemocracyVoting() {
  const address = useRealAddress();
  const api = useApi();
  const dispatch = useDispatch();
  const trigger = useSelector(myVotesTriggerSelector);

  useEffect(() => {
    if (!api || !api.query.democracy || !address) {
      return;
    }

    let unsub;
    api.query.democracy
      .votingOf(address, async (voting) => {
        let info;
        if (voting.isDirect) {
          info = await getDirectVotesInfo(api, voting);
        } else if (voting.isDelegating) {
          info = getDelegatingVotesInfo(voting);
        }
        dispatch(setMyDemocracyVoting(info));
      })
      .then((result) => {
        unsub = result;
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, address, dispatch, trigger]);
}
