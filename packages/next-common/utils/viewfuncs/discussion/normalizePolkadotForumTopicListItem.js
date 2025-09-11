import getChainSettings from "next-common/utils/consts/settings";
import { removeTrailingSlash } from "next-common/utils/url";

export default function normalizePolkadotForumTopicListItem(item) {
  const chainSettings = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);

  return {
    ...item,
    title: item.topic_title,
    time: item.updated_at || item.created_at,
    detailLink: `${removeTrailingSlash(
      chainSettings.integrations?.discourseForum?.link,
    )}/t/${item.topic_slug}/${item.topic_id}`,
  };
}
