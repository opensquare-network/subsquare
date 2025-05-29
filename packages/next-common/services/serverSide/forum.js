// scheme: https://docs.discourse.org/

import getChainSettings from "next-common/utils/consts/settings";
import { backendApi } from "../nextApi";

export async function fetchForumLatestTopics() {
  const { integrations } = getChainSettings(process.env.CHAIN);
  if (!integrations?.discourseForum) {
    return { items: [] };
  }
  const { result: items } = await backendApi.fetch("forum/posts");
  return { items: items || [] };
}

export async function fetchForumCategories() {
  const { integrations } = getChainSettings(process.env.CHAIN);
  if (!integrations?.discourseForum) {
    return { items: [] };
  }
  const { result: items } = await backendApi.fetch("forum/categories");
  return { items: items || [] };
}
