import nextApi from "next-common/services/nextApi";
import { delegationDemocracyDelegatesAddressApi } from "next-common/services/url";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useState } from "react";
import Delegates from "../../democracy/members";
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

  if (data) {
    return <Delegates delegates={[data]} />;
  }

  return <Announcement />;
}
