import React from "react";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

export default function MemberSummary({ fellow, ally, retiring }) {
  return (
    <SummaryLayout>
      <SummaryItem title="Fellow">{fellow || 0}</SummaryItem>
      <SummaryItem title="Ally">{ally || 0}</SummaryItem>
      <SummaryItem title="Retiring">{retiring || 0}</SummaryItem>
    </SummaryLayout>
  );
}
