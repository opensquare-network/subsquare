// scheme: https://docs.discourse.org/

import { ssrNextApi } from "../nextApi";

export async function fetchForumLatestTopics() {
  const { result: items } = await ssrNextApi.fetch("/polkadot-forum/posts");
  return { items };
}

export async function fetchForumCategories() {
  const { result: items } = await ssrNextApi.fetch(
    "/polkadot-forum/categories",
  );
  return { items };
}
