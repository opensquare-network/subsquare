import { getPostLastActivityAt } from "../postUpdatedTime";

function getAnnouncementId(height, cid) {
  return `${height}_${cid}`;
}

export default function normalizeAllianceAnnouncement(item = {}) {
  const { onchainData = {} } = item;
  return {
    ...item,
    title: item.title || item.cid,
    address: item.proposer,
    status: onchainData.state?.state ?? "Unknown",
    detailLink: `/alliance/announcements/${getAnnouncementId(
      item.height,
      item.cid,
    )}`,
    time: getPostLastActivityAt(item),
  };
}
