import React from "react";
import styled from "styled-components";
import CommonButton, { DisabledButton } from "./styled";
import { LightLoading } from "./loading";

const RawButton = styled(CommonButton)`
  background: ${(props) => props.theme.primaryDarkBlue};
  color: ${(props) => props.theme.textContrast};
`;

export const Disabled = styled(DisabledButton)`
  background: ${(props) => props.theme.grey400Border};
  color: ${(props) => props.theme.textContrast};
`;

export default function SecondaryButton({
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
