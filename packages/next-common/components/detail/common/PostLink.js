import React from "react";
import styled from "styled-components";
import noop from "lodash.noop";
import LinkIcon from "../../../assets/imgs/icons/link.svg";

const Wrapper = styled.div`
  cursor: pointer;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: ${(props) => props.theme.textSecondary};
  display: flex;
  align-items: center;

  svg {
    margin-left: 8px;
    margin-right: 4px;
  }
`;

export default function PostLink({ onClick = noop }) {
  return (
    <Wrapper onClick={onClick}>
      <LinkIcon />
      Link
    </Wrapper>
  );
}
