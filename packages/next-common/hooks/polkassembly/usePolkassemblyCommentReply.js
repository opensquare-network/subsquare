import { backendApi } from "next-common/services/nextApi";
import React, { createContext, useCallback, useEffect, useState } from "react";
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

const PolkassemblyCommentRepliesContext = createContext();

export function PolkassemblyCommentRepliesProvider({
  children,
  polkassemblyId,
  polkassemblyPostType = "discussion",
}) {
  const [refetchCounter, setRefetchCounter] = useState(0);
  const { value, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch(
      `polkassembly-comments/${polkassemblyPostType}/${polkassemblyId}/replies`,
    );
    return result;
  }, [refetchCounter, polkassemblyId, polkassemblyPostType]);

  const [polkassemblyCommentReplies, setPolkassemblyCommentReplies] =
    useState(value);
  const [
    isPolkassemblyCommentRepliesLoading,
    setIsPolkassemblyCommentRepliesLoading,
  ] = useState(loading);

  useEffect(() => {
    if (!loading) {
      setIsPolkassemblyCommentRepliesLoading(loading);
      setPolkassemblyCommentReplies(value);
    }
  }, [value, loading]);

  const refetchPolkassemblyCommentReplies = useCallback(() => {
    setRefetchCounter((c) => c + 1);
  }, []);

  return (
    <PolkassemblyCommentRepliesContext.Provider
      value={{
        polkassemblyCommentReplies,
        refetchPolkassemblyCommentReplies,
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
