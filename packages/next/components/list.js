import styled from "styled-components";

import Post from "./post";
import Tip from "./tip/tip";
import Pagination from "./pagination";
import EmptyList from "./emptyList";

const Wrapper = styled.div`
  @media screen and (max-width: 600px) {
    margin-left: 16px;
    margin-right: 16px;
  }
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
`;

export default function List({
  chain,
  category,
  items,
  pagination,
  create = null,
}) {
  return (
    <Wrapper>
      <Title>
        {category}
        {create && create}
      </Title>
      {items?.length > 0 ? (
        items.map((item, index) => {
          if (category === "Discussions") {
            return (
              <Post
                key={index}
                data={item}
                chain={chain}
                href={`/${chain}/post/${item.postUid}`}
              />
            );
          }
          if (category === "Tips") {
            return <Tip key={index} data={item} chain={chain} />;
          }
          if (category === "Proposals") {
            return (
              <Post
                key={index}
                data={item}
                chain={chain}
                href={`/${chain}/proposal/${item.proposalIndex}`}
              />
            );
          }
        })
      ) : (
        <EmptyList type={category} />
      )}
      {pagination && <Pagination {...pagination} />}
    </Wrapper>
  );
}
