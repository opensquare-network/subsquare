import MemberCardListContainer from "next-common/components/delegation/delegate/common/cardListContainer";
import DemocracyDelegateCard from "./card";
import { useMemo } from "react";
import { AvatarContextProvider } from "next-common/context/avatar";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMyDemocracyDelegation } from "../myDelegationSection/publicAnnouncement/useAddressDelegation";

function MyDelegationCard() {
  const myDelegation = useMyDemocracyDelegation();
  if (!myDelegation) {
    return null;
  }
  return (
    <DemocracyDelegateCard delegate={myDelegation} showDelegateButton={false} />
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
            <DemocracyDelegateCard key={idx} delegate={delegate} />
          ))}
      </MemberCardListContainer>
    </AvatarContextProvider>
  );
}
