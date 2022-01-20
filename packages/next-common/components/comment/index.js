import React from "react";
import styled from "styled-components";
import Item from "./item";
import Pagination from "next-common/components/pagination";
import NoComment from "./noComment";
import LoginButtons from "./loginButtons";

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
`;

export default function Comments({ user, postId, data, chain, onReply }) {
  return (
    <div>
      <Title>Comments</Title>
      {data?.items?.length > 0 && (
        <>
          <div>
            {(data?.items || []).map((item) => (
              <Item
                key={item._id}
                data={item}
                user={user}
                chain={chain}
                onReply={onReply}
              />
            ))}
          </div>
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
          />
        </>
      )}
      {!data?.items?.length > 0 && <NoComment />}
      {!user && <LoginButtons />}
    </div>
  );
}
