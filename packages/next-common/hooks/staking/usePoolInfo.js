import useSubStorage from "../common/useSubStorage";

export function usePoolInfo(poolId) {
  const { result, loading } = useSubStorage("nominationPools", "bondedPools", [
    poolId,
  ]);
  return {
    poolInfo: result?.toJSON(),
    loading,
  };
}
