import User from "next-common/components/user";
import KVList from "next-common/components/listInfo/kvList";
import ReasonLink from "next-common/components/reasonLink";
import { useEffect, useState } from "react";

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
        ["Hash", tip?.hash],
        [
          "Finder",
          <User key="finder" add={tip?.finder} fontSize={14} />,
        ],
        [
          "Beneficiary",
          <User key="beneficiary" add={tip?.meta?.who} fontSize={14} />,
        ],
      ]),
    [tip],
  );

  return <KVList title="Metadata" data={metadata} showFold />;
}
