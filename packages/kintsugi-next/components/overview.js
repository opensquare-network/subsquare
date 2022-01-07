import styled from "styled-components";

import List from "./list";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 26px;
  }
`;

export default function Overview({ overviewData, chain }) {
  return (
    <Wrapper>
      {overviewData.map((item, index) => {
        if (item) {
          return (
            <List
              chain={chain}
              key={index}
              category={item.category}
              items={item.items}
              type={item.type}
            />
          );
        }
      })}
    </Wrapper>
  );
}
