import styled from "styled-components";
import { getBannerUrl } from "next-common/utils/banner";
import { MobileHiddenInfo } from "./styled";

const BannerWrapper = styled.div`
  margin-top: 0 !important;
  margin-left: 16px;
  width: 120px;
  height: 67px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
  }
`;

export default function Banner({ data }) {
  if (!data) {
    return;
  }

  if (!data.bannerCid) {
    return;
  }

  const bannerUrl = getBannerUrl(data.bannerCid);

  return (
    <MobileHiddenInfo>
      <BannerWrapper>
        <img src={bannerUrl} alt="banner image" />
      </BannerWrapper>
    </MobileHiddenInfo>
  );
}
