import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMyDemocracyVoting } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import normalizePrior from "../../utils/normalizePrior";
import getDelegatingVotesInfo from "./delegatingVotes";
import getDemocracyRichVotes from "./getRichVotes";
import { useContextApi } from "next-common/context/api";

async function getDirectVotesInfo(voting, api) {
  const direct = voting.asDirect;
  const richVotes = await getDemocracyRichVotes(api, voting);

  const delegations = {
    votes: direct.delegations.votes.toString(),
    capital: direct.delegations.capital.toString(),
  };

  return {
    isDirect: true,
    votes: richVotes,
    delegations,
    prior: normalizePrior(direct.prior),
  };
}

export default function useSubMyDemocracyVoting() {
  const address = useRealAddress();
  const api = useContextApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !api.query.democracy) {
      return;
    } else if (!address) {
      dispatch(setMyDemocracyVoting(null));
      return;
    }

    let unsub;
    api.query.democracy
      .votingOf(address, async (voting) => {
        let info;
        if (voting.isDirect) {
          info = await getDirectVotesInfo(voting, api);
        } else if (voting.isDelegating) {
          info = await getDelegatingVotesInfo(voting, api);
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
  }, [api, address, dispatch]);
}
