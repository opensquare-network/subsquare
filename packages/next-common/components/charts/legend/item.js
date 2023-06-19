import Flex from "../../styled/flex";
import { p_12_medium } from "../../../styles/componentCss";
import styled, { css } from "styled-components";

const LegendItem = styled(Flex)`
  color: var(--textSecondary);
  ${p_12_medium};

  &::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 2px;
    margin-right: 8px;
    border-radius: 9999px;
    background-image: linear-gradient(
      to right,
      ${(p) => p.color} 0%,
      ${(p) => p.color} 50%,
      transparent 50%
    );
    background-repeat: repeat-x;

    background-size: 20px;
    ${(p) =>
      p.dashed &&
      css`
        background-size: 7px 2px;
      `}
  }

  &:not(:last-child) {
    margin-right: 16px;
  }
`;

export default LegendItem;
