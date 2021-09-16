import styled from "styled-components";
import { Fragment } from "react";

import Item from "./item";
import FoldableItem from "./foldableItem";
import { timeDurationFromNow } from "utils";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 4px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    max-width: 100%;
    padding: 24px;
    border-radius: 0;
  }
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

export default function Timeline({ data, chain, indent = true }) {
  return (
    <Wrapper>
      <TitleWrapper>
        <div>Timeline</div>
        <div>{`Last active ${timeDurationFromNow(
          data[data.length - 1]?.indexer?.blockTime
        )}`}</div>
      </TitleWrapper>
      {data.map((item, index) => (
        <Fragment key={index}>
          {Array.isArray(item) ? (
            <FoldableItem data={item} chain={chain} indent={indent} />
          ) : (
            <Item data={item} chain={chain} />
          )}
        </Fragment>
      ))}
    </Wrapper>
  );
}
