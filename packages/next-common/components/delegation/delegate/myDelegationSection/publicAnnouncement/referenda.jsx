import { AvatarContextProvider } from "next-common/context/avatar";
import MemberCardListContainer from "../../common/cardListContainer";
import ReferendaDelegateCard from "../../referenda/card";
import Announcement from "./announcement";
import useAddressDelegation from "./useAddressDelegation";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

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
        <ReferendaDelegateCard
          delegate={myDelegation}
          showDelegateButton={false}
        />
      </MemberCardListContainer>
    </AvatarContextProvider>
  );
}

export default function ReferendaAnnouncement() {
  const realAddress = useRealAddress();
  const { value: myDelegation } = useAddressDelegation(realAddress);

  return (
    <>
      <Announcement myDelegation={myDelegation} />
      <MyDelegationCard myDelegation={myDelegation} />
    </>
  );
}
