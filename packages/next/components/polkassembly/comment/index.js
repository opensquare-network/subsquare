import React from "react";
import styled from "styled-components";
import Item from "./item";
import NoComment from "next-common/components/comment/noComment";
import Pagination from "next-common/components/pagination";
import PolkassemblyCommentButton from "./commentButton";
import Loading from "next-common/components/loading";

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
`;

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  padding: 18px 0;
`;

export default function PolkassemblyComments({
  isLoading,
  user,
  data: { items, page, pageSize, total } = {},
  chain,
  paId,
  type,
}) {
  return (
    <div>
      <Title>Comments</Title>
      {
        isLoading ? (
          <LoadingDiv>
            <Loading size={14} />
          </LoadingDiv>
        ) : (
          items?.length > 0 ? (
            <>
              <div>
                {(items || []).map((item) => (
                  <Item key={item.id} data={item} user={user} chain={chain} />
                ))}
              </div>
              <Pagination page={page} pageSize={pageSize} total={total} />
            </>
          ) :(
            <NoComment />
          )
        )
      }

      <PolkassemblyCommentButton chain={chain} paId={paId} type={type} />
    </div>
  );
}
