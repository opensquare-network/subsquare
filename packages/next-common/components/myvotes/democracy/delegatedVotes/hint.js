import HintMessage from "next-common/components/styled/hintMessage";
import { useSelector } from "react-redux";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import AddressUser from "next-common/components/user/addressUser";

export default function DelegationHint({ style = {} }) {
  const voting = useSelector(myDemocracyVotingSelector);
  const { target } = voting;

  return (
    <HintMessage
      style={{
        display: "inline-flex",
        ...style,
      }}
    >
      You are delegating votes to &nbsp;
      <AddressUser add={target} fontSize={12} link="/votes" />
    </HintMessage>
  );
}
