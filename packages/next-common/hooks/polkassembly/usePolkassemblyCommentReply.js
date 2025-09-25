import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";

export function usePolkassemblyCommentReply({
  polkassemblyId,
  polkassemblyPostType = "discussion",
}) {
  const { value, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch(
      `polkassembly-comments/${polkassemblyPostType}/${polkassemblyId}/replies`,
    );
    return result;
  });

  return {
    polkassemblyCommentReplies: value,
    isPolkassemblyCommentRepliesLoading: loading,
  };
}
