import React from "react";
import MemberListTable from "next-common/components/memberListTable";
import AddressUser from "next-common/components/user/addressUser";

export default function UnscrupulousAccounts({ items, loading = false }) {
  const columns = [{ name: "NAME", style: { textAlign: "left" } }];

  const rows = items.map((item) => [
    <AddressUser key={item.address} add={item.address} />,
  ]);

  return (
    <MemberListTable
      columns={columns}
      rows={rows}
      loading={loading}
      noDataText="No current accounts"
    />
  );
}
