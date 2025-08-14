import React from "react";
import { usePageProps } from "next-common/context/page";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";

function getBreadcrumbItems(id) {
  return [
    {
      path: "/referenda",
      content: "Referenda",
    },
    {
      content: "Cohort",
    },
    {
      content: `#${id}`,
    },
  ];
}

export default function ReferendaBreadcrumb() {
  const { id } = usePageProps();
  return (
    <BreadcrumbWrapper>
      <Breadcrumb items={getBreadcrumbItems(id)} />
    </BreadcrumbWrapper>
  );
}
