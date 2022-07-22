import React from "react";
import styled from "styled-components";
import Item from "./item";
import NoComment from "next-common/components/comment/noComment";
import Pagination from "next-common/components/pagination";

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
`;

export default function PolkassemblyComments({
  user,
  data: { items, page, pageSize, total } = {},
  chain,
}) {
  return (
    <div>
      <Title>Comments</Title>
      {items?.length > 0 && (
        <>
          <div>
            {(items || []).map((item) => (
              <Item key={item.id} data={item} user={user} chain={chain} />
            ))}
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} />
        </>
      )}
      {!items?.length > 0 && <NoComment />}
    </div>
  );
}
