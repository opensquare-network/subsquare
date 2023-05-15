import React from "react";
import CheckBox from "next-common/components/checkBox";
import FlexBetweenCenter from "next-common/components/styled/flexBetweenCenter";
import styled from "styled-components";
import { p_12_normal } from "next-common/styles/componentCss";

const Wrapper = styled(FlexBetweenCenter)`
  cursor: pointer;
  gap: 8px;
`;

const Text = styled.span`
  ${p_12_normal}
  color: ${(p) => p.theme.textPrimary};
`;

export default function CheckAllCheckBox({ setChecked, checked }) {
  return (
    <Wrapper onClick={() => setChecked(!checked)}>
      <CheckBox checked={checked} />
      <Text>Check all</Text>
    </Wrapper>
  );
}
