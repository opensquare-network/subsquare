import React from "react";
import styled from "styled-components";
import { BackgroundButton } from "./styled";
import { Disabled } from "./secondaryButton";
import { LightLoading } from "./loading";

const RawPositiveButton = styled(BackgroundButton)`
  background-color: var(--green500);
`;

const RawNegativeButton = styled(BackgroundButton)`
  background-color: var(--red500);
`;

function ColorButton({
  children,
  positive = true,
  isLoading = false,
  disabled = false,
  ...props
}) {
  let TargetButton = positive ? RawPositiveButton : RawNegativeButton;
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

export function PositiveButton(props) {
  return <ColorButton {...props} positive={true} />;
}

export function NegativeButton(props) {
  return <ColorButton {...props} positive={false} />;
}
