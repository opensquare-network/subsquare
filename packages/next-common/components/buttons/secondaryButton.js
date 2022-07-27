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
`;

const RawPositiveButton = styled(CommonButton)`
  background: ${(props) => props.theme.secondaryGreen500};
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

  return (
    <TargetButton {...props} isLoading={isLoading}>
      {isLoading ? <LightLoading /> : children}
    </TargetButton>
  );
}
