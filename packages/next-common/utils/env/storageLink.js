import { CID } from "multiformats";

export function convertToCidV0(cid) {
  try {
    return CID.parse(cid).toV0().toString();
  } catch {
    // Keep CIDv1 and non-CID storage keys unchanged.
    return cid;
  }
}

export default function getStorageLink(cid) {
  const endpoint = process.env.NEXT_PUBLIC_PREVIEW_IMG_ENDPOINT;

  return `${endpoint}/${convertToCidV0(cid)}`;
}
