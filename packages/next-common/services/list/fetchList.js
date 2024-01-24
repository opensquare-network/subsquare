import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";

export async function fetchList(url, context) {
  const { page, page_size: pageSize } = context.query;
  const { result } = await nextApi.fetch(url, {
    page: page ?? 1,
    pageSize: pageSize ?? defaultPageSize,
    simple: true,
  });

  return result ?? EmptyList;
}
