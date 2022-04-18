import styled from "styled-components";
import Tooltip from "next-common/components/tooltip";

const TooltipWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  margin-bottom: 8px;
`;

const StatusWrapper = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  color: #9da9bb;
  margin-left: auto !important;
  display: flex;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

export default function PopupLabel({ text, status, tooltip }) {
  return (
    <TooltipWrapper>
      <Label>{text}</Label>
      {status ? (
        <StatusWrapper>
          <div>{status}</div>
          {tooltip && <Tooltip content={tooltip} />}
        </StatusWrapper>
      ) : (
        tooltip && <Tooltip content={tooltip} />
      )}
    </TooltipWrapper>
  );
}
