import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubStorage from "../common/useSubStorage";

export function useMyPool() {
  const realAddress = useRealAddress();
  const { result, loading } = useSubStorage("nominationPools", "poolMembers", [
    realAddress,
  ]);
  return {
    myPool: result?.toJSON(),
    loading,
  };
}
