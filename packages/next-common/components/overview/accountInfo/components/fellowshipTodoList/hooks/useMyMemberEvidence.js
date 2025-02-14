import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useMyMemberEvidence() {
  const address = useRealAddress();
  const corePallet = useCoreFellowshipPallet();
  const { result: evidence, loading } = useSubStorage(
    corePallet,
    "memberEvidence",
    [address],
  );
  return {
    evidence,
    isLoading: loading,
  };
}
