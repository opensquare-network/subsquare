import LayoutBase from "./layoutBase";
import DetailPageWrapper from "../styled/detailPageWrapper";

// For detail page without right components
export default function DetailLayout({ user, children, isWeb3Login, seoInfo }) {
  return (
    <LayoutBase user={user} isWeb3Login={isWeb3Login} seoInfo={seoInfo}>
      <DetailPageWrapper className="post-content">{children}</DetailPageWrapper>
    </LayoutBase>
  );
}
