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
  }

  const promises = [];
  for (const vote of votes) {
    promises.push(queryReferendumInfo(api, vote.referendumIndex));
  }
  const infoArr = await Promise.all(promises);

  return votes.map((vote) => {
    const referendumInfo = infoArr.find(
      (info) => info.referendumIndex === vote.referendumIndex,
    );
    return {
      ...vote,
      ...referendumInfo,
    };
  });
}

export default function useAccountVotes(address) {
  const api = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState();
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
      .then((votes) => setVotes(votes))
      .finally(() => setIsLoading(false));
  }, [api, address, trigger]);

  return {
    isLoading,
    votes,
  };
}
