import React from "react";
import BaseLayout from "./baseLayout";
import OutWrapper from "../styled/outWrapper";
import MainCard from "../styled/mainCard";

export default function DetailWithRightLayout({ user, children, seoInfo }) {
  return (
    <BaseLayout user={user} seoInfo={seoInfo}>
      <OutWrapper>
        <MainCard className="post-content">{children}</MainCard>
      </OutWrapper>
    </BaseLayout>
  );
}
