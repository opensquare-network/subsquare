import React from "react";
import Checkbox from "next-common/components/checkbox";
import FlexBetweenCenter from "next-common/components/styled/flexBetweenCenter";
import styled from "styled-components";

const Wrapper = styled(FlexBetweenCenter)`
  cursor: pointer;
  gap: 8px;
`;

export default function DelegatedCheckBox({ setChecked, checked }) {
  return (
    <Wrapper onClick={() => setChecked(!checked)}>
      <Checkbox checked={checked} className="w-4 h-4" />
      <span className="text12Medium text-textPrimary">Delegated</span>
    </Wrapper>
  );
}
