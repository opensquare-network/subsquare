import HintMessage from "next-common/components/styled/hintMessage";
import { useSelector } from "react-redux";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import User from "next-common/components/user";

export default function DelegationHint() {
  const voting = useSelector(myDemocracyVotingSelector);
  const { target } = voting;

  return (
    <HintMessage style={{ display: "inline-flex" }}>
      You are delegating votes to &nbsp;
      <User add={target} fontSize={12} linkToVotesPage />
    </HintMessage>
  );
}
