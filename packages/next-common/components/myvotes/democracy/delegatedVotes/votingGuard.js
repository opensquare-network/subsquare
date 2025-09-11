import { useSelector } from "react-redux";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";

export default function VotingGuard({ children }) {
  const voting = useSelector(myDemocracyVotingSelector);
  if (!voting) {
    throw new Error(
      "DelegatedVoteLock should only be called when voting loaded",
    );
  }

  return children;
}
