export default function normalizePolkadotForumTopicListItem(item) {
  return {
    ...item,
    title: item.topic_title,
    time: item.updated_at || item.created_at,
    detailLink: `https://forum.polkadot.network/t/${item.topic_slug}/${item.topic_id}`,
  };
}
