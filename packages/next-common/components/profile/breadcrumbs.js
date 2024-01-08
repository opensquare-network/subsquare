import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import React from "react";
import { addressEllipsis } from "next-common/utils";

export default function ProfileBreadcrumbs({ id }) {
  const breadcrumbItems = [
    {
      content: "Profile",
    },
    {
      content: addressEllipsis(id),
    },
  ];

  return (
    <BreadcrumbWrapper>
      <Breadcrumb items={breadcrumbItems} />
    </BreadcrumbWrapper>
  );
}
