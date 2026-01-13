import { backendApi } from "next-common/services/nextApi";

export async function fetchDetailComments(url, context) {
  const { page, page_size: pageSize } = context.query;
  const { result: comments } = await backendApi.fetch(url, {
    page: page ?? "last",
    pageSize: pageSize ?? 200,
  });

  return comments;
}
