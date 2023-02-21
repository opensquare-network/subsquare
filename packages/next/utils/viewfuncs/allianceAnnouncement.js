import { getPostUpdatedAt } from "./common";

function getAnnouncementId(height, cid) {
  return `${ height }_${ cid }`;
}

export default function normalizeAllianceAnnouncement(item = {}) {
  const { onchainData = {} } = item;
  return {
    ...item,
    title: item.title || item.cid,
    address: item.proposer,
    status: onchainData.state?.state ?? "Unknown",
    detailLink: `/alliance/announcement/${ getAnnouncementId(item.height, item.cid) }`,
    time: getPostUpdatedAt(item),
  };
}
