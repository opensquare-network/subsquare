import React from "react";
import styled from "styled-components";
import Pagination from "next-common/components/pagination/index.js";
import EmptyList from "next-common/components/emptyList";
import { TitleContainer } from "./styled/containers/titleContainer";
import CommentSimple from "./commentSimple.js";

const Wrapper = styled.div`
  max-width: 932px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;

  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 768px) {
    margin-left: 16px;
    margin-right: 16px;
  }
`;

export default function CommentList({
  chain,
  category,
  items,
  pagination,
  create = null,
  summary,
}) {
  return (
    <Wrapper>
      <TitleContainer>
        {category}
        {create}
      </TitleContainer>
      {summary}
      {items?.length > 0 ? (
        items.map((item, index) => (
          <CommentSimple
            key={index}
            data={item}
            chain={chain}
            type={category}
          />
        ))
      ) : (
        <EmptyList type={category} />
      )}
      {pagination && <Pagination {...pagination} />}
    </Wrapper>
  );
}
