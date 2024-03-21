import MemberCardListContainer from "next-common/components/delegation/delegate/common/cardListContainer";
import DemocracyDelegateCard from "./card";
import { useMemo } from "react";
import { AvatarContextProvider } from "next-common/context/avatar";

export default function Delegates({ delegates = [] }) {
  const addressAvatarMap = useMemo(
    () =>
      new Map(delegates.map((item) => [item.address, item.manifesto?.image])),
    [delegates],
  );

  return (
    <AvatarContextProvider addressAvatarMap={addressAvatarMap}>
      <MemberCardListContainer>
        {delegates.map((delegate, idx) => (
          <DemocracyDelegateCard key={idx} delegate={delegate} />
        ))}
      </MemberCardListContainer>
    </AvatarContextProvider>
  );
}
