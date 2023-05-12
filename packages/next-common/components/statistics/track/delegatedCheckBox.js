import React from "react";
import CheckBox from "next-common/components/checkBox";
import FlexBetweenCenter from "next-common/components/styled/flexBetweenCenter";
import styled from "styled-components";

const Wrapper = styled(FlexBetweenCenter)`
  cursor: pointer;
  gap: 8px;
`;

const Text = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: #1e2134;
`;

export default function DelegatedCheckBox({ setChecked, checked }) {
  return (
    <Wrapper onClick={() => setChecked(!checked)}>
      <CheckBox checked={checked} />
      <Text>Delegated</Text>
    </Wrapper>
  );
}
