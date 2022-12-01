import React from "react";
import styled from "styled-components";
import Item from "./item";
import NoComment from "next-common/components/comment/noComment";
import PolkassemblyCommentButton from "./commentButton";
import Loading from "next-common/components/loading";
import CommentsWrapper from "next-common/components/styled/commentsWrapper";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

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

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  padding: 18px 0;
`;

export default function PolkassemblyComments({
  detail,
  isLoading,
  comments = [],
  paId,
  tabs = null,
  btnRef = null,
}) {
  return (
    <CommentsWrapper>
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
                <Item key={item.id} data={item} />
              ))}
            </div>
          </>
        ) : (
          <NoComment />
        )}
        <PolkassemblyCommentButton
          detail={detail}
          paId={paId}
          btnRef={btnRef}
        />
      </div>
    </CommentsWrapper>
  );
}
