import React from "react";
import styled from "styled-components";
import Item from "./item";
import NoComment from "./noComment";

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
`;

export default function PolkassemblyComments({
  user,
  comments = [],
  chain,
}) {
  return (
    <div>
      <Title>Comments</Title>
      {comments?.length > 0 && (
        <>
          <div>
            {(comments || []).map((item) => (
              <Item
                key={item._id}
                data={item}
                user={user}
                chain={chain}
              />
            ))}
          </div>
        </>
      )}
      {!comments?.length > 0 && <NoComment />}
      {/* {!user && <LoginButtons />} */}
    </div>
  );
}
