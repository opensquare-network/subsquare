export function getBannerUrl(bannerCid) {
  return bannerCid && `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/ipfs/files/${bannerCid}`;
}
