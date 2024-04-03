import { useEffect, useState } from "react";
import Announcement from "./announcement";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import nextApi from "next-common/services/nextApi";
import { delegationReferendaDelegatesAddressApi } from "next-common/services/url";
import ReferendaDelegateCard from "../../referenda/card";
import MemberCardListContainer from "../../common/cardListContainer";
import { AvatarContextProvider } from "next-common/context/avatar";

export default function ReferendaAnnouncement() {
  const [data, setData] = useState();
  const realAddress = useRealAddress();

  useEffect(() => {
    nextApi
      .fetch(delegationReferendaDelegatesAddressApi(realAddress))
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
          <ReferendaDelegateCard delegate={data} showDelegateButton={false} />
        </MemberCardListContainer>
      </AvatarContextProvider>
    );
  }

  return <Announcement />;
}
