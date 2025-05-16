import KVList from "next-common/components/listInfo/kvList";
import ReasonLink from "next-common/components/reasonLink";
import { useEffect, useState } from "react";
import Copyable from "next-common/components/copyable";
import AddressUser from "next-common/components/user/addressUser";

export default function TipMetadata({ tip }) {
  const [metadata, setMetadata] = useState([]);
  useEffect(
    () =>
      setMetadata([
        [
          "Reason",
          <div key="reason">
            <ReasonLink text={tip?.meta?.reason} />
          </div>,
        ],
        ["Hash", <Copyable key="hash">{tip?.hash}</Copyable>],
        ["Finder", <AddressUser key="finder" add={tip?.finder} />],
        ["Beneficiary", <AddressUser key="beneficiary" add={tip?.meta?.who} />],
      ]),
    [tip],
  );

  return <KVList title="Metadata" data={metadata} showFold />;
}
