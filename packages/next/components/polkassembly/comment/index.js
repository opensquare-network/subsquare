import React from "react";
import styled from "styled-components";
import Item from "./item";
import NoComment from "next-common/components/comment/noComment";
import Pagination from "next-common/components/pagination";
import PolkassemblyCommentButton from "./commentButton";
import Loading from "next-common/components/loading";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import useDarkMode from "next-common/utils/hooks/useDarkMode";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

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
  detail,
  isLoading,
  user,
  comments = [],
  chain,
  paId,
  type,
  tabs = null,
  btnRef = null,
}) {
  const [theme] = useDarkMode();

  return (
    <CommentsWrapper theme={theme}>
      <div>
        <Header>
          <Title>Comments</Title>
          {tabs}
        </Header>
        {isLoading ? (
          <LoadingDiv>
            <Loading size={14} />
          </LoadingDiv>
        ) : comments?.length > 0 ? (
          <>
            <div>
              {(comments || []).map((item) => (
                <Item key={item.id} data={item} user={user} chain={chain} />
              ))}
            </div>
          </>
        ) : (
          <NoComment />
        )}
        <PolkassemblyCommentButton
          detail={detail}
          chain={chain}
          paId={paId}
          type={type}
          btnRef={btnRef}
        />
      </div>
    </CommentsWrapper>
  );
}
