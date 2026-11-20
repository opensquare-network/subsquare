import { useEffect, useMemo, useState } from "react";
import getStorageLink from "next-common/utils/env/storageLink";

export default function useBannerUrl(bannerCid, defaultBannerUrl) {
  const bannerUrl = useMemo(
    () => (bannerCid ? getStorageLink(bannerCid) : null),
    [bannerCid],
  );
  const [isBannerLoaded, setIsBannerLoaded] = useState(false);

  useEffect(() => {
    setIsBannerLoaded(false);
    if (!bannerUrl) {
      return;
    }

    let isCancelled = false;
    const image = new window.Image();
    image.onload = () => {
      if (!isCancelled) {
        setIsBannerLoaded(true);
      }
    };
    image.src = bannerUrl;

    return () => {
      isCancelled = true;
      image.onload = null;
    };
  }, [bannerUrl]);

  return bannerUrl && isBannerLoaded ? bannerUrl : defaultBannerUrl;
}
