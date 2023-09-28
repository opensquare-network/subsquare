import isEmpty from "lodash.isempty";
import nextApi from "next-common/services/nextApi";
import omit from "lodash.omit";

export default async function getOpenGovReferendaPosts(indexes = []) {
  if (isEmpty(indexes)) {
    return [];
  }

  const q = indexes.map((i) => `referendum_index=${i}`).join("&");
  // fixme: we should set timeout for any fetch
  const { result: { items } = {} } = await nextApi.fetch(
    `gov2/referendums?${q}&page_size=${indexes.length}`,
  );
  return items.map((item) => omit(item, ["_id"]));
}
