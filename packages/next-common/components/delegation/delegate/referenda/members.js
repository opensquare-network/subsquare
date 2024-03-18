import MemberCardListContainer from "next-common/components/delegation/delegate/common/cardListContainer";
import ReferendaDelegateCard from "next-common/components/delegation/delegate/referenda/card";
import { AvatarContextProvider } from "next-common/context/avatar";
import { useMemo } from "react";

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
          <ReferendaDelegateCard key={idx} delegate={delegate} />
        ))}
      </MemberCardListContainer>
    </AvatarContextProvider>
  );
}
