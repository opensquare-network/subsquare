import MemberCardListContainer from "next-common/components/delegation/delegate/common/cardListContainer";
import ReferendaDelegateCard from "next-common/components/delegation/delegate/referenda/card";

export default function Delegates({ delegates = [] }) {
  return (
    <MemberCardListContainer>
      {delegates.map((delegate, idx) => (
        <ReferendaDelegateCard key={idx} delegate={delegate} />
      ))}
    </MemberCardListContainer>
  );
}
