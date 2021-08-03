import styled from "styled-components";
import { Fragment } from "react";

import Item from "./item";
import { timelineData } from "utils/data";
import FoldableItem from "./foldableItem";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 4px;
  padding: 48px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
  > :first-child {
    font-weight: bold;
    font-size: 16px;
  }
  > :last-child {
    font-size: 12px;
    color: #9da9bb;
  }
`;

export default function Timeline() {
  return (
    <Wrapper>
      <TitleWrapper>
        <div>Timeline</div>
        <div>Last active 8 days ago</div>
      </TitleWrapper>
      {timelineData.map((item, index) => (
        <Fragment key={index}>
          {Array.isArray(item) ? (
            <FoldableItem data={item} />
          ) : (
            <Item data={item} />
          )}
        </Fragment>
      ))}
    </Wrapper>
  );
}
