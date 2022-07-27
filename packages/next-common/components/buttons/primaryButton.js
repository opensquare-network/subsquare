import React from "react";
import styled from "styled-components";
import { BackgroundButton, DisabledButton } from "./styled";
import { LightLoading } from "./loading";

const RawButton = styled(BackgroundButton)`
  background: ${(props) => props.theme.primaryPurple500};
`;

const Disabled = styled(DisabledButton)`
  background: ${(props) => props.theme.grey400Border};
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

  return (
    <TargetButton {...props} isLoading={isLoading}>
      {isLoading ? <LightLoading /> : children}
    </TargetButton>
  );
}
