import React from "react";
import styled, { css } from "styled-components";
import Flex from "next-common/components/styled/flex";
import { shadow_100 } from "../styles/componentCss";
import useDarkMode from "../utils/hooks/useDarkMode";

const Wrapper = styled(Flex)`
  justify-content: center;
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 24px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  text-align: center;
  color: #9da9bb;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;
      color: #fff;
    `};
`;

export default function EmptyList({ type = "discussions" }) {
  const [theme] = useDarkMode();

  return (
    <Wrapper theme={theme}>
      <span>
        No current <span style={{ textTransform: "lowercase" }}>{type}</span>
      </span>
    </Wrapper>
  );
}
