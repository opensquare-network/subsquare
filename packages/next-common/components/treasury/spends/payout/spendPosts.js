import { chunk, isNil } from "lodash-es";
import nextApi from "next-common/services/nextApi";

const POSTS_PAGE_SIZE = 200;

export async function fetchTreasurySpendPosts(indexes = []) {
  const chunks = chunk(indexes, POSTS_PAGE_SIZE);
  const results = await Promise.all(
    chunks.map(async (chunkIndexes) => {
      const { result } = await nextApi.fetch("treasury/spends", {
        page: 1,
        pageSize: chunkIndexes.length,
        simple: true,
        valid_only: true,
        ids: chunkIndexes.join(","),
      });
      return result?.items ?? [];
    }),
  );

  return results.flat().filter((item) => !isNil(item?.index));
}
