import { useOnchainData } from "next-common/context/post";
import useVoteCalls from "next-common/hooks/useVoteCalls";

export default function useOpenGovFetchVoteCalls() {
  const { referendumIndex } = useOnchainData();
  const { result, isLoading } = useVoteCalls(referendumIndex);

  return { result, isLoading };
}
