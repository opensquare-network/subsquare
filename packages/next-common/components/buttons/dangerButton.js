import React from "react";
import styled from "styled-components";
import CommonButton, { DisabledButton } from "./styled";
import { LightLoading } from "./loading";

const RawButton = styled(CommonButton)`
  background-color: var(--red500);
  color: var(--textPrimaryContrast);
  border-color: var(--red500);
`;

export const Disabled = styled(DisabledButton)`
  background-color: var(--neutral500);
  color: var(--textPrimaryContrast);
  border-color: var(--neutral500);
`;

export default function DangerButton({
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
      {isLoading ? <LightLoading /> : children}
    </TargetButton>
  );
}
