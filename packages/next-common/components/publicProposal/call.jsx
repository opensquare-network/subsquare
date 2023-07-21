import { useOnchainData } from "next-common/context/post";
import KvList from "../listInfo/kvList";
import Proposal from "../proposal";
import extractKintsugiFields from "next-common/components/democracy/common/kintsugiCallFields";
import { useChain } from "next-common/context/chain";

export default function DemocracyPublicProposalCall({
  call,
  shorten,
  proposalIndex,
  referendumIndex,
}) {
  const onchainData = useOnchainData();
  const chain = useChain();

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
    ...extractKintsugiFields(chain, call),
  ];
  return <KvList data={data} />;
}
