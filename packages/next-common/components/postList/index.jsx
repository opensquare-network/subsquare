import styled from "styled-components";
import Post from "./post";
import Pagination from "next-common/components/pagination/index.js";
import { EmptyList } from "../emptyList";
import ListTitleBar from "../listTitleBar";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  > :not(:first-child) {
    margin-top: 16px;
  }
`;

export default function PostList({
  title = "List",
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
      <ListTitleBar
        title={title ?? category}
        titleCount={titleCount}
        titleExtra={titleExtra ?? topRightCorner}
        link={link}
      />

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
