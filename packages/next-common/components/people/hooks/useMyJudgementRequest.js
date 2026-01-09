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
      `people/judgement/requests/pending?who=${realAddress}`,
    );
    if (result) {
      return result;
    }

    return null;
  }, [realAddress]);
}
