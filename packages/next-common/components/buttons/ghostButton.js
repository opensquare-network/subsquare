import React from "react";
import styled from "styled-components";
import CommonButton, { DisabledButton } from "./styled";
import { DarkLoading } from "./loading";

const RawButton = styled(CommonButton)`
  background: ${(props) => props.theme.neutral};
  color: ${(props) => props.theme.textPrimary};
  border: 1px solid ${(props) => props.theme.grey300Border};
`;

const Disabled = styled(DisabledButton)`
  background: ${(props) => props.theme.grey400Border};
  color: ${(props) => props.theme.textTertiary};
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
