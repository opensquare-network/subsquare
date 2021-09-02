import styled from "styled-components";

import Tip from "./tip";
import Pagination from "../pagination";
import EmptyList from "../emptyList";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 600px) {
    margin-left: 16px;
    margin-right: 16px;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
`;


export default function List({ chain, category, items, pagination , create=null }) {
  return (
    <Wrapper>
      <Title>
        {category}
        {create && create}
      </Title>
      {
        items?.length > 0
          ? (
            items.map((item, index) => (
              <Tip key={index} data={item} chain={chain}/>
            ))
          ) : (
            <EmptyList type={category}/>
          )
      }
      {pagination && <Pagination {...pagination} />}
    </Wrapper>
  );
}
