import React from "react";
import styled from "styled-components";
import Post from "next-common/components/post";
import Pagination from "next-common/components/pagination/index.js";
import { TitleContainer } from "./styled/containers/titleContainer";
import MaybeEmpty from "./emptyList";

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

export default function PostList({
  chain,
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
      <MaybeEmpty items={items} type={category}>
        {
          items.map((item, index) => (
            <Post
              key={index}
              data={item}
              chain={chain}
              href={item.detailLink}
              type={category}
            />
          ))
        }
      </MaybeEmpty>
      {pagination && <Pagination {...pagination} />}
    </Wrapper>
  );
}
