import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import { calcSupplyHistory } from "./supplyHistory";

async function fetchSupplyHistory() {
  const { result, error } = await backendApi.fetch("dap/total-issuance");
  if (error) {
    throw new Error(error.message || "Failed to fetch supply history");
  }
  return calcSupplyHistory(result);
}

export default function useSupplyHistory() {
  const supply = useAsync(fetchSupplyHistory, []);

  return { supply };
}
