import React from "react";
import styled from "styled-components";

import List from "next-common/components/list";
import PlusIcon from "../../assets/imgs/icons/plusInCircle.svg";
import EmptyOverview from "./emptyOverview";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 26px;
  }
`;

const Create = styled.a`
  display: flex;
  align-items: center;
  color: #6848ff;
  font-size: 14px;
  white-space: nowrap;
  svg {
    margin-right: 8px;
  }
  cursor: pointer;
`;

export default function Overview({ overviewData, chain }) {
  if (overviewData?.[0]?.items?.length === 0) {
    // All items are empty, show default empty page
    return (
      <Wrapper>
        <EmptyOverview />
      </Wrapper>
    );
  }

  const createDiscussion = (
    <Create href="post/create">
      <PlusIcon />
      New Discussion
    </Create>
  );

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
              create={item.category === "Discussions" && createDiscussion}
            />
          );
        }
      })}
    </Wrapper>
  );
}
