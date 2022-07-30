import LayoutBase from "./layoutBase";
import DetailPageWrapper from "../styled/detailPageWrapper";

// For detail page without right components
export default function DetailLayout({ user, children, seoInfo }) {
  return (
    <LayoutBase user={user} seoInfo={seoInfo}>
      <DetailPageWrapper className="post-content">{children}</DetailPageWrapper>
    </LayoutBase>
  );
}
