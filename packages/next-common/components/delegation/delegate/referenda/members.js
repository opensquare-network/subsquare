import MemberCardListContainer from "next-common/components/delegation/delegate/common/cardListContainer";
import ReferendaDelegateCard from "next-common/components/delegation/delegate/referenda/card";
import { AvatarContextProvider } from "next-common/context/avatar";
import { useMemo } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMyReferendaDelegation } from "../myDelegationSection/publicAnnouncement/useAddressDelegation";

function MyDelegationCard() {
  const myDelegation = useMyReferendaDelegation();
  if (!myDelegation) {
    return null;
  }
  return (
    <ReferendaDelegateCard delegate={myDelegation} showDelegateButton={false} />
  );
}

export default function Delegates({ page, delegates = [] }) {
  const realAddress = useRealAddress();

  const addressAvatarMap = useMemo(
    () =>
      new Map(delegates.map((item) => [item.address, item.manifesto?.image])),
    [delegates],
  );
  return (
    <AvatarContextProvider addressAvatarMap={addressAvatarMap}>
      <MemberCardListContainer>
        {page === 1 && <MyDelegationCard />}
        {delegates
          .filter((item) => page !== 1 || item.address !== realAddress)
          .map((delegate, idx) => (
            <ReferendaDelegateCard key={idx} delegate={delegate} />
          ))}
      </MemberCardListContainer>
    </AvatarContextProvider>
  );
}
