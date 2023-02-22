import User from "next-common/components/user";
import React from "react";
import MemberListTable from "next-common/components/memberListTable";
import { ListWrapper } from "./styled";

export default function MembersList({ items, loading = false }) {
  const columns = [
    { name: "ACCOUNT", style: { textAlign: "left" } },
    { name: "ROLE", style: { textAlign: "left" } },
  ];

  const rows = items.map((item) => [
    <User key={item.address} add={item.address} fontSize={14} />,
    item.role,
  ]);

  return (
    <ListWrapper>
      <MemberListTable columns={columns} rows={rows} loading={loading} />
    </ListWrapper>
  );
}
