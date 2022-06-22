import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Flex from "./styled/flex";
import ArrowLeft from "./icons/arrowLeft";

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
`;

export default function Back({ href, text }) {
  return (
    <Link href={href} passHref>
      <Wrapper>
        <ArrowLeft />
        <span>{text}</span>
      </Wrapper>
    </Link>
  );
}
