import * as isIPFS from "is-ipfs";

export default function getAnnouncementBreadcrumbName(id = "", announcement = {}) {
  const cid = announcement?.cid;
  if (cid) {
    return `${ cid.slice(0, 4) }...${ cid.slice(-4) }`;
  }

  const maybeCid = id?.split("_").pop();
  if (isIPFS.cid(maybeCid)) {
    return `${ cid.slice(0, 4) }...${ cid.slice(-4) }`;
  }

  return `${ id.slice(0, 4) }...`;
}
