import React from "react";
import styled from "styled-components";
import Post from "next-common/components/post";
import Pagination from "next-common/components/pagination/index.js";
import { TitleContainer } from "./styled/containers/titleContainer";
import { EmptyList } from "./emptyList";

const Wrapper = styled.div`
  max-width: 916px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }

  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 768px) {
    margin-left: 16px;
    margin-right: 16px;
  }
`;

export default function PostList({
  title,
  category,
  items,
  pagination,
  create = null,
  summary,
}) {
  return (
    <Wrapper>
      <TitleContainer>
        {title ?? category}
        {create}
      </TitleContainer>
      {summary}
      {items?.length > 0 ? (
        items.map((item, index) => (
          <Post
            key={index}
            data={item}
            href={item.detailLink}
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
