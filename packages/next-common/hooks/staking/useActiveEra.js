import useSubStorage from "next-common/hooks/common/useSubStorage";

export function useActiveEra() {
  const { result, loading } = useSubStorage("staking", "activeEra");
  const activeEra = result?.toJSON();

  return {
    activeEra,
    loading,
  };
}
