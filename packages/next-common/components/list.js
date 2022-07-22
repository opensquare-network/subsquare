import React from "react";
import styled, { css } from "styled-components";
import Post from "next-common/components/post";
import Pagination from "next-common/components/pagination";
import EmptyList from "next-common/components/emptyList";
import Flex from "next-common/components/styled/flex";
import useDarkMode from "../utils/hooks/useDarkMode";

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

const Title = styled(Flex)`
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      color: #ffffff;
    `};
`;

export default function List({
  chain,
  category,
  items,
  pagination,
  create = null,
  summary,
}) {
  const [theme] = useDarkMode();
  return (
    <Wrapper>
      <Title theme={theme}>
        {category}
        {create}
      </Title>
      {summary}
      {items?.length > 0 ? (
        items.map((item, index) => (
          <Post
            key={index}
            data={item}
            chain={chain}
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
