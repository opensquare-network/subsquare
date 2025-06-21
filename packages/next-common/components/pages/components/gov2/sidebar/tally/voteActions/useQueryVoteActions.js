import { gov2ReferendaVoteActionsApi } from "next-common/services/url";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";

export default function useQueryVoteActions(referendumIndex) {
  const { value, loading } = useAsync(async () => {
    if (!referendumIndex) {
      return [];
    }

    const res = await backendApi.fetch(
      gov2ReferendaVoteActionsApi(referendumIndex),
    );
    return res?.result ?? [];
  }, [referendumIndex]);

  return {
    voteActions: value,
    loading,
  };
}
