// scheme: https://docs.discourse.org/

import getChainSettings from "next-common/utils/consts/settings";
import { ssrNextApi } from "../nextApi";

export async function fetchForumLatestTopics() {
  const { hasDiscussionsForumTopics } = getChainSettings(process.env.CHAIN);
  if (!hasDiscussionsForumTopics) {
    return { items: [] };
  }
  const { result: items } = await ssrNextApi.fetch("forum/posts");
  return { items: items || [] };
}

export async function fetchForumCategories() {
  const { hasDiscussionsForumTopics } = getChainSettings(process.env.CHAIN);
  if (!hasDiscussionsForumTopics) {
    return { items: [] };
  }
  const { result: items } = await ssrNextApi.fetch("forum/categories");
  return { items: items || [] };
}
