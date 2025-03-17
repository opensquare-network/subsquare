import { useSalaryFellowshipPallet } from "next-common/context/collectives/collectives";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSalaryClaimant(address) {
  const pallet = useSalaryFellowshipPallet();
  const { result, loading } = useSubStorage(pallet, "claimant", [address]);
  return { claimant: result?.toJSON(), isLoading: loading };
}
