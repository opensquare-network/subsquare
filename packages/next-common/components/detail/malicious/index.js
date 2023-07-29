import {
  IconWrapper,
  MaliciousWrapper,
  WarningText,
} from "next-common/components/detail/malicious/styled";
import WarningIcon from "next-common/assets/imgs/icons/warning.svg";
import React from "react";

export default function Malicious({ children }) {
  return (
    <MaliciousWrapper>
      <WarningText>
        <IconWrapper>
          <WarningIcon />
        </IconWrapper>
        <span>{children}</span>
      </WarningText>
    </MaliciousWrapper>
  );
}
