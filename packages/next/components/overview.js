import styled from "styled-components";

import List from "./list";
import { OverviewData } from "utils/data";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 26px;
  }
`;

export default function Overview() {
  return (
    <Wrapper>
      {OverviewData.map((item, index) => (
        <List key={index} category={item.category} items={item.items} />
      ))}
    </Wrapper>
  );
}
