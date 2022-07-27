import React from "react";
import styled from "styled-components";
import { BackgroundButton } from "./styled";
import { Disabled } from "./secondaryButton";
import { LightLoading } from "./loading";

const RawPositiveButton = styled(BackgroundButton)`
  background: ${(props) => props.theme.secondaryGreen500};
`;

const RawNegativeButton = styled(BackgroundButton)`
  background: ${(props) => props.theme.secondaryRed500};
`;

function ColorButton({
  children,
  isPositive = true,
  isLoading = false,
  disabled = false,
  ...props
}) {
  let TargetButton = isPositive ? RawPositiveButton : RawNegativeButton;
  if (disabled) {
    TargetButton = Disabled;
  }

  return (
    <TargetButton {...props} isLoading={isLoading}>
      {isLoading ? <LightLoading /> : children}
    </TargetButton>
  );
}

export function PositiveButton(props) {
  return <ColorButton {...props} isPositive={true} />;
}

export function NegativeButton(props) {
  return <ColorButton {...props} isPositive={false} />;
}
