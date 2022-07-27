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

  background: ${(props) => props.theme.grey100Bg};
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
          padding-top: 4px;
          padding-bottom: 4px;
        `
      : css`
          padding-top: 10px;
          padding-bottom: 10px;
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
          color: ${(props) => props.theme.textPrimary};

          background: ${(props) => props.theme.neutral};

          box-shadow: ${(props) => props.theme.shadow100};
          border-radius: 2px;
        `
      : css`
          color: ${(props) => props.theme.textTertiary};
        `}
`;

export default function Tab({ small, tabs, selectedTabId, setSelectedTabId }) {
  return (
    <Wrapper small={small}>
      {tabs?.map(({ tabId, tabTitle }) => (
        <Button
          key={tabId}
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
