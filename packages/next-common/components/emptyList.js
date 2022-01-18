import React from "react";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import { shadow_100 } from "../styles/componentCss";

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
