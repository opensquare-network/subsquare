import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { useOnchainData } from "next-common/context/post";

export default function DemocracyExternalProposalCall({
  call,
  shorten,
  motionIndex,
  referendumIndex,
}) {
  const onchainData = useOnchainData();

  const data = [
    ["Hash", onchainData?.proposalHash],
    [
      <Proposal
        key={"call"}
        call={call}
        shorten={shorten}
        motionIndex={motionIndex}
        referendumIndex={referendumIndex}
      />,
    ],
  ];
  return <KvList data={data} />;
}
