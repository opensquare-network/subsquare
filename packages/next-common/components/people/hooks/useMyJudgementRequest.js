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
      `people/judgement/requests/pending?who=${"12ZBQqk7SD9qA7qPwpzAND6ZznXtgZuCMFWZr8xpdsVdbeva"}`,
    );
    if (result) {
      return result.items[0] || null;
    }

    return null;
  }, [realAddress]);
}
