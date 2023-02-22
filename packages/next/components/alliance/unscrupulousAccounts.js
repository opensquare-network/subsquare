import User from "next-common/components/user";
import React from "react";
import MemberListTable from "next-common/components/memberListTable";
import { ListWrapper } from "./styled";

export default function UnscrupulousAccounts({ items, loading = false }) {
  const columns = [{ name: "NAME", style: { textAlign: "left" } }];

  const rows = items.map((item) => [
    <User key={item.address} add={item.address} fontSize={14} />,
  ]);

  return (
    <ListWrapper>
      <MemberListTable columns={columns} rows={rows} loading={loading} />
    </ListWrapper>
  );
}
