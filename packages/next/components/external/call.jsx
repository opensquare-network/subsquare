import Copyable from "next-common/components/copyable";
import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { useOnchainData } from "next-common/context/post";
import usePreImageCallFromHash from "next-common/components/proposal/preImage";

export default function DemocracyExternalProposalCall({
  call,
  shorten,
  motionIndex,
  referendumIndex,
}) {
  const onchainData = useOnchainData();
  const preImageHash = onchainData.preImage?.hash;
  const { call: rawCall, isLoading: isLoadingRawCall } =
    usePreImageCallFromHash(preImageHash);

  const data = [
    ["Hash", <Copyable key="hash">{onchainData?.proposalHash}</Copyable>],
    [
      <Proposal
        key={"call"}
        call={call}
        rawCall={rawCall}
        isLoadingRawCall={isLoadingRawCall}
        shorten={shorten}
        motionIndex={motionIndex}
        referendumIndex={referendumIndex}
      />,
    ],
  ];
  return <KvList data={data} />;
}
