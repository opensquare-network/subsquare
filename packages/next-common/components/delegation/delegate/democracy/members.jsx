import MemberCardListContainer from "next-common/components/delegation/delegate/common/cardListContainer";
import DemocracyDelegateCard from "./card";

export default function Delegates({ delegates = [] }) {
  return (
    <MemberCardListContainer>
      {delegates.map((delegate, idx) => (
        <DemocracyDelegateCard key={idx} delegate={delegate} />
      ))}
    </MemberCardListContainer>
  );
}
