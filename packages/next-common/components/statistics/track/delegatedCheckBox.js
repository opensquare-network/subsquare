import React from "react";
import CheckBox from "next-common/components/checkBox";
import FlexBetweenCenter from "next-common/components/styled/flexBetweenCenter";
import styled from "styled-components";

const Wrapper = styled(FlexBetweenCenter)`
  cursor: pointer;
  gap: 8px;
`;

export default function DelegatedCheckBox({ setChecked, checked }) {
  return (
    <Wrapper onClick={() => setChecked(!checked)}>
      <CheckBox checked={checked} />
      <span className="text12Medium text-textPrimary">Delegated</span>
    </Wrapper>
  );
}
