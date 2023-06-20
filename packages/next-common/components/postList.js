import React from "react";
import styled from "styled-components";
import Post from "next-common/components/post";
import Pagination from "next-common/components/pagination/index.js";
import { TitleContainer } from "./styled/containers/titleContainer";
import { EmptyList } from "./emptyList";
import Link from "next/link";
import {
  flex,
  gap_x,
  items_center,
  justify_between,
  text_tertiary,
} from "next-common/styles/tailwindcss";
import { p_14_medium, p_16_bold } from "next-common/styles/componentCss";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 768px) {
    margin-left: 16px;
    margin-right: 16px;
  }
`;

const TitleLink = styled.a`
  &:hover {
    text-decoration: underline;
  }
`;

const ListTitleGroup = styled.div`
  margin: 16px 0;
  padding-top: 8px;
  ${flex};
  ${justify_between};
  ${items_center};
`;

const ListTitle = styled.h3`
  margin: 0;
  ${gap_x(8)};
  color: var(--textPrimary);
  ${p_16_bold};
`;

const ListTitleCount = styled.small`
  ${text_tertiary};
  ${p_14_medium};
  margin-left: 8px;
`;

export default function PostList({
  title,
  category,
  link,
  items,
  pagination,
  topRightCorner = null,
  summary,
  listTitle = "",
  listTitleExtra,
  listTitleCount = null,
}) {
  return (
    <Wrapper>
      <TitleContainer>
        <Link href={link || ""} passHref legacyBehavior>
          <TitleLink>{title ?? category}</TitleLink>
        </Link>
        {topRightCorner}
      </TitleContainer>
      {summary}

      {listTitle && (
        <ListTitleGroup>
          <ListTitle>
            {listTitle}
            {!!listTitleCount && (
              <ListTitleCount>{listTitleCount}</ListTitleCount>
            )}
          </ListTitle>
          {listTitleExtra}
        </ListTitleGroup>
      )}

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
