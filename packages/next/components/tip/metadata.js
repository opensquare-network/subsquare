/* eslint-disable react/jsx-key */
import User from "next-common/components/user";
import KVList from "next-common/components/listInfo/kvList";
import Links from "next-common/components/links";
import ReasonLink from "next-common/components/reasonLink";

export default function TipMetadata({ tip, chain }) {
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
        <User chain={chain} add={tip?.finder} fontSize={14} />
        <Links
          chain={chain}
          address={tip?.meta?.finder}
          style={{ marginLeft: 8 }}
        />
      </>,
    ],
    [
      "Beneficiary",
      <>
        <User chain={chain} add={tip?.meta?.who} fontSize={14} />
        <Links
          chain={chain}
          address={tip?.meta?.who}
          style={{ marginLeft: 8 }}
        />
      </>,
    ],
  ];

  return <KVList title="Metadata" data={metadata} showFold />;
}
