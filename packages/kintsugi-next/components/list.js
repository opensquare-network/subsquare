import styled from "styled-components";

import Post from "./post";
import Pagination from "next-common/components/pagination";
import EmptyList from "next-common/components/emptyList";
import Flex from "next-common/components/styled/flex";

const Wrapper = styled.div`
  max-width: 848px;
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
`;

export default function List({
  chain,
  category,
  items,
  pagination,
  create = null,
  summary,
}) {
  return (
    <Wrapper>
      <Title>
        {category}
        {create}
      </Title>
      {summary}
      {items?.length > 0 ? (
        items.map((item, index) => (
          <Post key={index} data={item} chain={chain} href={item.detailLink} />
        ))
      ) : (
        <EmptyList type={category} />
      )}
      {pagination && <Pagination {...pagination} />}
    </Wrapper>
  );
}
