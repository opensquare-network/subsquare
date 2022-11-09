import React from "react";
import BaseLayout from "./baseLayout";
import DetailPageWrapper from "../styled/detailPageWrapper";

// For detail page without right components
export default function DetailLayout({ children, seoInfo }) {
  return (
    <BaseLayout seoInfo={seoInfo}>
      <DetailPageWrapper className="post-content">{children}</DetailPageWrapper>
    </BaseLayout>
  );
}
