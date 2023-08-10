import { useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import { useSelector } from "react-redux";
import { myVotesTriggerSelector } from "next-common/store/reducers/myVotesSlice";

async function queryReferendumInfo(api, referendumIndex) {
  const info = await api.query.referenda.referendumInfoFor(referendumIndex);
  return {
    referendumIndex,
    referendumInfo: info.toJSON(),
  };
}

async function queryVotesAndReferendumInfo(api, address) {
  const entries = await api.query.convictionVoting.votingFor.entries(address);
  const votes = [];
  const priors = [];
  for (const [storageKey, votingOf] of entries) {
    const trackId = storageKey.args[1].toNumber();
    if (votingOf.isDelegating) {
      continue;
    }

    const casting = votingOf.asCasting;
    for (const vote of casting.votes) {
      const referendumIndex = vote[0].toNumber();
      const accountVote = vote[1];
      votes.push({ trackId, referendumIndex, vote: accountVote });
    }

    const trackPrior = priors.find(
      ({ trackId: priorTrackId }) => priorTrackId === trackId,
    );
    if (!trackPrior) {
      priors.push({
        trackId,
        prior: {
          unlockAt: casting.prior[0].toNumber(),
          balance: casting.prior[1].toString(),
        },
      });
    }
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

export default function useAccountVotes(address) {
  const api = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState();
  const [priors, setPriors] = useState();
  const trigger = useSelector(myVotesTriggerSelector);

  useEffect(() => {
    if (!api || !api.query.convictionVoting || !address) {
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
