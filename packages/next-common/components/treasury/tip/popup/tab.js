import { useState } from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;

  display: flex;
  padding: 4px;

  height: 48px;
  flex-grow: 1;

  background: #F6F7FA;
  border-radius: 4px;

  justify-content: space-between;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 12px;

  cursor: pointer;

  width: 172px;
  flex-grow: 1;

  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;

  ${p => p.highlight
    ? css`
        color: #1E2134;

        background: #FFFFFF;

        box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02), 0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221), 0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
        border-radius: 2px;
      `
    : css`
        color: #9DA9BB;
      `
  }
`;

export const ReportAwesome = "ReportAwesome";
export const NewTip = "NewTip";

export default function Tab({ tabIndex, setTabIndex }) {
  return (
    <Wrapper>
      <Button
        highlight={tabIndex === ReportAwesome}
        onClick={() => setTabIndex(ReportAwesome)}
      >
      Repoty Awesome
      </Button>
      <Button
        highlight={tabIndex === NewTip}
        onClick={() => setTabIndex(NewTip)}
      >
      Tip New
      </Button>
    </Wrapper>
  );
}
