import KvList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";
import { useOnchainData } from "next-common/context/post";

export default function Gov2ReferendumCall() {
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};

  const data = [
    ["Proposal Hash", onchainData?.proposalHash],
    [
      <Proposal
        key={"call"}
        call={proposal?.call}
        shorten={proposal?.shorten}
      />,
    ],
  ];

  return <KvList data={data} />;
}
