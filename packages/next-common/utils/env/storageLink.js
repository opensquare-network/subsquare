export default function getStorageLink(cid) {
  const endpoint = process.env.NEXT_PUBLIC_PREVIEW_IMG_ENDPOINT;

  return `${endpoint}/${cid}`;
}
