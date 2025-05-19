import { useCallback } from "react";
import { CachedBatchProvider } from "next-common/context/batch";
import nextApi from "next-common/services/nextApi";
import { isEmpty } from "lodash-es";

export async function getFellowshipReferendaPosts(indexes = []) {
  if (isEmpty(indexes)) {
    return [];
  }
  const q = indexes.join(",");
  const { result } = await nextApi.fetch(
    `fellowship/referenda?simple=1&referendum_index=${q}`,
  );
  return result || [];
}

export function ReferendaTitleProvider({ children }) {
  const fetchReferendaList = useCallback(async (referendumIndexes) => {
    const posts = await getFellowshipReferendaPosts(referendumIndexes);
    const referendaMap = Object.fromEntries(
      posts.map((item) => [item.referendumIndex, item]),
    );
    return referendumIndexes.map((i) => referendaMap[i]);
  }, []);

  return (
    <CachedBatchProvider delay={200} batchExecFn={fetchReferendaList}>
      {children}
    </CachedBatchProvider>
  );
}
