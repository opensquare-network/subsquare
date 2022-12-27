import React from "react";
import styled from "styled-components";
import { p_16_bold } from "../../../styles/componentCss";
import Tooltip from "../../tooltip";
import Link from "next/link";

const TypeValue = styled.a`
  margin-left: 4px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  ${p_16_bold};
`;

export default function ActiveValue({ tooltip, href, value }) {
  return (
    <Tooltip content={tooltip}>
      <Link passHref href={href}>
        <TypeValue>{value}</TypeValue>
      </Link>
    </Tooltip>
  );
}
