import React from "react";

import styled from "styled-components";

const StatusWrapper = styled.div`
  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 38px;
  > div.value {
    font-size: 14px;
    line-height: 100%;
    font-weight: 500;
    > span {
      color: ${(props) => props.theme.textTertiary};
      margin-left: 2px;
    }
  }
  > div.result {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.textSecondary};
    > svg {
      margin-left: 8px;
    }
  }
  > img {
    margin: 0 auto;
  }
  > div.no-data {
    font-size: 14px;
    line-height: 100%;
    color: ${(props) => props.theme.textTertiary};
    flex-grow: 1;
    text-align: center;
  }
`;

export default function NoDataStatusBox({ text }) {
  return (
    <StatusWrapper>
      <div className="no-data">{text}</div>
    </StatusWrapper>
  );
}
