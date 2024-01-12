// scheme: https://docs.discourse.org/

import uniqBy from "lodash.uniqby";
import { ssrNextApi } from "../nextApi";
import getChainSettings from "next-common/utils/consts/settings";
import { CHAIN } from "next-common/utils/constants";
import difference from "lodash.difference";
import uniq from "lodash.uniq";

const { discussionsForumUrl } = getChainSettings(CHAIN);

export async function fetchForumLatestTopics() {
  const { result } = await ssrNextApi.fetch(
    discussionsForumUrl + "/posts.json",
  );
  return { items: uniqBy(result?.latest_posts, "topic_id") || [] };
}

export async function fetchForumCategories(postCategoryIds = []) {
  const { result } = await ssrNextApi.fetch(
    discussionsForumUrl + "/categories.json",
  );

  const categories = result?.category_list?.categories || [];
  const categoryIds = categories.map((category) => category.id);

  const missedIds = difference(
    uniq(postCategoryIds.concat(categoryIds)),
    categoryIds,
  );
  const missedCategories = (
    await Promise.all(
      missedIds.map((id) =>
        ssrNextApi.fetch(discussionsForumUrl + `/c/${id}/show.json`),
      ),
    )
  ).map(({ result }) => result.category);

  return { items: categories.concat(missedCategories) };
}
