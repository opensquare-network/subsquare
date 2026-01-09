import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";

export default function useYears() {
  const { value: years = [], loading } = useAsync(async () => {
    const result = await backendApi.fetch("/treasury/years");
    return result?.result || [];
  }, []);

  return { years: years.sort((a, b) => b.year - a.year), loading };
}
