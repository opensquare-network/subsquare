import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";

export default function useTreasuryProjects() {
  const { value: projects = [], loading } = useAsync(async () => {
    const { result } = await backendApi.fetch("/treasury/status/projects");
    return result || [];
  }, []);

  return { projects, loading };
}
