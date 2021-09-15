import styled from "styled-components";

import Post from "./post";
import Pagination from "./pagination";
import EmptyList from "./emptyList";

const Wrapper = styled.div`
  max-width: 848px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;

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
  type = null,
}) {
  return (
    <Wrapper>
      <Title>
        {category}
        {create}
      </Title>
      {items?.length > 0 ? (
        items.map((item, index) => {
          let href = `/${chain}/post/${item.postUid}`;
          if (category === "External Proposals") {
            href = `/${chain}/democracy/external/${item.hash}`;
          }
          else if (category === "Referenda") {
            href = `/${chain}/democracy/referendum/${item.index}`;
          }
          else if (category === "Council Motions") {
            href = `/${chain}/council/motion/${item.index}`;
          }
          else if (category === "Tips") {
            href = `/${chain}/treasury/tip/${item.height}_${item.hash}`;
          }
          else if (category === "Public Proposals") {
            href = `/${chain}/democracy/proposal/${item.proposalIndex}`;
          }
          else if (category === "Treasury Proposals") {
            href = `/${chain}/treasury/proposal/${item.proposalIndex}`;
          }
          else if (category === "Technical Committee Proposals") {
            href = `/${chain}/techcomm/proposal/${item.proposalIndex}`;
          }

          return <Post key={index} data={item} chain={chain} href={href} />;
        })
      ) : (
        <EmptyList type={category} />
      )}
      {pagination && <Pagination {...pagination} />}
    </Wrapper>
  );
}
