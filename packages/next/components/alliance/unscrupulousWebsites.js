import React from "react";
import MemberListTable from "next-common/components/memberListTable";
import { ListWrapper } from "./styled";

export default function UnscrupulousWebsites({ items, loading = false }) {
  const columns = [{ name: "URL", style: { textAlign: "left" } }];

  const rows = items.map((item) => [item.url]);

  return (
    <ListWrapper>
      <MemberListTable columns={columns} rows={rows} loading={loading} />
    </ListWrapper>
  );
}
