import { AvatarContextProvider } from "next-common/context/avatar";
import nextApi from "next-common/services/nextApi";
import { delegationDemocracyDelegatesAddressApi } from "next-common/services/url";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useAsync } from "react-use";
import MemberCardListContainer from "../../common/cardListContainer";
import DemocracyDelegateCard from "../../democracy/card";
import Announcement from "./announcement";
import { useSelector } from "react-redux";
import { democracyDelegatesTriggerUpdateSelector } from "next-common/store/reducers/democracy/delegates";

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
  const triggerUpdate = useSelector(democracyDelegatesTriggerUpdateSelector);

  const state = useAsync(async () => {
    return await nextApi
      .fetch(delegationDemocracyDelegatesAddressApi(realAddress))
      .then((resp) => {
        if (resp.result) {
          return resp.result;
        }
      });
  }, [realAddress, triggerUpdate]);

  return (
    <>
      <Announcement myDelegation={state.value} />
      <MyDelegationCard myDelegation={state.value} />
    </>
  );
}
