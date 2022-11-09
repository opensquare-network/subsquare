import React from "react";
import styled from "styled-components";
import { p_12_medium, p_14_medium } from "../../styles/componentCss";
import Flex from "../styled/flex";
import flexBetweenCenter from "../styled/flexBetweenCenter";

const Label = styled.span`
  color: ${(p) => p.theme.textContrast};
  ${p_14_medium};
`;
const LabelWrapper = styled(Flex)`
  gap: 8px;
`;

const Badge = styled(Flex)`
  color: ${(p) => p.theme.secondaryPink500};
  background-color: ${(p) => p.theme.secondaryPink100};
  padding: 2px 8px;
  border-radius: 4px;
  ${p_12_medium};
`;

const Wrapper = styled(flexBetweenCenter)`
  height: 40px;
  background-image: linear-gradient(268.11deg, #7b0dc4 0%, #e6007a 100%);
  border-radius: 4px;
  padding: 10px 12px;
  gap: 8px;
`;

export default function Gov2Button({ icon, name }) {
  return (
    <Wrapper>
      <LabelWrapper>
        {icon}
        <Label>{name}</Label>
      </LabelWrapper>
      <Badge>New</Badge>
    </Wrapper>
  );
}
