import React from "react";
import styled from "styled-components";
import { Approve, Reject } from "../icons";

const Wrapper = styled.span`
  white-space: nowrap;
  display: flex;
  align-items: center;
  color: var(--textPrimary);
  > span {
    margin-left: 4px;
  }
`;

export default function AyeNay({ isAye = true }) {
  const text = isAye ? "Aye" : "Nay";
  const icon = isAye ? <Approve /> : <Reject />;

  return (
    <Wrapper>
      {text} {icon}
    </Wrapper>
  );
}
