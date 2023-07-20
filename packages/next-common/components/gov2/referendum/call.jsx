import DetailMultiTabCall from "next-common/components/detail/detailMultiTabCall";
import { useOnchainData } from "next-common/context/post";

export default function ReferendaCall() {
  const onchainData = useOnchainData();
  const proposal = onchainData?.proposal ?? {};

  return (
    <DetailMultiTabCall call={proposal?.call} shorten={proposal.shorten} />
  );
}
