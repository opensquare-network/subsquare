import { useState, useMemo } from "react";
import nextApi from "next-common/services/nextApi";
import useRefCallback from "next-common/hooks/useRefCallback";

function useReferendaSearchResults() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useRefCallback(async (searchValue) => {
    try {
      setIsLoading(true);
      const { result } = await nextApi.fetch("search", {
        text: searchValue,
      });
      setResults(result?.openGovReferenda || []);
    } finally {
      setIsLoading(false);
    }
  });

  const referenda = useMemo(() => {
    return (
      results?.map((item) => ({
        index: item?.referendumIndex ?? 0,
        title: item?.title ?? "-",
        content: item?.contentSummary?.summary ?? "-",
      })) ?? null
    );
  }, [results]);

  return { referenda, fetch, isLoading, setReferenda: setResults };
}

export default useReferendaSearchResults;
