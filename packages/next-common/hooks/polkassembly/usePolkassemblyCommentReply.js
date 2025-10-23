import { backendApi } from "next-common/services/nextApi";
import React, { createContext, useCallback, useEffect, useState } from "react";

const PolkassemblyCommentRepliesContext = createContext();

export function PolkassemblyCommentRepliesProvider({
  children,
  polkassemblyId,
  polkassemblyPostType = "discussion",
}) {
  const defaultLoading = polkassemblyId && polkassemblyPostType;
  const [polkassemblyCommentReplies, setPolkassemblyCommentReplies] =
    useState(null);
  const [
    isPolkassemblyCommentRepliesLoading,
    setIsPolkassemblyCommentRepliesLoading,
  ] = useState(defaultLoading);

  const fetchPolkassemblyCommentReplies = useCallback(async () => {
    try {
      const { result } = await backendApi.fetch(
        `polkassembly-comments/${polkassemblyPostType}/${polkassemblyId}/replies`,
      );
      setPolkassemblyCommentReplies(result);
    } finally {
      setIsPolkassemblyCommentRepliesLoading(false);
    }
  }, [polkassemblyId, polkassemblyPostType]);

  useEffect(() => {
    if (polkassemblyId && polkassemblyPostType) {
      fetchPolkassemblyCommentReplies();
    }
  }, [fetchPolkassemblyCommentReplies, polkassemblyPostType, polkassemblyId]);

  return (
    <PolkassemblyCommentRepliesContext.Provider
      value={{
        polkassemblyCommentReplies,
        fetchPolkassemblyCommentReplies,
        isPolkassemblyCommentRepliesLoading,
      }}
    >
      {children}
    </PolkassemblyCommentRepliesContext.Provider>
  );
}

export function usePolkassemblyCommentRepliesContext() {
  return React.useContext(PolkassemblyCommentRepliesContext) || {};
}
