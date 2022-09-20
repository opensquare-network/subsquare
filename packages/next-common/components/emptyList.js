import React from "react";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import { shadow_100 } from "../styles/componentCss";

const Wrapper = styled(Flex)`
  justify-content: center;
  border: 1px solid ${(props) => props.theme.grey200Border};
  ${shadow_100};
  border-radius: 6px;
  padding: 24px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  text-align: center;
  background: ${(props) => props.theme.neutral};
  color: ${(props) => props.theme.textTertiary};
`;

export default function EmptyList({ type = "discussions" }) {
  return (
    <Wrapper>
      <span>
        No current <span style={{ textTransform: "lowercase" }}>{type}</span>
      </span>
    </Wrapper>
  );
}
