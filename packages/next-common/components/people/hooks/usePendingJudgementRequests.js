import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";

export default function usePendingJudgementRequests(page, pageSize) {
  return useAsync(async () => {
    if (!page || page < 1 || !pageSize || pageSize < 1) {
      return null;
    }

    const { result } = await backendApi.fetch(
      `people/judgement/requests/pending?page=${page}&pageSize=${pageSize}`,
    );

    return result || null;
  }, [page, pageSize]);
}
