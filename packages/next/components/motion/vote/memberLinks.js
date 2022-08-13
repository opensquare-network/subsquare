import React, { memo } from "react";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import Link from "next/link";
import styled from "styled-components";
import SubLink from "next-common/components/styled/subLink";

const Anchor = styled(SubLink)`
  margin-top: 16px !important;
`;

function MemberLinks({ type }) {
  let obj = null;
  if (detailPageCategory.COUNCIL_MOTION === type) {
    obj = {
      url: "/council/members",
      name: "councilors",
    };
  } else if (detailPageCategory.TECH_COMM_MOTION === type) {
    obj = {
      url: "/techcomm/members",
      name: "members",
    };
  }

  if (!obj) {
    return null;
  }

  return (
    <Link href={obj.url} passHref>
      <Anchor>Check all {obj.name}</Anchor>
    </Link>
  );
}

export default memo(MemberLinks);
