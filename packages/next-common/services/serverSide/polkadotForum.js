import uniqBy from "lodash.uniqby";
import { ssrNextApi } from "../nextApi";

const URL = "https://forum.polkadot.network/posts.json";

export async function fetchPolkadotForumLatestTopics() {
  const { result } = await ssrNextApi.fetch(URL);
  return { items: uniqBy(result?.latest_posts, "topic_id") || [] };
}
