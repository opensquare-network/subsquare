export default function getIpfsLink(cid) {
  const endpoint = process.env.NEXT_PUBLIC_PREVIEW_IMG_ENDPOINT || "https://subsquare.infura-ipfs.io/ipfs";
  return `${ endpoint }/${ cid }`;
}
