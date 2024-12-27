import { AvatarContextProvider } from "next-common/context/avatar";
import MemberCardListContainer from "../../common/cardListContainer";
import DemocracyDelegateCard from "../../democracy/card";
import Announcement from "./announcement";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useAddressDelegation from "./useAddressDelegation";

function MyDelegationCard({ myDelegation }) {
  if (!myDelegation) {
    return null;
  }

  const addressAvatarMap = new Map([
    [myDelegation.address, myDelegation.manifesto?.image],
  ]);

  return (
    <AvatarContextProvider addressAvatarMap={addressAvatarMap}>
      <MemberCardListContainer>
        <DemocracyDelegateCard
          delegate={myDelegation}
          showDelegateButton={false}
        />
      </MemberCardListContainer>
    </AvatarContextProvider>
  );
}

export default function DemocracyAnnouncement() {
  const realAddress = useRealAddress();
  const { value: myDelegation } = useAddressDelegation(realAddress);

  return (
    <>
      <Announcement myDelegation={myDelegation} />
      <MyDelegationCard myDelegation={myDelegation} />
    </>
  );
}
