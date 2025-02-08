import nextApi from "next-common/services/nextApi";
import { useCallback } from "react";
import { isEmpty, omit } from "lodash-es";
import { CachedBatchProvider } from "next-common/context/batch";

async function getFellowshipReferendaPosts(indexes = []) {
  if (isEmpty(indexes)) {
    return [];
  }

  const q = `referendum_index=${indexes.join(",")}`;
  // fixme: we should set timeout for any fetch
  const { result: items } = await nextApi.fetch(
    `fellowship/referenda?simple=1&${q}`,
  );
  return (items || []).map((item) => omit(item, ["_id"]));
}

export function ReferendaPostProvider({ children }) {
  const fetchReferendaList = useCallback(async (referendumIndexes) => {
    const posts = await getFellowshipReferendaPosts(referendumIndexes);
    const referendaMap = Object.fromEntries(
      posts.map((post) => [post.referendumIndex, post]),
    );
    return referendumIndexes.map((i) => referendaMap[i]);
  }, []);

  return (
    <CachedBatchProvider batchExecFn={fetchReferendaList}>
      {children}
    </CachedBatchProvider>
  );
}
