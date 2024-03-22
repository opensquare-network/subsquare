import React from "react";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";
import { addressEllipsis } from "next-common/utils";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { usePageProps } from "next-common/context/page";

export default function ProfileBreadcrumbs() {
  const { id } = usePageProps();
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
