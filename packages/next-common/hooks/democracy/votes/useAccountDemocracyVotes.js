import { myVotesTriggerSelector } from "next-common/store/reducers/myVotesSlice";
import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

async function queryReferendumInfo(api, referendumIndex) {
  const info = await api.query.democracy.referendumInfoOf(referendumIndex);
  return {
    referendumIndex,
    referendumInfo: info.toJSON(),
  };
}

async function queryVotesAndReferendumInfo(api, address) {
  const voting = await api.query.democracy.votingOf(address);
  const votes = [];
  const priors = [];
  if (voting.isDirect) {
    const direct = voting.asDirect;
    for (const vote of direct.votes) {
      const referendumIndex = vote[0].toNumber();
      const accountVote = vote[1];
      votes.push({ referendumIndex, vote: accountVote });
    }

    priors.push({
      /**
       * we use this struct to adapt the priors data of conviction voting. Conviction voting usually involves multiple
       * tracks, so the conviction voting priors is an array like following:
       * [
       *  {
       *    trackId: 1,
       *    prior: {
       *      unlockAt: 0,
       *      balance: 0,
       *    },
       *  },
       * ]
       */
      prior: {
        unlockAt: direct.prior[0].toNumber(),
        balance: direct.prior[1].toString(),
      },
    });
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
    votes: normalizedVotes,
    priors,
  };
}

export default function useAccountDemocracyVotes(address) {
  const api = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState();
  const [priors, setPriors] = useState();
  const trigger = useSelector(myVotesTriggerSelector);

  useEffect(() => {
    if (!api || !api.query.democracy || !address) {
      setIsLoading(false);
      if (!address) {
        setVotes([]);
      }
      return;
    }

    setIsLoading(true);
    queryVotesAndReferendumInfo(api, address)
      .then(({ votes, priors }) => {
        setVotes(votes);
        setPriors(priors);
      })
      .finally(() => setIsLoading(false));
  }, [api, address, trigger]);

  return {
    isLoading,
    votes,
    priors,
  };
}
