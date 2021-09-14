import styled from "styled-components";

import List from "./list";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 26px;
  }
`;

export default function Overview({ OverviewData, chain }) {
  return (
    <Wrapper>
      {OverviewData.map((item, index) => (
        <List
          chain={chain}
          key={index}
          category={item.category}
          type={item.type}
          items={item.items}
        />
      ))}
    </Wrapper>
  );
}
