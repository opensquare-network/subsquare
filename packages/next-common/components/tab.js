import React from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  padding: 4px;

  ${(p) =>
    p.small
      ? css`
          height: 36px;
        `
      : css`
          height: 48px;
        `}

  flex-grow: 1;

  background: #f6f7fa;
  border-radius: 4px;

  justify-content: space-between;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${(p) =>
    p.small
      ? css`
          padding: 4px auto;
        `
      : css`
          padding: 10px auto;
        `}

  cursor: pointer;
  ${(p) =>
    p.small
      ? css`
          width: 116px;
        `
      : css`
          width: 172px;
        `}

  flex-grow: 1;

  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;

  ${(p) =>
    p.highlight
      ? css`
          color: #1e2134;

          background: #ffffff;

          box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
            0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
            0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
          border-radius: 2px;
        `
      : css`
          color: #9da9bb;
        `}
`;

export default function Tab({ small, tabs, selectedTabId, setSelectedTabId }) {
  return (
    <Wrapper small={small}>
      {tabs?.map(({ tabId, tabTitle }) => (
        <Button
          small={small}
          highlight={selectedTabId === tabId}
          onClick={() => setSelectedTabId(tabId)}
        >
          {tabTitle}
        </Button>
      ))}
    </Wrapper>
  );
}
