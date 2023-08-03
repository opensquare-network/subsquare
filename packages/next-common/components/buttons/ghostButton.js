import React from "react";
import styled from "styled-components";
import CommonButton, { DisabledButton } from "./styled";
import { DarkLoading } from "./loading";

const RawButton = styled(CommonButton)`
  background-color: var(--neutral100);
  color: var(--textPrimary);
  border: 1px solid var(--neutral400);
`;

const Disabled = styled(DisabledButton)`
  background-color: var(--neutral500);
  color: var(--textTertiary);
`;

export default function GhostButton({
  children,
  isLoading = false,
  disabled = false,
  ...props
}) {
  let TargetButton = RawButton;
  if (disabled) {
    TargetButton = Disabled;
  }

  const allProps = {
    isLoading,
    disabled,
    ...props,
  };

  return (
    <TargetButton {...allProps}>
      {isLoading ? <DarkLoading /> : children}
    </TargetButton>
  );
}
