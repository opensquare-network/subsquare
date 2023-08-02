import React from "react";
import styled from "styled-components";
import { BackgroundButton, DisabledButton } from "./styled";
import { LightLoading } from "./loading";

const RawButton = styled(BackgroundButton)`
  background-color: var(--theme500);
  border-color: var(--theme500);
`;

const Disabled = styled(DisabledButton)`
  background-color: var(--theme300);
  border-color: var(--theme300);
  color: var(--textPrimaryContrast);
`;

export default function PrimaryButton({
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
