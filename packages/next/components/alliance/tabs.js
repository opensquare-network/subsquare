import noop from "lodash.noop";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const TabWrapper = styled.div`
  cursor: pointer;
`;

export default function Tabs({ tabs = [], setActiveTab = noop }) {
  return (
    <Wrapper>
      {tabs.map((tab) => (
        <TabWrapper onClick={() => setActiveTab(tab.value)}>
          {tab.content}
        </TabWrapper>
      ))}
    </Wrapper>
  );
}
