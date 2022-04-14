import styled from "styled-components";

export const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  margin-bottom: 8px;
`;

export const TooltipWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

export const TextBox = styled.div`
  display: flex;
  padding: 12px 16px;

  background: #f6f7fa;

  border: 1px solid #ebeef4;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 14px;
`;
