import styled from "styled-components";
import Post from "next-common/components/post";
import Pagination from "next-common/components/pagination/index.js";
import { TitleContainer } from "./styled/containers/titleContainer";
import { EmptyList } from "./emptyList";
import Link from "next/link";

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

export default function PostList({
  title = "",
  titleCount = null,
  titleExtra = null,
  category,
  link,
  items,
  pagination,
  topRightCorner = null,
  summary,
}) {
  return (
    <Wrapper>
      <TitleContainer>
        <div>
          <Link href={link || ""} passHref legacyBehavior>
            <TitleLink>{title ?? category}</TitleLink>
          </Link>

          {!!titleCount && (
            <small className="text-textTertiary ml-2 text14Medium">
              {titleCount}
            </small>
          )}
        </div>
        {titleExtra || topRightCorner}
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
