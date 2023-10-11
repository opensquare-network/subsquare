import { useOnchainData } from "next-common/context/post";
import KvList from "../listInfo/kvList";
import Proposal from "../proposal";
import extractKintsugiFields from "next-common/components/democracy/common/kintsugiCallFields";
import { useChain } from "next-common/context/chain";
import Copyable from "../copyable";
import usePreImageCallFromHash from "../proposal/preImage";

export default function DemocracyPublicProposalCall({
  call,
  shorten,
  proposalIndex,
  referendumIndex,
}) {
  const onchainData = useOnchainData();
  const chain = useChain();
  const preImageHash = onchainData.preImage?.hash;
  const { call: rawCall, isLoading: isLoadingRawCall } =
    usePreImageCallFromHash(preImageHash);

  const data = [
    ["Hash", <Copyable key="hash">{onchainData?.hash}</Copyable>],
    [
      <Proposal
        key={"call"}
        call={call}
        rawCall={rawCall}
        isLoadingRawCall={isLoadingRawCall}
        shorten={shorten}
        proposalIndex={proposalIndex}
        referendumIndex={referendumIndex}
      />,
    ],
    ...extractKintsugiFields(chain, call),
  ];
  return <KvList data={data} />;
}
