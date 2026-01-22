import { backendApi } from "next-common/services/nextApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useAsync } from "react-use";

export default function useMyJudgementRequest() {
  const realAddress = useRealAddress();

  return useAsync(async () => {
    if (!realAddress) {
      return null;
    }

    const { result } = await backendApi.fetch(
      `people/identities/${realAddress}/active-request`,
    );
    if (result) {
      return result || null;
    }

    return null;
  }, [realAddress]);
}
