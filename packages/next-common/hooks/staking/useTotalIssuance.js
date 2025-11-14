import useSubStorage from "../common/useSubStorage";

export function useTotalIssuance() {
  const { loading, result } = useSubStorage("balances", "totalIssuance", []);
  const totalIssuance = result?.toJSON();
  return {
    loading,
    totalIssuance,
  };
}
