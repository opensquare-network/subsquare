import React from "react";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { addressEllipsis } from "next-common/utils";
import { tryConvertToEvmAddress } from "next-common/utils/hydradxUtil";

export default function ProfileBreadcrumbs({ id }) {
  const maybeEvmAddress = tryConvertToEvmAddress(id);
  const breadcrumbItems = [
    {
      content: "Profile",
    },
    {
      content: addressEllipsis(maybeEvmAddress),
    },
  ];

  return (
    <BreadcrumbWrapper>
      <Breadcrumb items={breadcrumbItems} />
    </BreadcrumbWrapper>
  );
}
