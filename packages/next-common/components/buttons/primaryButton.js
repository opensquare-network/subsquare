import React from "react";
import styled from "styled-components";
import { BackgroundButton, DisabledButton } from "./styled";
import { LightLoading } from "./loading";

const RawButton = styled(BackgroundButton)`
  height: 40px;
  background-color: var(--theme500);
  border: none;
`;

const Disabled = styled(DisabledButton)`
  height: 40px;
  background-color: var(--theme300);
  border: none;
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
