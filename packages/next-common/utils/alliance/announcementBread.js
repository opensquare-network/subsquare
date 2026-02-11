import { CID } from "multiformats/cid";

function isCID(value) {
  try {
    CID.parse(value);
    return true;
  } catch {
    return false;
  }
}

export default function getAnnouncementBreadcrumbName(
  id = "",
  announcement = {},
) {
  const cid = announcement?.cid;
  if (cid) {
    return `${cid.slice(0, 4)}...${cid.slice(-4)}`;
  }

  const maybeCid = id?.split("_").pop();
  if (isCID(maybeCid)) {
    return `${maybeCid.slice(0, 4)}...${maybeCid.slice(-4)}`;
  }

  return `${id.slice(0, 4)}...`;
}
