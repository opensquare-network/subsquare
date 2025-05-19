import { backendApi } from "next-common/services/nextApi";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";

export async function fetchList(url, context, params = {}) {
  const { page, page_size: pageSize } = context.query;
  const { result } = await backendApi.fetch(url, {
    ...(params || {}),
    page: page ?? 1,
    pageSize: pageSize ?? defaultPageSize,
    simple: true,
  });

  return result ?? EmptyList;
}
