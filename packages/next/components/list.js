import styled from "styled-components";

import Post from "./post";
import Pagination from "./pagination";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

export default function List({ category, items, pagination }) {
  return (
    <Wrapper>
      <Title>{category}</Title>
      {items.map((item, index) => (
        <Post key={index} data={item} />
      ))}
      {pagination && <Pagination />}
    </Wrapper>
  );
}
