/* eslint-disable react/jsx-key */
import User from "next-common/components/user";
import KVList from "next-common/components/listInfo/kvList";
import ExtrinsicLinks from "next-common/components/links";
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
        <ExtrinsicLinks address={tip?.meta?.finder} style={{ marginLeft: 8 }} />
      </>,
    ],
    [
      "Beneficiary",
      <>
        <User add={tip?.meta?.who} fontSize={14} />
        <ExtrinsicLinks address={tip?.meta?.who} style={{ marginLeft: 8 }} />
      </>,
    ],
  ];

  return <KVList title="Metadata" data={metadata} showFold />;
}
