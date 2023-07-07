import React from "react";
import styled from "styled-components";
import Item from "./item";
import Pagination from "next-common/components/pagination/index.js";
import NoComment from "./noComment";
import LoginButtons from "./loginButtons";
import { TitleContainer } from "../styled/containers/titleContainer";
import { useIsLogin } from "../../context/user";

const Header = styled.div`
  display: flex;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 20px;
  }
  @media screen and (min-width: 768px) {
    justify-content: space-between;
  }
`;

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

export default function Comments({
  data: { items, page, pageSize, total } = {},
  tabs = null,
}) {
  const isLogin = useIsLogin();

  return (
    <div>
      <Header>
        <Title className="w-full">
          <div>Comments</div>
          {tabs}
        </Title>
      </Header>
      {items?.length > 0 && (
        <>
          <div>
            {(items || []).map((item) => (
              <Item key={item._id} data={item} replyToCommentId={item._id} />
            ))}
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} />
        </>
      )}
      {!items?.length > 0 && <NoComment />}
      {!isLogin && (
        <div className="px-6">
          <LoginButtons />
        </div>
      )}
    </div>
  );
}
