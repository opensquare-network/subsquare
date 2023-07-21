import { useOnchainData } from "next-common/context/post";
import KvList from "../listInfo/kvList";
import Proposal from "../proposal";

export default function DemocracyPublicProposalCall({
  call,
  shorten,
  proposalIndex,
  referendumIndex,
}) {
  const onchainData = useOnchainData();

  const data = [
    ["Hash", onchainData?.hash],
    [
      <Proposal
        key={"call"}
        call={call}
        shorten={shorten}
        proposalIndex={proposalIndex}
        referendumIndex={referendumIndex}
      />,
    ],
  ];
  return <KvList data={data} />;
}
