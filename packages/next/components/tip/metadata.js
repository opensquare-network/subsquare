/* eslint-disable react/jsx-key */
import User from "next-common/components/user";
import KVList from "next-common/components/listInfo/kvList";
import ReasonLink from "next-common/components/reasonLink";

export default function TipMetadata({ tip }) {
  const metadata = [
    [
      "Reason",
      <div>
        <ReasonLink text={tip?.meta?.reason} />
      </div>,
    ],
    ["Hash", tip?.hash],
    [
      "Finder",
      <>
        <User add={tip?.finder} fontSize={14} />
      </>,
    ],
    [
      "Beneficiary",
      <>
        <User add={tip?.meta?.who} fontSize={14} />
      </>,
    ],
  ];

  return <KVList title="Metadata" data={metadata} showFold />;
}
