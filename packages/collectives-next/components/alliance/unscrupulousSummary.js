import React from "react";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

export default function UnscrupulousSummary({ accounts, websites }) {
  return (
    <SummaryLayout>
      <SummaryItem title="Accounts">{accounts || 0}</SummaryItem>
      <SummaryItem title="Websites">{websites || 0}</SummaryItem>
    </SummaryLayout>
  );
}
