import React from "react";

import styled from "styled-components";
import { GreyPanel } from "../styled/containers/greyPanel";

const StatusWrapper = styled(GreyPanel)`
  padding: 12px 16px;
  justify-content: space-between;
  min-height: 38px;
  > div.value {
    font-size: 14px;
    line-height: 100%;
    font-weight: 500;
    > span {
      color: var(--textTertiary);
      margin-left: 2px;
    }
  }
  > div.result {
    display: flex;
    align-items: center;
    color: var(--textSecondary);
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
    color: var(--textTertiary);
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
