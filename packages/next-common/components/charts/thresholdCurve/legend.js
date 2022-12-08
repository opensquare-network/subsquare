import styled from "styled-components";
import Flex from "../../styled/flex";
import { p_12_medium } from "../../../styles/componentCss";
import light from "../../styled/theme/light";
import dark from "../../styled/theme/dark";

const Item = styled(Flex)`
  color: ${(p) => p.theme.textSecondary};
  ${p_12_medium};

  &::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 0;
    margin-right: 8px;
    border-radius: 9999px;
    border: 1px solid ${(p) => p.borderColor};
  }

  &:not(:last-child) {
    margin-right: 16px;
  }
`;

export default function ThresholdCurvesLegend() {
  return (
    <Flex>
      <Item borderColor={dark.primaryDarkBlue}>Support</Item>
      <Item borderColor={light.secondaryGreen500}>Approval</Item>
    </Flex>
  );
}
