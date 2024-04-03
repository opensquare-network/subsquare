import { useEffect, useState } from "react";
import Delegates from "../../referenda/members";
import Announcement from "./announcement";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import nextApi from "next-common/services/nextApi";
import { delegationReferendaDelegatesAddressApi } from "next-common/services/url";

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

  if (data) {
    return <Delegates delegates={[data]} />;
  }

  return <Announcement />;
}
