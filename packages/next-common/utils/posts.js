import { isEmpty, omit } from "lodash-es";
import { backendApi } from "next-common/services/nextApi";

export async function getOpenGovReferendaPosts(indexes = [], params = {}) {
  if (isEmpty(indexes)) {
    return [];
  }

  const q = indexes.map((i) => `referendum_index=${i}`).join("&");
  // fixme: we should set timeout for any fetch
  const { result: { items } = {} } = await backendApi.fetch(
    `gov2/referendums?${q}`,
    {
      ...params,
      simple: 1,
      page_size: indexes.length,
    },
  );
  return (items || []).map((item) => omit(item, ["_id"]));
}
