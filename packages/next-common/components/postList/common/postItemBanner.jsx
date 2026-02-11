import React, { useMemo } from "react";
import { MobileHiddenInfo, BannerWrapper } from "../styled";
import { getBannerUrl } from "next-common/utils/banner";

export default function PostItemBanner({ bannerCid }) {
  const bannerUrl = useMemo(() => getBannerUrl(bannerCid), [bannerCid]);
  if (!bannerUrl) {
    return null;
  }

  return (
    <MobileHiddenInfo>
      <BannerWrapper>
        {/* eslint-disable-next-line */}
        <img src={bannerUrl} alt="banner image" />
      </BannerWrapper>
    </MobileHiddenInfo>
  );
}
