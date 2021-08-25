import styled from "styled-components";

import Item from "./item";
import Pagination from "components/pagination";
import NoComment from "./noComment";
import LoginButtons from "./loginButtons";
import Input from "./input";
import { useRef, useState } from "react";

const Wrapper = styled.div`
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
`;

export default function Comments({ user, postId, data, chain,onReply }) {
  return (
    <Wrapper>
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
    </Wrapper>
  );
}
