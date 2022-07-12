import React from "react";
import styled, { css } from "styled-components";
import Link from "next/link";
import Flex from "./styled/flex";
import ArrowLeft from "./icons/arrowLeft";
import useDarkMode from "../utils/hooks/useDarkMode";

const Wrapper = styled(Flex)`
  font-size: 16px;
  line-height: 16px;
  font-weight: bold;
  cursor: pointer;

  > svg {
    margin-right: 12px;
  }

  @media screen and (max-width: 768px) {
    margin-left: 16px;
  }

  ${(props) =>
    props?.theme === "dark" &&
    css`
      color: #fff;
      > svg {
        fill: white;
        path {
          stroke: white;
        }
      }
    `};
`;

export default function Back({ href, text }) {
  const [theme] = useDarkMode();

  return (
    <Link href={href} passHref>
      <Wrapper theme={theme}>
        <ArrowLeft />
        <span>{text}</span>
      </Wrapper>
    </Link>
  );
}
