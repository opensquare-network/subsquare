import { useDemocracyReferendumHash } from "next-common/hooks/democracy/useDemocracyReferendumHash";
import KvList from "../listInfo/kvList";
import Proposal from "../proposal";

export default function ReferendumCall({ call, shorten, onchainData = {} }) {
  const hash = useDemocracyReferendumHash();

  const data = [
    ["Hash", hash],
    [
      <Proposal
        key={"call"}
        call={call}
        shorten={shorten}
        referendumIndex={onchainData.referendumIndex}
      />,
    ],
  ];

  return <KvList data={data} />;
}
