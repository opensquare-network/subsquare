import React from "react";
import { useState } from "react";
import TabHeaders from "./tabHeaders";
import { ListWrapper, TabTitle, Wrapper } from "./styled";

export default function PageTabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.name);
  const tabHeaders = (tabs || []).map((tab) => ({
    value: tab.name,
    content: <TabTitle active={activeTab === tab.name}>{tab.name}</TabTitle>,
    extra: tab.extra,
  }));

  let list = null;
  for (const tab of tabs) {
    if (activeTab === tab.name) {
      list = tab.content;
      break;
    }
  }

  return (
    <Wrapper>
      <TabHeaders
        tabs={tabHeaders}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ListWrapper>{list}</ListWrapper>
    </Wrapper>
  );
}
