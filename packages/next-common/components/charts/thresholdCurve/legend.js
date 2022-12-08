import styled from "styled-components";
import Flex from "../../styled/flex";
import { p_12_medium } from "../../../styles/componentCss";

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
  }

  &:not(:last-child) {
    margin-right: 16px;
  }
`;

const SupportItem = styled(Item)`
  &::before {
    border: 1px solid ${(p) => p.theme.primaryDarkBlue};
  }
`;
const ApprovalItem = styled(Item)`
  &::before {
    border: 1px solid ${(p) => p.theme.secondaryGreen500};
  }
`;

export default function ThresholdCurvesLegend() {
  return (
    <Flex>
      <SupportItem>Support</SupportItem>
      <ApprovalItem>Approval</ApprovalItem>
    </Flex>
  );
}
