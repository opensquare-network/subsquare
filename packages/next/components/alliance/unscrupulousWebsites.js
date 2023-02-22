import styled from "styled-components";
import React from "react";
import { pageHomeLayoutMainContentWidth } from "next-common/utils/constants";
import MemberListTable from "next-common/components/memberListTable";

const Wrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }

  > :not(:first-child) {
    margin-top: 16px;
  }
`;

export default function UnscrupulousWebsites({ items, loading = false }) {
  const columns = [{ name: "URL", style: { textAlign: "left" } }];

  const rows = items.map((item) => [item.url]);

  return (
    <Wrapper>
      <MemberListTable columns={columns} rows={rows} loading={loading} />
    </Wrapper>
  );
}
