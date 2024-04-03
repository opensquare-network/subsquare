import { AvatarContextProvider } from "next-common/context/avatar";
import nextApi from "next-common/services/nextApi";
import { delegationDemocracyDelegatesAddressApi } from "next-common/services/url";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useState } from "react";
import MemberCardListContainer from "../../common/cardListContainer";
import DemocracyDelegateCard from "../../democracy/card";
import Announcement from "./announcement";

export default function DemocracyAnnouncement() {
  const [data, setData] = useState();
  const realAddress = useRealAddress();

  useEffect(() => {
    nextApi
      .fetch(delegationDemocracyDelegatesAddressApi(realAddress))
      .then((resp) => {
        if (resp.result) {
          setData(resp.result);
        }
      });
  }, [realAddress]);

  const addressAvatarMap = new Map([[data?.address, data?.manifesto?.image]]);

  if (data) {
    return (
      <AvatarContextProvider addressAvatarMap={addressAvatarMap}>
        <MemberCardListContainer>
          <DemocracyDelegateCard delegate={data} showDelegateButton={false} />
        </MemberCardListContainer>
      </AvatarContextProvider>
    );
  }

  return <Announcement />;
}
