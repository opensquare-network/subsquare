import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import { calcSupplyHistory } from "./supplyHistory";

async function fetchSupplyHistory(path, isMinted) {
  const { result, error } = await backendApi.fetch(path);
  if (error) {
    throw new Error(error.message || "Failed to fetch supply history");
  }
  return calcSupplyHistory(result, isMinted);
}

export default function useSupplyHistory() {
  const supply = useAsync(
    () => fetchSupplyHistory("dap/total-issuance", false),
    [],
  );
  const issuance = useAsync(
    () => fetchSupplyHistory("dap/issuance-minted", true),
    [],
  );

  return { supply, issuance };
}
