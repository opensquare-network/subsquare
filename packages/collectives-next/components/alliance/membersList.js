import React from "react";
import MemberListTable from "next-common/components/memberListTable";
import AddressUser from "next-common/components/user/addressUser";

export default function MembersList({ items, loading = false }) {
  const columns = [
    { name: "ACCOUNT", style: { textAlign: "left" } },
    { name: "ROLE", style: { textAlign: "left" } },
  ];

  const rows = items.map((item) => [
    <AddressUser key={item.address} add={item.address} />,
    item.role,
  ]);

  return <MemberListTable columns={columns} rows={rows} loading={loading} />;
}
