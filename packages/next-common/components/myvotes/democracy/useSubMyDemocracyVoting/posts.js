import { isEmpty } from "lodash-es";
import { backendApi } from "next-common/services/nextApi";

export default async function getReferendaPosts(indexes = []) {
  if (isEmpty(indexes)) {
    return [];
  }

  const q = indexes.map((i) => `referendum_index=${i}`).join("&");
  // fixme: we should set timeout for any fetch
  const { result: { items } = {} } = await backendApi.fetch(
    `democracy/referendums?${q}&page_size=${indexes.length}`,
  );
  return items;
}
