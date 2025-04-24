import React from "react";

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
  color: var(--textPrimary);
`;

const StatusWrapper = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
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
  width: 12px;
  height: 12px;
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
