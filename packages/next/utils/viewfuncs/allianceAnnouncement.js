import { getPostLastActivityAt } from "next-common/utils/viewfuncs/postUpdatedTime";

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
    detailLink: `/alliance/announcement/${getAnnouncementId(
      item.height,
      item.cid
    )}`,
    time: getPostLastActivityAt(item),
  };
}
