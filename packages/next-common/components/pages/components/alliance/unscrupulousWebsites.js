import React from "react";
import MemberListTable from "next-common/components/memberListTable";

export default function UnscrupulousWebsites({ items, loading = false }) {
  const columns = [{ name: "URL", style: { textAlign: "left" } }];

  const rows = items.map((item) => [item.url]);

  return (
    <MemberListTable
      columns={columns}
      rows={rows}
      loading={loading}
      noDataText="No current websites"
    />
  );
}
