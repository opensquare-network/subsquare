import React from "react";

import styled from "styled-components";
import Tooltip from "next-common/components/tooltip";

const TooltipWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 8px;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

const Label = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  color: var(--textPrimary);
`;

const StatusWrapper = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--textTertiary);
  margin-left: auto !important;
  display: flex;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

const TooltipDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
`;

export default function PopupLabel({
  text,
  status,
  tooltip,
  tooltipContentClassName,
}) {
  return (
    <TooltipWrapper>
      <Label className="text-textPrimary">{text}</Label>
      {status ? (
        <StatusWrapper>
          <div>{status}</div>
          {tooltip && <Tooltip content={tooltip} />}
        </StatusWrapper>
      ) : (
        tooltip && (
          <TooltipDiv>
            <Tooltip
              content={tooltip}
              contentClassName={tooltipContentClassName}
            />
          </TooltipDiv>
        )
      )}
    </TooltipWrapper>
  );
}
