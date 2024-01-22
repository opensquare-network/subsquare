import { useOnchainData } from "next-common/context/post";

export default function useIsDemocracyProposalFinished() {
  const onchainData = useOnchainData();
  return ["Tabled", "Canceled", "Cleared", "Removed"].includes(
    onchainData?.state?.state,
  );
}
